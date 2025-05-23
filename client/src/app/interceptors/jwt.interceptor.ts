import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AccountService } from "../services/account.service";
import { Observable, switchMap, take } from "rxjs";

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {

//   constructor(private accountService: AccountService) {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     return this.accountService.currentUser$.pipe(
//       take(1),
//       switchMap(user => {
//         if (user && user.token) {
//           request = request.clone({
//             setHeaders: {
//               Authorization: `Bearer ${user.token}`
//             }
//           });
//         }
//         return next.handle(request);
//       })
//     );
//   }
// }

// const excludedUrls = ['account/login', 'account/register'];

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // const isExcluded = excludedUrls.some(url => req.url.includes(url));
  // if (isExcluded) {
  //   return next(req);
  // }

  const accountService = inject(AccountService);
  return accountService.currentUser$.pipe(
    take(1),
    switchMap(user => {
      if (user?.token) {
        const newReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
        return next(newReq);
      }
      return next(req);
    })
  );
}
