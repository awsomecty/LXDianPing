export interface Restaurant {
    id: string;
    name: string;
    description: string;
    address: string;
    rating: number;
    priceRange: '¥' | '¥¥' | '¥¥¥';
    cuisine: string;
    imageUrl: string;
    reviews: Review[];
    ownerId?: string;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    visibility: 'public' | 'friends' | 'private';
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    following: string[];
    followers: string[];
    friends: string[];
} 