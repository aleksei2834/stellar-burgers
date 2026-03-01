import {
  addIngredient,
  constructorSlice,
  moveDown,
  moveUp,
  deleteIngredient,
  TConstructorState
} from '../constructor/slice';
import { TIngredient } from '@utils-types';
import { configureStore, nanoid } from '@reduxjs/toolkit';
import { orderBurger } from '../order/actions';
import * as burgerApi from '../../utils/burger-api';
import { orderSlice } from '../order/slice';

describe('Проверяют редьюсер слайса burgerConstructor', () => {
  test('добавление булочки', () => {
    const initialState: TConstructorState = {
      bun: null,
      ingredients: []
    };
    const bun: TIngredient = {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    };
  });

  test('добавление ингредиента', () => {
    const initialState: TConstructorState = {
      bun: null,
      ingredients: []
    };
    const ingredient: TIngredient = {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    };
    const newState = constructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );
    const expectedIngredient = newState.ingredients[0];

    expect(expectedIngredient).toHaveProperty('id');
    const { id, ...rest } = expectedIngredient;
    expect(rest).toEqual(ingredient);
  });

  test('удаление ингредиента', () => {
    const ingredient: TIngredient & { id: string } = {
      id: nanoid(),
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    };
    const initialState: TConstructorState = {
      bun: null,
      ingredients: [ingredient]
    };
    const newState = constructorSlice.reducer(
      initialState,
      deleteIngredient(ingredient.id)
    );
    const ingredients = newState.ingredients;

    expect(ingredients).toHaveLength(0);
  });

  describe('перемещение ингредиентов', () => {
    let initialState: TConstructorState;
    const ingredient1: TIngredient & { id: string } = {
      id: nanoid(),
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    };
    const ingredient2: TIngredient & { id: string } = {
      id: nanoid(),
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    };

    beforeEach(() => {
      initialState = {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      };
    });

    test('перемещение первого ингредиента вниз', () => {
      const newState = constructorSlice.reducer(initialState, moveDown(0));
      const expectedIngredients = newState.ingredients;

      expect(ingredient1).toEqual(expectedIngredients[1]);
      expect(ingredient2).toEqual(expectedIngredients[0]);
    });

    test('перемещение второго ингредиента вверх', () => {
      const newState = constructorSlice.reducer(initialState, moveUp(1));
      const expectedIngredients = newState.ingredients;

      expect(ingredient1).toEqual(expectedIngredients[1]);
      expect(ingredient2).toEqual(expectedIngredients[0]);
    });
  });

  describe('тест асинхронных экшенов', () => {
    test('совершение нового заказа', async () => {
      const orderBurgerRequest = [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ];
      const expectedOrderData = {
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d'
        ],
        _id: '69a22b82a64177001b32dfe3',
        status: 'done',
        name: 'Флюоресцентный люминесцентный бургер',
        createdAt: '2026-02-27T23:40:50.483Z',
        updatedAt: '2026-02-27T23:40:50.732Z',
        number: 102089
      };
      const orderBurgerResponse = {
        success: true,
        name: 'Флюоресцентный люминесцентный бургер',
        order: expectedOrderData
      };
      const orderBurgerMock = jest
        .spyOn(burgerApi, 'orderBurgerApi')
        .mockResolvedValue(orderBurgerResponse);
      const store = configureStore({
        reducer: {
          order: orderSlice.reducer
        }
      });

      await store.dispatch(orderBurger(orderBurgerRequest));

      const { orderModalData } = store.getState().order;

      expect(orderBurgerMock).toHaveBeenCalledWith(orderBurgerRequest);
      expect(orderModalData).toEqual(expectedOrderData);
    });
  });
});
