// System
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
// Other modules
import { authInterceptor } from '@shared/intercerptors';
// This module
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, ]),
    ),
    provideTranslateService({
      loader : provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
        enforceLoading: false,
        useHttpBackend: true, // Use HttpBackend to avoid interceptor loops
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
  ],
};
