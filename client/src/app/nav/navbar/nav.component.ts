import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from "@angular/common";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { ProductService } from '../../services/product.service';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { SearchDropDownComponent } from "../search-drop-down/search-drop-down.component";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    DropdownComponent,
    SearchDropDownComponent
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit, OnDestroy  {
  logoPath = 'assets/armapol-logo.png';
  isScrolled: boolean = false;
  navbarHeight: number = 0;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  products: any[] = [];
  showSettings: boolean = false
  showSearchResults: boolean = false
  @ViewChild('navbar') navBar!: ElementRef;

  constructor(private fb: FormBuilder, public productService: ProductService, public accountService: AccountService, 
    private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private refelem: ElementRef) { }

  ngOnInit() {
    this.onWindowScroll();
    this.setNavbarHeight();

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe(searchTerm => {
        if (searchTerm == '') return
        this.productService.getProductsSearchBar(searchTerm).subscribe({
          next: data => {
            this.products = data
          }
        });
      });
  }
  
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
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
      this.showSearchResults = false
    }
  }

  onSearchChange(): void {
    // console.log('Typing:', value);
    // let prods = this.productService.getProductsSearchBar(value).subscribe({
    //   next: data => {
    //     console.log(data)
    //   }
    // })
    this.showSearchResults = true
    this.searchSubject.next(this.searchQuery);
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
