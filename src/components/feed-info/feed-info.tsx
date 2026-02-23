import { FC } from 'react';

import { getOrders, getTotal, getTotalToday } from '../../services/feed/slice';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

const getOrdersFunc = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(getOrders);
  const total = useSelector(getTotal);
  const totalToday = useSelector(getTotalToday);
  const feed = {
    total,
    totalToday
  };

  const readyOrders = getOrdersFunc(orders, 'done');

  const pendingOrders = getOrdersFunc(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
