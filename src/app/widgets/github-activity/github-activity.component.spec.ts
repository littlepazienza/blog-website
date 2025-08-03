import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubActivityComponent } from './github-activity.component';

describe('GithubActivityComponent', () => {
  let component: GithubActivityComponent;
  let fixture: ComponentFixture<GithubActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GithubActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
