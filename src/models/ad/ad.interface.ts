import { Observable } from "rxjs/Observable";
import { Profile } from "../profile/profile.interface";

export interface Ad {
  id?: string;

  title: string;

  uid: string;

  // Not saved. Only for hold profile
  userProfile$?: Observable<Profile>;

  createdAt?: any;

  lastUpdatedAt?: any;

  price: number;

  body: string;

  category: string;

  viewsCount: Observable<number>;

  pictures: string[];

  sold?: boolean;

  tags: { name: string; color: string }[];

  published?: boolean;

  favIcon?: string;

  multiSelectSelected?: boolean;
}
