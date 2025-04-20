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
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    visibility: 'friends' | 'private';
}

export interface User {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    password: string;
    inviteCode: string;
    following: string[];
    followers: string[];
    friends: string[];
}

export interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    error: string | null;
    loading: boolean;
} 