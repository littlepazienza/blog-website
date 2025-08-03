import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSnippetDailyComponent } from './code-snippet-daily.component';

describe('CodeSnippetDailyComponent', () => {
  let component: CodeSnippetDailyComponent;
  let fixture: ComponentFixture<CodeSnippetDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeSnippetDailyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSnippetDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
