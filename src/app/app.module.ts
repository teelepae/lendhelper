import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FriendInfoPage} from '../pages/friend-info/friend-info';
import {DatePicker} from '@ionic-native/date-picker';
import {SettingsPage} from '../pages/settings/settings';
import { NoteServiceProvider } from '../providers/note-service/note-service';
import {IonicStorageModule} from '@ionic/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimeAgoPipe} from 'time-ago-pipe';
import {HttpClientModule} from '@angular/common/http';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FriendInfoPage,
    SettingsPage,
    TimeAgoPipe,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FriendInfoPage,
    SettingsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    LocalNotifications,
    SocialSharing,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NoteServiceProvider
  ]
})
export class AppModule {}
