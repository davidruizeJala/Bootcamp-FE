import { Component, signal } from '@angular/core';
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

  protected showRecipe1(): void {
    console.log('Showing recipe 1');
    this.recipe.set(MOCK_RECIPE_1);
  }

  protected showRecipe2(): void {
    console.log('Showing recipe 2');
    this.recipe.set(MOCK_RECIPE_2);
  }
}
