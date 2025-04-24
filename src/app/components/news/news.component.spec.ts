import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NewsComponent } from './news.component';
import { HackerNewsService } from '../../services/hackernews/hacker-news.service';
import { of } from 'rxjs';
import { StoryItemComponent } from '../story-item/story-item.component';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let mockHackerNewsService: any;

  const mockStoryIds = [1, 2, 3, 4, 5];
  const mockStories = mockStoryIds.map(id => ({ id, title: `Story ${id}` }));

  beforeEach(waitForAsync(() => {
    mockHackerNewsService = {
      getNewestStoryIds: jasmine.createSpy('getNewestStoryIds').and.returnValue(of(mockStoryIds)),
      getStoryById: jasmine.createSpy('getStoryById').and.callFake((id: number) =>
        of({ id, title: `Story ${id}` })
      )
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [NewsComponent, StoryItemComponent, LoaderComponent],
      providers: [
        { provide: HackerNewsService, useValue: mockHackerNewsService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the NewsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load story IDs and stories on init', () => {
    expect(component.storyIds.length).toBe(mockStoryIds.length);
    expect(component.totalPages).toBeGreaterThan(0);
  });

  it('should load correct stories for current page', async () => {
    component.currentPage = 1;
    component.pageSize = 2;
    component.loadStoriesForPage();
    await fixture.whenStable();
    expect(component.stories.length).toBe(2);
    expect(component.stories[0].title).toBe('Story 1');
  });

  it('should filter stories based on search query', () => {
    component.stories = mockStories;
    component.searchQuery = 'story 3';
    component.searchStories();
    expect(component.stories.length).toBe(1);
    expect(component.stories[0].title).toContain('3');
  });

  it('should calculate page numbers correctly', () => {
    component.totalPages = 3;
    const pages = component.pageNumbers;
    expect(pages).toEqual([1, 2, 3]);
  });

  it('should navigate to next and previous pages', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should change page size and reset to page 1', () => {
    component.changePageSize(2);
    expect(component.pageSize).toBe(2);
    expect(component.currentPage).toBe(1);
  });

  it('should go to specific page', () => {
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
  });
});
