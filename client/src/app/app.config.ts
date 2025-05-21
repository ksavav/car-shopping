import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(),
    // { 
    //   provide: HTTP_INTERCEPTORS, 
    //   useClass: JwtInterceptor, 
    //   multi: true 
    // }
  ]
};
