import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPreview } from './text-preview';

describe('TextPreview', () => {
  let component: TextPreview;
  let fixture: ComponentFixture<TextPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(TextPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
