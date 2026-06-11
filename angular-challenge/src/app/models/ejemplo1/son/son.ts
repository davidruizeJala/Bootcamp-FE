import { Component, model } from '@angular/core';

@Component({
  selector: 'app-son',
  imports: [],
  templateUrl: './son.html',
  styleUrl: './son.css',
})
export class Son {
  isOn = model<boolean>(false);
}
