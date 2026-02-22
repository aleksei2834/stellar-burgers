import { FC, memo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { TIngredient } from '@utils-types';
import { useSelector } from 'src/services/store';
import { getIngredients } from 'src/services/ingredients/slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();

    const [counter, setCounter] = useState(count);

    const handleAdd = () => {
      setCounter((counter) => counter + 1);
      console.log(counter);
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={counter}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
