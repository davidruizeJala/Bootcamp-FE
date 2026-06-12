import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-font-size-slider',
  imports: [FormsModule],
  templateUrl: './font-size-slider.html',
  styleUrl: './font-size-slider.css',
})
export class FontSizeSlider {
  size = model(15);
}
