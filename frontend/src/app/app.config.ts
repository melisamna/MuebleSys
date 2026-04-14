import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
//libreria para manejar el inicio de sesion social (google, facebook, etc)
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, SocialAuthService, SOCIAL_AUTH_CONFIG } from '@abacritt/angularx-social-login';
//importamos el interceptor para añadir el token a las peticiones
import { authInterceptor } from './interceptores/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es';
registerLocaleData(localEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    //permite hacer peticiones al backend
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(SocialLoginModule),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    {provide: LOCALE_ID, useValue: 'es'},

    {
      //configuracion del servicios de autenticacion social
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        //no iniciar sesión automáticamente al cargar la aplicación
        autoLogin: false,
        providers: [
          {
            //definir a google como nuestro proveedor de identidad
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              //id obtenido desde google cloud console al configurar el inicio de sesión con google
              '88698713707-j5051t95pevu9gvbasrcnagv1d4li5ve.apps.googleusercontent.com'
            ,{
              oneTapEnabled:false,
              plugin_name: 'mueblesys',
              use_fedcm: true
            })
          }
        ],
        onError: (err) => {
          //captura errores si google no puede cargar o el ID es incorrecto
          console.error('Error en la autenticación social:', err);
        }
    } as SocialAuthServiceConfig,
    }, SocialAuthService
  ]
};