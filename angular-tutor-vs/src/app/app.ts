import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipeModel } from './models';
import { MOCK_RECIPE_1, MOCK_RECIPE_2 } from './mock-recipes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('My Recipe Box');
  protected readonly recipe = signal<RecipeModel>(MOCK_RECIPE_1);
  protected readonly servings = signal<number>(1);

  protected readonly adjustedIngredients = computed(() => {
    return this.recipe().ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * this.servings(),
    }));
  });

  protected showRecipe1(): void {
    this.recipe.set(MOCK_RECIPE_1);
  }

  protected showRecipe2(): void {
    this.recipe.set(MOCK_RECIPE_2);
  }

  protected increaseServings(): void {
    this.servings.update((current) => current + 1);
  }

  protected decreaseServings(): void {
    this.servings.update((current) => Math.max(1, current - 1));
  }
}
