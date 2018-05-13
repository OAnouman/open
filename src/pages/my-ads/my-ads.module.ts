import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { MyAdsPage } from './my-ads';

@NgModule({
  declarations: [
    MyAdsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyAdsPage),
    ComponentsModule,
  ],
})
export class MyAdsPageModule { }
