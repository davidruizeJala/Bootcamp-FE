import { Component, signal } from '@angular/core';
import { Child } from '../child/child';

@Component({
  selector: 'app-father',
  imports: [Child],
  templateUrl: './father.html',
  styleUrl: './father.css',
})
export class Father {
  activated = signal(false);
}
