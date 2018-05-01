export interface Ad {

    title: string;

    user: string;

    createdAt: string;

    price: number;

    body: string;

    viewsCount: number;

    mainPicture?: string;

    pictures?: string[];

}