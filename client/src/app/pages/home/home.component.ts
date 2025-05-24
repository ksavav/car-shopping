import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageService } from '../../services/page.service';
import { Page } from '../../models/page';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductCardComponent } from "./product-card/product-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  pageSections: { [key: string]: string } = {};
  originalItems: Product[] = [];
  items: any[] = [];
  currentSlide = 3;
  visibleCount = 3;
  autoplayInterval: any;
  transitionEnabled = true;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private pageService: PageService, private productService: ProductService) {}

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

    this.productService.getProductsList(["07254QAP", "07502QAP", "07119QAP", "07083QAP", "06551QAP", "06421QAP", "06305QAP"]).subscribe({
      next: (data: Product[]) => {
        this.originalItems = data
        const prepend = this.originalItems.slice(-this.visibleCount);
        const append = this.originalItems.slice(0, this.visibleCount);
        this.items = [...prepend, ...this.originalItems, ...append];
      }
    })

    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.next(), 5000); // every 3s
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }

  next() {
    this.currentSlide++;
    this.transitionEnabled = true;

    if (this.currentSlide === this.items.length - this.visibleCount) {
      setTimeout(() => {
        this.transitionEnabled = false;
        this.currentSlide = this.visibleCount;
      }, 300); // same as CSS transition time
    }
  }

  prev() {
    this.currentSlide--;
    this.transitionEnabled = true;

    if (this.currentSlide === 0) {
      setTimeout(() => {
        this.transitionEnabled = false;
        this.currentSlide = this.items.length - this.visibleCount * 2;
      }, 300);
    }
  }
}
