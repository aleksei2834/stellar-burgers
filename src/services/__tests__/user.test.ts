import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/slice';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  checkUserAuth,
  updateUser,
  logout
} from '../auth/actions';
import * as burgerApi from '../../utils/burger-api';
import * as cookie from '../../utils/cookie';

jest.mock('../../utils/burger-api');
jest.mock('../../utils/cookie');

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    // Добавляем метод для тестирования вызовов
    setItemMock: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItemMock: jest.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

window.localStorage.setItem = jest.fn();
window.localStorage.removeItem = jest.fn();

describe('auth actions', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  const mockUser = {
    email: 'test@mail.com',
    name: 'Test User'
  };

  describe('registerUser', () => {
    const registerData = {
      email: 'test@mail.com',
      password: 'password123',
      name: 'Test User'
    };

    test('успешная регистрация', async () => {
      const mockResponse = {
        user: mockUser,
        accessToken: 'fake-token',
        refreshToken: 'fake-refresh'
      };

      (burgerApi.registerUserApi as jest.Mock).mockResolvedValue(mockResponse);

      await store.dispatch(registerUser(registerData));

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(cookie.setCookie).toHaveBeenCalledWith(
        'accessToken',
        'fake-token'
      );

      const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
      expect(setItemSpy).toHaveBeenCalledWith('refreshToken', 'fake-refresh');
    });

    test('ошибка регистрации', async () => {
      const error = new Error('API Error');
      (burgerApi.registerUserApi as jest.Mock).mockRejectedValue(error);

      const result = await store.dispatch(registerUser(registerData));

      const state = store.getState().auth;

      expect(result.type).toBe('auth/register/rejected');

      expect(state.error).toBe('Rejected');
      expect(state.user).toBeNull();
      expect(cookie.deleteCookie).toHaveBeenCalledWith('accessToken');

      const removeItemSpy = jest.spyOn(window.localStorage, 'removeItem');
      expect(removeItemSpy).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('loginUser', () => {
    const loginData = {
      email: 'test@mail.com',
      password: 'password123'
    };

    test('успешный логин', async () => {
      const mockResponse = {
        user: mockUser,
        accessToken: 'fake-token',
        refreshToken: 'fake-refresh'
      };

      (burgerApi.loginUserApi as jest.Mock).mockResolvedValue(mockResponse);

      await store.dispatch(loginUser(loginData));

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    test('ошибка логина', async () => {
      const error = new Error('Invalid credentials');
      (burgerApi.loginUserApi as jest.Mock).mockRejectedValue(error);

      const result = await store.dispatch(loginUser(loginData));

      const state = store.getState().auth;

      expect(result.type).toBe('auth/login/rejected');
      expect(state.error).toBe('Invalid credentials');
      expect(state.user).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    const forgotData = { email: 'test@mail.com' };

    test('успешный запрос на сброс пароля', async () => {
      (burgerApi.forgotPasswordApi as jest.Mock).mockResolvedValue({
        success: true
      });

      await store.dispatch(forgotPassword(forgotData));

      const state = store.getState().auth;
      expect(state.isLoading).toBe(false);
    });

    test('ошибка запроса на сброс пароля', async () => {
      (burgerApi.forgotPasswordApi as jest.Mock).mockRejectedValue(new Error());

      const result = await store.dispatch(forgotPassword(forgotData));

      const state = store.getState().auth;

      expect(result.type).toBe('auth/forgotPassword/rejected');

      expect(state.error).toBe('Rejected');
    });
  });

  describe('resetPassword', () => {
    const resetData = {
      password: 'newpassword123',
      token: 'reset-token'
    };

    test('успешный сброс пароля', async () => {
      (burgerApi.resetPasswordApi as jest.Mock).mockResolvedValue({
        success: true
      });

      await store.dispatch(resetPassword(resetData));

      const state = store.getState().auth;
      expect(state.isLoading).toBe(false);
    });

    test('ошибка сброса пароля', async () => {
      (burgerApi.resetPasswordApi as jest.Mock).mockRejectedValue(new Error());

      const result = await store.dispatch(resetPassword(resetData));

      const state = store.getState().auth;

      expect(result.type).toBe('auth/resetPassword/rejected');
      expect(state.error).toBe('Rejected');
    });
  });

  describe('checkUserAuth', () => {
    test('проверка авторизации с токеном', async () => {
      (burgerApi.isTokenExists as jest.Mock).mockReturnValue(true);
      (burgerApi.getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

      await store.dispatch(checkUserAuth());

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    test('проверка авторизации без токена', async () => {
      (burgerApi.isTokenExists as jest.Mock).mockReturnValue(false);

      await store.dispatch(checkUserAuth());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(burgerApi.getUserApi).not.toHaveBeenCalled();
    });

    test('ошибка при проверке авторизации с токеном', async () => {
      (burgerApi.isTokenExists as jest.Mock).mockReturnValue(true);
      const error = new Error('Auth error');
      (burgerApi.getUserApi as jest.Mock).mockRejectedValue(error);

      const result = await store.dispatch(checkUserAuth());

      const state = store.getState().auth;

      expect(result.type).toBe('user/checkUserAuth/rejected');
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    const updatedUser = {
      name: 'Updated Name'
    };

    test('успешное обновление пользователя', async () => {
      (burgerApi.updateUserApi as jest.Mock).mockResolvedValue({
        user: { ...mockUser, ...updatedUser }
      });

      await store.dispatch(updateUser(updatedUser));

      const state = store.getState().auth;
      expect(state.user).toEqual({ ...mockUser, ...updatedUser });
      expect(state.isLoading).toBe(false);
    });

    test('ошибка обновления пользователя', async () => {
      (burgerApi.updateUserApi as jest.Mock).mockRejectedValue(new Error());

      const result = await store.dispatch(updateUser(updatedUser));

      const state = store.getState().auth;

      expect(result.type).toBe('auth/updateUser/rejected');
      expect(state.error).toBe('Rejected');
    });
  });

  describe('logout', () => {
    test('успешный выход', async () => {
      (burgerApi.logoutApi as jest.Mock).mockResolvedValue({ success: true });

      await store.dispatch(logout());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    test('ошибка при выходе', async () => {
      (burgerApi.logoutApi as jest.Mock).mockRejectedValue(new Error());

      const result = await store.dispatch(logout());

      const state = store.getState().auth;

      expect(result.type).toBe('auth/logout/rejected');
      expect(state.error).toBeDefined();
    });
  });
});
