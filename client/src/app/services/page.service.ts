import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/environment.development';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getPageSection(page: string, section: string) {
    return this.http.get<Page>(this.baseUrl + 'page/' + page + '/' + section)
  }

  getPage(page: string) {
    return this.http.get<Page[]>(this.baseUrl + 'page/' + page)
  }
}
