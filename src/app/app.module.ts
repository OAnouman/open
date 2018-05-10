import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CallNumber } from "@ionic-native/call-number";
import { Camera } from "@ionic-native/camera";
import { ImagePicker } from '@ionic-native/image-picker';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { SMS } from '@ionic-native/sms';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LazyLoadImageModule } from "ng-lazyload-image";
import { MomentModule } from 'ngx-moment';
import { AuthProvider } from '../providers/auth/auth';
import { DataProvider } from '../providers/data/data';
import { StorageProvider } from '../providers/storage/storage';
import { MyApp } from './app.component';
import { FIREBASE_CREDENTIALS } from './firebase/firebase.credentials';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot({
      name: '__open_db', //REVIEW: Change if app name is modified
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    LazyLoadImageModule,
    MomentModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    DataProvider,
    ImagePicker,
    Camera,
    StorageProvider,
    CallNumber,
    SMS,
    ScreenOrientation,
  ]
})
export class AppModule { }   
