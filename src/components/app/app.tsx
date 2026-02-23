import { ConstructorPage, Feed, ForgotPassword, Login, Register } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  BurgerIngredient,
  IngredientDetails,
  Modal
} from '@components';
import { BurgerIngredientUI, IngredientDetailsUI, Preloader } from '@ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getError,
  getIngredients,
  getIsLoading
} from '../../services/ingredients/slice';
import { fetchIngredients } from '../../services/ingredients/actions';

const App = () => {
  // Переменные из стора
  const isIngredientsLoading = useSelector(getIsLoading);
  const ingredients = useSelector(getIngredients);
  const error = useSelector(getError);
  // Location и Background
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div>Error loading ingredients</div>
      ) : (
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/feed' element={<Feed />} />
        </Routes>
      )}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
