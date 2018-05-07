import { Profile } from "../profile/profile.interface";
import { Observable } from "rxjs/Observable";

export interface Ad {

    title: string;

    uid: string;

    // Not saved. Only for hold profile
    userProfile?: Observable<Profile>;

    createdAt?: any;

    lastUpdatedAt?: any;

    price: number;

    body: string;

    viewsCount: number;

    pictures: string[];

    sold?: boolean;

    tags: { name: string, color: string }[];

}