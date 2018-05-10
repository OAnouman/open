import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { IonTagsInputModule } from 'ionic-tags-input';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MomentModule } from "ngx-moment";
import { DirectivesModule } from '../directives/directives.module';
import { SummarizePipe } from '../pipes/Summarize.pipe';
import { AdFormComponent } from './ad-form/ad-form';
import { AdsListComponent } from './ads-list/ads-list';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form';
import { LoginFormComponent } from './login-form/login-form';
import { RegisterFormComponent } from './register-form/register-form';
import { ShowProfileComponent } from './show-profile/show-profile';


@NgModule({
    declarations: [LoginFormComponent,
        EditProfileFormComponent,
        RegisterFormComponent,
        AdsListComponent,
        SummarizePipe,
        ShowProfileComponent,
        AdFormComponent],
    imports: [
        IonicModule,
        IonTagsInputModule,
        MomentModule,
        LazyLoadImageModule,
        DirectivesModule,
    ],
    exports: [LoginFormComponent,
        EditProfileFormComponent,
        RegisterFormComponent,
        AdsListComponent,
        ShowProfileComponent,
        AdFormComponent]
})
export class ComponentsModule { }
