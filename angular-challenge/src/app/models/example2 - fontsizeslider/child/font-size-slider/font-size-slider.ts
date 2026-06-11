import { Component, model } from '@angular/core';

@Component({
  selector: 'app-font-size-slider',
  imports: [],
  templateUrl: './font-size-slider.html',
  styleUrl: './font-size-slider.css',
})
export class FontSizeSlider {
  size = model(15);
}
