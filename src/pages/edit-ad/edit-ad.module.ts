import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { EditAdPage } from './edit-ad';

@NgModule({
  declarations: [
    EditAdPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAdPage),
    ComponentsModule,
  ],
})
export class EditAdPageModule { }
