import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/ingredients/slice';

export const IngredientDetails: FC = () => {
  // Достал ID с useParams и нашел ингредиент по ID
  const { id } = useParams();
  const ingredients = useSelector(getIngredients);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    console.log(id);
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
