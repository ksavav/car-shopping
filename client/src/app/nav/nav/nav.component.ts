import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit  {
  isScrolled: boolean = false;
  navbarHeight: number = 0;
  @ViewChild('navbar') navBar!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Hide links when scroll down
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof(window) !== 'undefined') {
      this.isScrolled = window.scrollY > 50;
    }
  }

  // Change padding when resizing window
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setNavbarHeight();
  }

  ngOnInit() {
    this.onWindowScroll();
    this.setNavbarHeight();
  }

  // Set navbar height variable
  private setNavbarHeight() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.navbarHeight = this.navBar.nativeElement.offsetHeight;
        document.documentElement.style.setProperty('--nav-height', `${this.navbarHeight + 16}px`);
      });
    }
  }
}
