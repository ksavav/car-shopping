import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from "@angular/common";
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
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
  model: any = {};
  showSettings: boolean = false

  @ViewChild('navbar') navBar!: ElementRef;

  constructor(public accountService: AccountService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.onWindowScroll();
    this.setNavbarHeight();
  }

  showAccountSettings() {
    this.showSettings = !this.showSettings
    console.log(this.showSettings)
    console.log(this.accountService.currentUser$)
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => this.router.navigateByUrl('/members')
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

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
