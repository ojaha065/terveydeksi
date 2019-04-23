import { NgModule } from '@angular/core';
import { registerLocaleData } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";

import localeFi from "@angular/common/locales/fi";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { CallNumber } from '@ionic-native/call-number/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { YritysModalPageModule } from "./yritys-modal/yritys-modal.module";
import { AjanvarausModalPageModule } from './ajanvaraus-modal/ajanvaraus-modal.module';
import { PopoverComponent } from './popover/popover.component';


registerLocaleData(localeFi);

@NgModule({
  declarations: [
    AppComponent,
    PopoverComponent
  ],
  entryComponents: [
    PopoverComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, YritysModalPageModule, AjanvarausModalPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    CallNumber,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {};