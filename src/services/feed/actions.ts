import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      return getFeedsApi();
    } catch (err) {
      return rejectWithValue('Ошибка загрузки ленты');
    }
  }
);
