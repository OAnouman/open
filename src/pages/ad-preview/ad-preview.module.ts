import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MomentModule } from 'ngx-moment';
import { AdPreviewPage } from './ad-preview';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    AdPreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(AdPreviewPage),
    MomentModule,
    DirectivesModule
  ],
})
export class AdPreviewPageModule { }
