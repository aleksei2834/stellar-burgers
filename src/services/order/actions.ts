import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearConstructor } from '../constructor/slice';

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredients: string[], { dispatch, rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(ingredients);
      dispatch(clearConstructor());
      return res.order;
    } catch (err) {
      return rejectWithValue('Ошибка оформления заказа');
    }
  }
);
