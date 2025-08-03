import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantCareReminderComponent } from './plant-care-reminder.component';

describe('PlantCareReminderComponent', () => {
  let component: PlantCareReminderComponent;
  let fixture: ComponentFixture<PlantCareReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantCareReminderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantCareReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
