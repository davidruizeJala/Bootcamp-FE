import { Component, signal } from '@angular/core';
import { RecipeModel } from '../models';
import { MOCK_RECIPE_1, MOCK_RECIPE_2 } from '../mock-recipes';
import { RecipeDetail } from '../recipe-detail/recipe-detail';

@Component({
  selector: 'app-recipe-list',
  imports: [RecipeDetail],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList {
  protected readonly title = signal('My Recipe Box');
  protected readonly recipe = signal<RecipeModel>(MOCK_RECIPE_1);

  protected showRecipe1(): void {
    this.recipe.set(MOCK_RECIPE_1);
  }

  protected showRecipe2(): void {
    this.recipe.set(MOCK_RECIPE_2);
  }
}
