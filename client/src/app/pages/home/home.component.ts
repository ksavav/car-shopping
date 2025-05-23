import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';
import { Page } from '../../models/page';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  pageSections: Page[] = [];

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.pageService.getPage('home').subscribe({
      next: (data: Page[]) => {
        this.pageSections = data;
        console.log(this.pageSections)
      },
      error: (err) => {
        console.error('Error fetching pages:', err);
      }
    });
  }
}
