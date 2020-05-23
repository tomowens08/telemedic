import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule, LOCALE_ID} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {ServiceProxyModule} from '../providers/service-proxies/service-proxy.module';
import {IonicStorageModule} from '@ionic/storage';
import {JWT_HTTP_PROVIDER, JwtHttpConfiguration} from '../providers/http/jwtHttp';
import {TokenService} from '../providers/auth/token.service';
import {TenantService} from '../providers/auth/tenant.service';
import {LoginService} from '../providers/auth/login.service';
import {HttpModule} from '@angular/http';
import {API_BASE_URL} from '../providers/service-proxies/service-proxies';
import {AuthService} from '../providers/auth/auth.service';
import {PipesModule} from "../shared/pipes/pipes.module";
import {DirectivesModule} from "../shared/directives/directives.module";
import { ComponentsModule } from '../components/components.module';
import {FormValidationService} from '../providers/validation/formValidation.service';
import {NotifyService} from '../providers/notification/notify.service';
import { CustomFormsModule } from 'ng2-validation'
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {ImageUploadService} from '../providers/upload/imageUploadService';
import { ENV } from '@environment';

export function getRemoteServiceBaseUrl(): string {
   return ENV.API_ENDPOINT;
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ServiceProxyModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    CustomFormsModule,
    ChartsModule,
    DirectivesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    JwtHttpConfiguration,
    JWT_HTTP_PROVIDER,
    {provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl},
    TokenService,
    TenantService,
    LoginService,
    AuthService,
    FormValidationService,
    NotifyService,
    {provide: LOCALE_ID, useValue: 'en-GB'},
    ImageUploadService
  ]
})
export class AppModule {
}
