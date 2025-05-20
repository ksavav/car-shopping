import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from "@angular/common";
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit  {
  logoPath = 'assets/armapol-logo.png';
  isScrolled: boolean = false;
  navbarHeight: number = 0;
  searchQuery: string = '';
  @ViewChild('navbar') navBar!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof(window) !== 'undefined') {
      this.isScrolled = window.scrollY > 50;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setNavbarHeight();
  }

  ngOnInit() {
    this.onWindowScroll();
    this.setNavbarHeight();
  }

  onSearchChange(value: string): void {
    console.log('Typing:', value);
  }

  onSearchSubmit(): void {
    console.log('Search submitted:', this.searchQuery);
  }

  private setNavbarHeight() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.navbarHeight = this.navBar.nativeElement.offsetHeight;
        document.documentElement.style.setProperty('--nav-height', `${this.navbarHeight + 16}px`);
      });
    }
  }
}
