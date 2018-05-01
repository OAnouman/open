import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { ComponentsModule } from '../../components/components.module';
import { HideFabDirective } from '../../directives/hide-fab/hide-fab';

@NgModule({
  declarations: [
    HomePage,
    HideFabDirective,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ComponentsModule
  ],
})
export class HomePageModule { }
