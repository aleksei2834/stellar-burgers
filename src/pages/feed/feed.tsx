import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getIsLoading, getOrders } from '../../services/feed/slice';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/feed/actions';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  // dispatch(getFeeds());
  const orders: TOrder[] = useSelector(getOrders);
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    dispatch(getFeeds());

    const interval = setInterval(() => {
      dispatch(getFeeds());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);
  if (!orders.length && isLoading) {
    return <Preloader />;
  }
  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
