import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {} from 'module';
import { Ad } from '../../models/ad/ad.interface';
import { FCM } from '@ionic-native/fcm';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {
  constructor(private _fcm: FCM) {}

  /**
   * Subscribe to one topic
   *
   * @param {string} topic
   * @memberof FcmProvider
   */
  async subscribeToTopic(topic: string): Promise<void> {
    if (!topic) return;
    await this._fcm.subscribeToTopic(topic);
  }

  /**
   * Subscribe to an array of topics
   *
   * @param {string[]} topics
   * @memberof FcmProvider
   */
  subcribeToTopics(topics: string[]): void {
    if (!topics) return;
    topics.forEach(async topic => await this._fcm.subscribeToTopic(topic));
  }

  /**
   * Unsubscribe from one  topic
   *
   * @param {string} topic
   * @memberof FcmProvider
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    if (!topic) return;
    await this._fcm.unsubscribeFromTopic(topic);
  }

  /**
   * Unsubscribe from an array of topic
   *
   * @param {string[]} topics
   * @memberof FcmProvider
   */
  unsubcribeToTopics(topics: string[]): void {
    if (!topics) return;
    topics.forEach(async topic => await this._fcm.unsubscribeFromTopic(topic));
  }
}
