import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MomentModule } from 'ngx-moment';
import { DirectivesModule } from '../../directives/directives.module';
import { AdPreviewPage } from './ad-preview';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AdPreviewPage],
  imports: [
    IonicPageModule.forChild(AdPreviewPage),
    MomentModule,
    DirectivesModule,
    ComponentsModule
  ]
})
export class AdPreviewPageModule {}
