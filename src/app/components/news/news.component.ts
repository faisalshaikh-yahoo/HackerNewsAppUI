import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HackerNewsService } from '../../services/hackernews/hacker-news.service';
import { StoryItemComponent } from '../story-item/story-item.component';
import { LoaderComponent } from '../loader/loader.component';



@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, StoryItemComponent, LoaderComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {
  storyIds: number[] = [];
  stories: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  searchQuery: string = ''; 
  loading: boolean = false;

  constructor(private hackerNewsService: HackerNewsService) {}

  ngOnInit(): void {
    this.loadNewestStories();
  }

  loadNewestStories(): void {
    this.loading = true;
    this.hackerNewsService.getNewestStoryIds().subscribe(ids => {
      this.storyIds = ids;
      this.totalPages = Math.ceil(this.storyIds.length / this.pageSize);
      this.loadStoriesForPage();
    });
  }

  loadStoriesForPage(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const storiesToLoad = this.storyIds.slice(startIndex, startIndex + this.pageSize);
    this.stories = [];
    this.loading = true;
    const storyRequests = storiesToLoad.map(id =>
      this.hackerNewsService.getStoryById(id)
    );
    Promise.all(storyRequests.map(req => req.toPromise()))
      .then(results => {
        this.stories = results;
        this.loading = false;
      });
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.storyIds.length / this.pageSize);
    this.loadStoriesForPage();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadStoriesForPage();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStoriesForPage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStoriesForPage();
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  searchStories(): void {
    if (!this.searchQuery) {
      this.loadStoriesForPage();
      return;
    }
    this.stories = this.stories.filter(story =>
      story.title?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
