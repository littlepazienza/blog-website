import { TestBed } from '@angular/core/testing';

import { MockBlogDataService } from './mock-blog-data.service';

describe('MockBlogDataService', () => {
  let service: MockBlogDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockBlogDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
