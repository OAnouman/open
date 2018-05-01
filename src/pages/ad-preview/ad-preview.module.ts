import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdPreviewPage } from './ad-preview';

@NgModule({
  declarations: [
    AdPreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(AdPreviewPage),
  ],
})
export class AdPreviewPageModule {}
