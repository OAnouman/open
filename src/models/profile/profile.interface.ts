export interface Profile {

    name?: string,

    username?: string,

    email?: string,

    phoneNumber?: string;

    city?: string;

    picture?: string;

    uid?: string;

    credential?: {

        accesToken?: string,

        idToken?: string,

        providerId?: string;

        signInMethod?: string;

    }


}