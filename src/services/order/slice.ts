import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurger } from './actions';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  order: TOrder | null;
  isLoading: boolean;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
  order: null,
  isLoading: false
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.error = action.error?.message || null;
      });
  }
});

export const { getOrderRequest, getOrderModalData, getError } =
  orderSlice.selectors;

export const { closeModal } = orderSlice.actions;

export default orderSlice.reducer;
