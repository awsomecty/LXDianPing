'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants } from '@/data/mockData';
import { Restaurant } from '@/types';
import RestaurantCard from '@/components/RestaurantCard';

export default function FavoritesPage() {
    const router = useRouter();
    const { authState } = useAuth();
    const [favorites, setFavorites] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 如果用户未登录，重定向到登录页面
        if (!authState.loading && !authState.isAuthenticated) {
            router.push('/login');
            return;
        }

        // 加载收藏的餐厅
        if (authState.currentUser) {
            setLoading(true);

            // 获取收藏ID列表
            const userId = authState.currentUser.id;
            let favoriteIds: string[] = [];

            try {
                favoriteIds = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
            } catch (error) {
                favoriteIds = [];
            }

            // 从localStorage或mockData获取餐厅数据
            let restaurantsData;
            try {
                restaurantsData = JSON.parse(localStorage.getItem('mockRestaurants') || '');
            } catch (error) {
                restaurantsData = mockRestaurants;
            }

            // 筛选收藏的餐厅
            const favoriteRestaurants = restaurantsData.filter((restaurant: Restaurant) =>
                favoriteIds.includes(restaurant.id)
            );

            setFavorites(favoriteRestaurants);
            setLoading(false);
        }
    }, [authState, router]);

    const removeFavorite = (restaurantId: string) => {
        if (!authState.currentUser) return;

        const userId = authState.currentUser.id;

        // 获取当前收藏列表
        let favoriteIds: string[] = [];
        try {
            favoriteIds = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
        } catch (error) {
            favoriteIds = [];
        }

        // 移除收藏
        const updatedFavorites = favoriteIds.filter(id => id !== restaurantId);

        // 保存更新后的收藏列表
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));

        // 更新页面显示
        setFavorites(favorites.filter(restaurant => restaurant.id !== restaurantId));
    };

    if (authState.loading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">我的收藏</h1>

            {favorites.length === 0 ? (
                <div className="card bg-base-100 shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">💔</div>
                    <h2 className="text-xl font-bold mb-2">暂无收藏餐厅</h2>
                    <p className="mb-6">浏览更多餐厅并收藏您喜欢的地方</p>
                    <Link href="/" className="btn btn-primary">
                        发现餐厅
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {favorites.map(restaurant => (
                            <div key={restaurant.id} className="card bg-base-100 shadow-xl">
                                <figure>
                                    <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-48 object-cover" />
                                </figure>
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <h2 className="card-title">{restaurant.name}</h2>
                                        <button
                                            className="btn btn-sm btn-circle btn-outline btn-error"
                                            onClick={() => removeFavorite(restaurant.id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 my-2">
                                        <div className="badge badge-secondary">{restaurant.cuisine}</div>
                                        <div className="badge">{restaurant.priceRange}</div>
                                    </div>

                                    <div className="rating rating-sm mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <input
                                                key={star}
                                                type="radio"
                                                name={`rating-${restaurant.id}`}
                                                className="mask mask-star-2 bg-orange-400"
                                                checked={Math.round(restaurant.rating) === star}
                                                readOnly
                                            />
                                        ))}
                                        <span className="ml-2">{restaurant.rating.toFixed(1)}</span>
                                    </div>

                                    <p className="text-sm mb-4 line-clamp-2">{restaurant.description}</p>

                                    <div className="card-actions justify-end">
                                        <Link href={`/restaurant/${restaurant.id}`} className="btn btn-primary">
                                            查看详情
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 