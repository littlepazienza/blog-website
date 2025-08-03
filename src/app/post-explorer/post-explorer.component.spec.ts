import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostExplorerComponent } from './post-explorer.component';

describe('PostExplorerComponent', () => {
  let component: PostExplorerComponent;
  let fixture: ComponentFixture<PostExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostExplorerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
