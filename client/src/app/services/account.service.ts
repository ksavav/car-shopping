import { Injectable } from '@angular/core';
import { environment } from '../../env/environment.development';
import { async, BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user)
        }
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if(user) {
          this.setCurrentUser(user)
        }
      })
    )
  }

  setCurrentUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user')
    this.currentUserSource.next(null);
  }
}
