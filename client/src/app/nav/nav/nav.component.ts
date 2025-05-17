import { Component, HostListener, OnInit } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit() {
    this.onWindowScroll();
  }

}
