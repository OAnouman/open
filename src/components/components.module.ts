import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { IonicImageLoader } from 'ionic-image-loader';
import { MomentModule } from 'ngx-moment';
import { DirectivesModule } from '../directives/directives.module';
import { SummarizePipe } from '../pipes/Summarize.pipe';
import { AdFormComponent } from './ad-form/ad-form';
import { AdPicturesSlideComponent } from './ad-pictures-slide/ad-pictures-slide';
import { AdsListComponent } from './ads-list/ads-list';
import { EditAdFormComponent } from './edit-ad-form/edit-ad-form';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form';
import { LoginFormComponent } from './login-form/login-form';
import { MyAdsListComponent } from './my-ads-list/my-ads-list';
import { RegisterFormComponent } from './register-form/register-form';
import { ShowProfileComponent } from './show-profile/show-profile';
import { AlertsListComponent } from './alerts-list/alerts-list';

@NgModule({
  declarations: [
    LoginFormComponent,
    EditProfileFormComponent,
    RegisterFormComponent,
    AdsListComponent,
    SummarizePipe,
    ShowProfileComponent,
    AdFormComponent,
    MyAdsListComponent,
    EditAdFormComponent,
    AdPicturesSlideComponent,
    AlertsListComponent
  ],
  imports: [IonicModule, MomentModule, DirectivesModule, IonicImageLoader],
  exports: [
    LoginFormComponent,
    EditProfileFormComponent,
    RegisterFormComponent,
    AdsListComponent,
    ShowProfileComponent,
    AdFormComponent,
    MyAdsListComponent,
    EditAdFormComponent,
    AdPicturesSlideComponent,
    AlertsListComponent
  ]
})
export class ComponentsModule {}
