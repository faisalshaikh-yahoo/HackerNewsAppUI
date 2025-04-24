import { TestBed } from '@angular/core/testing';
import { HackerNewsService } from './hacker-news.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:5079/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService]
    });

    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch newest story IDs', () => {
    const mockIds = [101, 102, 103];

    service.getNewestStoryIds().subscribe(ids => {
      expect(ids).toEqual(mockIds);
    });

    const req = httpMock.expectOne(`${apiUrl}api/HackerNews/newstories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIds);
  });

  it('should fetch a story by ID', () => {
    const mockStory = { id: 101, title: 'Mock Story' };

    service.getStoryById(101).subscribe(story => {
      expect(story).toEqual(mockStory);
    });

    const req = httpMock.expectOne(`${apiUrl}api/HackerNews/item/101`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStory);
  });

  it('should search for stories by query', () => {
    const mockResults = [
      { id: 201, title: 'Angular News' },
      { id: 202, title: 'Search Result 2' }
    ];

    service.searchStories('angular').subscribe(results => {
      expect(results.length).toBe(2);
      expect(results).toEqual(mockResults);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/HackerNews/search?query=angular`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
  });
});
