import {
  forgotPasswordApi,
  getUserApi,
  isTokenExists,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '../../utils/cookie';
import { setIsAuthChecked, setIsAuthenticated, setUser } from './slice';

const token = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const deleteToken = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      token(res.accessToken, res.refreshToken);
      return res.user;
    } catch (err) {
      deleteToken();
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => await loginUserApi(data)
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordApi(payload);
      return res.success;
    } catch (err) {
      return rejectWithValue('Не удалось обновить пароль');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const res = await resetPasswordApi(payload);
      return res.success;
    } catch (err) {
      return rejectWithValue('Не удалось сбросить пароль');
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (isTokenExists()) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .then(() => dispatch(setIsAuthenticated(true)))
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(user);
      return res.user;
    } catch (err) {
      return rejectWithValue('Не удалось обновить данные пользователя');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => await logoutApi()
);
