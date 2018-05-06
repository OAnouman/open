import { NgModule } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form';
import { IonicModule } from 'ionic-angular';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form';
import { RegisterFormComponent } from './register-form/register-form';
import { AdsListComponent } from './ads-list/ads-list';
import { SummarizePipe } from '../pipes/Summarize.pipe';
import { ShowProfileComponent } from './show-profile/show-profile';
import { AdFormComponent } from './ad-form/ad-form';
import { AutoResizeTextAreaDirective } from '../directives/auto-resize-text-area/auto-resize-text-area';
import { IonTagsInputModule } from 'ionic-tags-input';
import { MomentModule } from "ngx-moment";


@NgModule({
    declarations: [LoginFormComponent,
        EditProfileFormComponent,
        RegisterFormComponent,
        AdsListComponent,
        SummarizePipe,
        AutoResizeTextAreaDirective,
        ShowProfileComponent,
        AdFormComponent],
    imports: [
        IonicModule,
        IonTagsInputModule,
        MomentModule],
    exports: [LoginFormComponent,
        EditProfileFormComponent,
        RegisterFormComponent,
        AdsListComponent,
        ShowProfileComponent,
        AdFormComponent]
})
export class ComponentsModule { }
