import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavComponent} from "./nav/navbar/nav.component";
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { isPlatformBrowser } from '@angular/common';
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Armapol';

  constructor(@Inject(PLATFORM_ID) private platformId: object, private accountService: AccountService) {
    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      if(!userString) return;
      const user: User = JSON.parse(userString);
      this.accountService.setCurrentUser(user);
    }
  }

  ngOnInit(): void {
    // this.setCurrentUser();
  }

  // setCurrentUser(){
  //   const userString = localStorage.getItem('user');
  //   if(!userString) return;
  //   const user: User = JSON.parse(userString);
  //   this.accountService.setCurrentUser(user);
  // }
}
