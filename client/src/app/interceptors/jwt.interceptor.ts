import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountService } from "../services/account.service";
import { Observable, switchMap, take } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.accountService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        if (user && user.token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
        }
        return next.handle(request);
      })
    );
  }
}
