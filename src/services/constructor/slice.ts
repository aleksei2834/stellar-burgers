import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
          return;
        }

        state.ingredients = [...state.ingredients, ingredient];
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: ingredient._id
        }
      })
    },
    deleteIngredient: (
      state: TConstructorState,
      action: PayloadAction<string>
    ) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveUp: (state: TConstructorState, action: PayloadAction<number>) => {
      const index = action.payload;

      [state.ingredients[index - 1], state.ingredients[index]] = [
        state.ingredients[index],
        state.ingredients[index - 1]
      ];
    },
    moveDown: (state: TConstructorState, action: PayloadAction<number>) => {
      const index = action.payload;

      [state.ingredients[index], state.ingredients[index + 1]] = [
        state.ingredients[index + 1],
        state.ingredients[index]
      ];
    },
    clearConstructor: (state: TConstructorState) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getConstructorItems: (state) => state
  }
});

export const { getConstructorItems } = constructorSlice.selectors;

export const {
  addIngredient,
  deleteIngredient,
  moveUp,
  moveDown,
  clearConstructor
} = constructorSlice.actions;
