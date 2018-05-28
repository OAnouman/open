import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertsPage } from './alerts';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AlertsPage],
  imports: [IonicPageModule.forChild(AlertsPage), ComponentsModule]
})
export class AlertsPageModule {}
