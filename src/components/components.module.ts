import { NgModule } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form';
import { IonicModule } from 'ionic-angular';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form';
import { RegisterFormComponent } from './register-form/register-form';
import { TextMaskModule } from "angular2-text-mask";


@NgModule({
    declarations: [LoginFormComponent,
        EditProfileFormComponent,
        RegisterFormComponent],
    imports: [
        IonicModule,
        TextMaskModule],
    exports: [LoginFormComponent,
        EditProfileFormComponent,
        RegisterFormComponent]
})
export class ComponentsModule { }
