import { Injectable } from '@angular/core';   
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get the IDs of the newest stories
  getNewestStoryIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}api/HackerNews/newstories`);
  }

  // Get the details of a story by its ID
  getStoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/HackerNews/item/${id}`);
  }
  searchStories(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/HackerNews/search?query=${query}`);
  }
  
}