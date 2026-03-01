import { rootReducer } from '../store';

describe('rootReducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toBeDefined();
    // Можно проверить ключи
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');
  });
});
