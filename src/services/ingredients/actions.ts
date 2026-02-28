import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';

// Асинхронный экшен для загрузки ингредиентов с сервера
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const ingredients = getIngredientsApi();
    return ingredients;
  }
);
