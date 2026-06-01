import { Component, computed, signal, input } from '@angular/core';
import { RecipeModel } from '../models';

@Component({
  selector: 'app-recipe-detail',
  imports: [],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  protected readonly servings = signal<number>(1);
  readonly recipe = input.required<RecipeModel>();

  protected readonly adjustedIngredients = computed(() => {
    return this.recipe().ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * this.servings(),
    }));
  });

  protected increaseServings(): void {
    this.servings.update((current) => current + 1);
  }

  protected decreaseServings(): void {
    this.servings.update((current) => Math.max(1, current - 1));
  }
}
