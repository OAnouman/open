import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CallNumber } from '@ionic-native/call-number';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { Network } from '@ionic-native/network';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SMS } from '@ionic-native/sms';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicImageLoader } from 'ionic-image-loader';
import { MomentModule } from 'ngx-moment';
import { AuthProvider } from '../providers/auth/auth';
import { DataProvider } from '../providers/data/data';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { StorageProvider } from '../providers/storage/storage';
import { MyApp } from './app.component';
import { FIREBASE_CREDENTIALS } from './firebase/firebase.credentials';
import { FCM } from '@ionic-native/fcm';
import { FcmProvider } from '../providers/fcm/fcm';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot({
      name: '__open_db', //REVIEW: Change if app name is modified
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    MomentModule,
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
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
    File,
    Network,
    LocalStorageProvider,
    FCM,
    FcmProvider
  ]
})
export class AppModule {}
