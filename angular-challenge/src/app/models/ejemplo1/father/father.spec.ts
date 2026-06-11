import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Father } from './father';

describe('Father', () => {
  let component: Father;
  let fixture: ComponentFixture<Father>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Father],
    }).compileComponents();

    fixture = TestBed.createComponent(Father);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
