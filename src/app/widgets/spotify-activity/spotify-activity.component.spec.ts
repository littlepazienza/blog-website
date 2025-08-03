import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyActivityComponent } from './spotify-activity.component';

describe('SpotifyActivityComponent', () => {
  let component: SpotifyActivityComponent;
  let fixture: ComponentFixture<SpotifyActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
