const bunName = 'Краторная булка N-200i';
const ingredientName = 'Биокотлета из марсианской Магнолии';

describe('Rонструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/auth/user', {
      fixture: 'user.json'
    }).as('user');
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.setTokens();

    cy.visit('/');

    cy.wait('@getIngredients');
    cy.wait('@user');
  });

  afterEach(() => {
    cy.clearTokens();
  });

  it('добавление ингредиента в конструктор', () => {
    cy.addIngredientByName(bunName);
    cy.addIngredientByName(ingredientName);

    cy.contains(`${bunName} (верх)`).should('exist');
    cy.contains(`${bunName} (низ)`).should('exist');
    cy.get('li .constructor-element').contains(ingredientName).should('exist');
  });

  describe('Модальные окна', () => {
    beforeEach(() => {
      const bunLink = cy.contains(bunName).parent('li').find('a');

      bunLink.click();
    });

    it('открытие модалки ингредиента', () => {
      cy.get('#modals').contains('Детали ингредиента').should('exist');
      cy.get('#modals').contains(bunName).should('exist');
    });

    it('закрытие по клику на крестик', () => {
      cy.get('#modals').contains('Детали ингредиента').next().click();
      cy.get('#modals').should('be.empty');
    });

    it('закрытие по клику на оверлей', () => {
      cy.get('body').click(4, 4);
      cy.get('#modals').should('be.empty');
    });

    it('закрытие по нажатию на Esc', () => {
      cy.get('body').trigger('keydown', { key: 'Escape' });
      cy.get('#modals').should('be.empty');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('newOrder');

      cy.addIngredientByName(bunName);
      cy.addIngredientByName(ingredientName);

      cy.contains('Оформить заказ').click();
      cy.wait('@newOrder');
    });

    it('пользователь существует', () => {
      cy.get('header > nav').contains('Test User').should('exist');
    });

    it('нажатие на кнопку Оформить заказ', () => {
      cy.get('#modals').contains('12345');
    });

    it('закрытие по крестику', () => {
      cy.get('#modals').find('h3').next('button').click();
    });

    it('закрытие по оверлею', () => {
      cy.get('body').click(0, 0);
    });

    it('конструктор пуст', () => {
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});