import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritesAdsPage } from './favorites-ads';

@NgModule({
  declarations: [
    FavoritesAdsPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoritesAdsPage),
  ],
})
export class FavoritesAdsPageModule {}
