import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearConstructor } from '../constructor/slice';

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredients: string[], { dispatch, rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      dispatch(clearConstructor());
      return response.order;
    } catch (err) {
      return rejectWithValue('Ошибка оформления заказа');
    }
  }
);
