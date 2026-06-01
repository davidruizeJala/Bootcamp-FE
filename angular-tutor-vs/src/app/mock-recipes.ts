import { RecipeModel } from './models';

export const MOCK_RECIPE_1: RecipeModel = {
  id: 1,
  name: 'Spaghetti Carbonara',
  description: 'A classic Italian pasta dish.',
  ingredients: [
    { name: 'Spaghetti', quantity: 200, unit: 'g' },
    { name: 'Guanciale', quantity: 100, unit: 'g' },
    { name: 'Egg Yolks', quantity: 4, unit: 'each' },
    { name: 'Pecorino Romano Cheese', quantity: 50, unit: 'g' },
    { name: 'Black Pepper', quantity: 1, unit: 'tsp' },
  ],
  imgUrl:
    'https://pastaslamuneca.com/wp-content/uploads/2021/04/Pasta-carbonara-receta-italiana-original-768x512.png',
};

export const MOCK_RECIPE_2: RecipeModel = {
  id: 2,
  name: 'Caprese Salad',
  description: 'A simple and refreshing Italian salad.',
  ingredients: [
    { name: 'Tomatoes', quantity: 4, unit: 'each' },
    { name: 'Fresh Mozzarella', quantity: 200, unit: 'g' },
    { name: 'Fresh Basil', quantity: 1, unit: 'bunch' },
    { name: 'Extra Virgin Olive Oil', quantity: 2, unit: 'tbsp' },
  ],
  imgUrl:
    'https://www.huleymantel.com/uploads/s1/36/17/27/ensalada-caprese-tomates-maduros-queso-mozzarella-hojas-albahaca-fresca-166116-3714.jpeg',
};
