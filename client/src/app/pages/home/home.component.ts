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
  pageSections: { [key: string]: string } = {};

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.pageService.getPage('home').subscribe({
      next: (data: Page[]) => {
        let response = data;
        this.pageSections = Object.fromEntries(response.map(x => [x.section, x.content]));
      },
      error: (err) => {
        console.error('Error fetching pages:', err);
      }
    });
  }

  
}
