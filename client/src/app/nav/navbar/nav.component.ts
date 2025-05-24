import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from "@angular/common";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { DropdownComponent } from "../dropdown/dropdown.component";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    DropdownComponent
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

  constructor(private fb: FormBuilder, public accountService: AccountService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private refelem: ElementRef) { }

  ngOnInit() {
    this.onWindowScroll();
    this.setNavbarHeight();
  }

  showAccountSettings() {
    this.showSettings = !this.showSettings
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

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.refelem.nativeElement.contains(event.target)) {
      this.showSettings = false;
    }
  }

  onSearchChange(value: string): void {
    console.log('Typing:', value);
  }

  onSearchSubmit(): void {
    console.log('Search submitted:', this.searchQuery);
  }

  hideSettingsMode(event: boolean): void {
    this.showSettings = false;
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
