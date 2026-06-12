import { Component } from '@angular/core';
import { FontSizeSlider } from "../../child/font-size-slider/font-size-slider";

@Component({
  selector: 'app-text-preview',
  imports: [FontSizeSlider],
  templateUrl: './text-preview.html',
  styleUrl: './text-preview.css',
})
export class TextPreview {
  fontSize = 18;

  changeFontSize = (value : number)=>{
    this.fontSize = value;
  }
}
