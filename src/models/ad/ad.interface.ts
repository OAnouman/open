import { Observable } from "rxjs/Observable";
import { Profile } from "../profile/profile.interface";

export interface Ad {

    title: string;

    uid: string;

    // Not saved. Only for hold profile
    userProfile?: Observable<Profile>;

    createdAt?: any;

    lastUpdatedAt?: any;

    price: number;

    body: string;

    category: string;

    viewsCount: number;

    pictures: string[];

    sold?: boolean;

    tags: { name: string, color: string }[];

    published?: boolean;

}