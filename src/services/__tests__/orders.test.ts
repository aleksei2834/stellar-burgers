import {
  profileOrdersSlice,
  TProfileOrdersState
} from '../profileOrders/slice';
import { getOrderByNumber, getOrders } from '../profileOrders/actions';
import { TOrder } from '@utils-types';

const initialState: TProfileOrdersState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null
};

describe('Тестирование ordersSlice', () => {
  describe('Асинхронные редьюсеры', () => {
    describe('[getOrders] История заказов', () => {
      test('[pending] отправка', () => {
        const state = profileOrdersSlice.reducer(
          { ...initialState, error: 'previous error' },
          {
            type: getOrders.pending.type
          }
        );

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      test('[rejected] ошибка', () => {
        const errorMessage = 'Ошибка загрузки истории заказов';
        const state = profileOrdersSlice.reducer(
          { ...initialState, isLoading: true },
          {
            type: getOrders.rejected.type,
            error: { message: errorMessage }
          }
        );

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.orders).toEqual([]);
      });

      test('[fulfilled] успех', () => {
        const payloadMock: TOrder[] = [
          {
            _id: '69a231aba64177001b32dfea',
            ingredients: [
              '643d69a5c3f7b9001cfa093c',
              '643d69a5c3f7b9001cfa093e',
              '643d69a5c3f7b9001cfa093f',
              '643d69a5c3f7b9001cfa0940'
            ],
            status: 'done',
            name: 'Метеоритный люминесцентный бессмертный краторный бургер',
            createdAt: '2026-02-28T00:07:07.449Z',
            updatedAt: '2026-02-28T00:07:07.662Z',
            number: 102092
          },
          {
            _id: '69a2321aa64177001b32dfeb',
            ingredients: ['643d69a5c3f7b9001cfa093d'],
            status: 'done',
            name: 'Флюоресцентный бургер',
            createdAt: '2026-02-28T00:08:58.870Z',
            updatedAt: '2026-02-28T00:08:59.112Z',
            number: 102093
          }
        ];

        const state = profileOrdersSlice.reducer(
          { ...initialState, isLoading: true },
          {
            type: getOrders.fulfilled.type,
            payload: payloadMock
          }
        );

        expect(state.orders).toEqual(payloadMock);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('[getOrderByNumber] Информация о заказе', () => {
      test('[pending] отправка', () => {
        const state = profileOrdersSlice.reducer(
          {
            ...initialState,
            isLoading: false,
            error: 'previous error',
            order: { _id: 'old' } as any
          },
          {
            type: getOrderByNumber.pending.type
          }
        );

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      test('[rejected] ошибка', () => {
        const errorMessage = 'Заказ не найден';
        const state = profileOrdersSlice.reducer(
          { ...initialState, isLoading: true },
          {
            type: getOrderByNumber.rejected.type,
            error: { message: errorMessage }
          }
        );

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.order).toBeNull();
      });

      test('[fulfilled] успех - сохраняет весь ответ сервера', () => {
        // Полный ответ от сервера
        const serverResponse = {
          orders: [
            {
              _id: '69a23297a64177001b32dfec',
              ingredients: [
                '643d69a5c3f7b9001cfa093d',
                '643d69a5c3f7b9001cfa093e',
                '643d69a5c3f7b9001cfa093d'
              ],
              status: 'done',
              name: 'Флюоресцентный люминесцентный бургер',
              createdAt: '2026-02-28T00:11:03.471Z',
              updatedAt: '2026-02-28T00:11:03.717Z',
              number: 102094
            }
          ],
          total: 1,
          totalToday: 1
        };

        const state = profileOrdersSlice.reducer(
          { ...initialState, isLoading: true },
          {
            type: getOrderByNumber.fulfilled.type,
            payload: serverResponse // полный ответ сервера
          }
        );

        // Проверяем, что сохраняется весь ответ сервера, а не только orders[0]
        expect(state.order).toEqual(serverResponse);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });

      test('[fulfilled] успех с пустым массивом заказов', () => {
        const serverResponse = {
          orders: [],
          total: 0,
          totalToday: 0
        };

        const state = profileOrdersSlice.reducer(
          { ...initialState, isLoading: true },
          {
            type: getOrderByNumber.fulfilled.type,
            payload: serverResponse
          }
        );

        // Проверяем, что сохраняется весь ответ сервера (с пустым массивом)
        expect(state.order).toEqual(serverResponse);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });
  });

  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    const state = profileOrdersSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });
});
