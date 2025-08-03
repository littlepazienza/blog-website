import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewspaperLandingComponent } from './newspaper-landing.component';

describe('NewspaperLandingComponent', () => {
  let component: NewspaperLandingComponent;
  let fixture: ComponentFixture<NewspaperLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewspaperLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewspaperLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
