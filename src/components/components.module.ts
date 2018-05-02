import { NgModule } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form';
import { IonicModule } from 'ionic-angular';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form';
import { RegisterFormComponent } from './register-form/register-form';
import { TextMaskModule } from "angular2-text-mask";
import { AdsListComponent } from './ads-list/ads-list';
import { SummarizePipe } from '../pipes/Summarize.pipe';
import { ShowProfileComponent } from './show-profile/show-profile';



@NgModule({
    declarations: [LoginFormComponent,
        EditProfileFormComponent,
        RegisterFormComponent,
        AdsListComponent,
        SummarizePipe,
    ShowProfileComponent],
    imports: [
        IonicModule,
        TextMaskModule],
    exports: [LoginFormComponent,
        EditProfileFormComponent,
        RegisterFormComponent,
        AdsListComponent,
    ShowProfileComponent]
})
export class ComponentsModule { }
