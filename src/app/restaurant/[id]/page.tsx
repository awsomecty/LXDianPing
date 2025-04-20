'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants, loadRestaurantsFromStorage } from '@/data/mockData';
import { Restaurant, Review } from '@/types';
import ReviewCard from '../../../components/ReviewCard';

export default function RestaurantPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = useParams();
    const router = useRouter();
    const { authState, canViewReview, isUserFriend } = useAuth();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);

    useEffect(() => {
        // 获取餐厅详情
        const restaurantId = Array.isArray(id) ? id[0] : id;

        // 从localStorage获取餐厅数据
        const storedRestaurants = loadRestaurantsFromStorage();

        const foundRestaurant = storedRestaurants?.find((r: Restaurant) => r.id === restaurantId);

        if (foundRestaurant) {
            setRestaurant(foundRestaurant);

            // 筛选可见的评价
            if (authState.currentUser) {
                const visible = foundRestaurant.reviews.filter((review: Review) => {
                    // 如果是自己的评价，可以看到
                    if (review.userId === authState.currentUser?.id) {
                        return true;
                    }

                    // 处理可能存在的'public'可见性值，将其视为'friends'
                    if (review.visibility === 'public') {
                        // 检查是否是好友关系
                        return isUserFriend(review.userId);
                    }

                    return canViewReview(review.userId, review.visibility);
                });
                setVisibleReviews(visible);
            } else {
                // 未登录用户不能看到任何评价
                setVisibleReviews([]);
            }

            // 检查是否已收藏
            if (authState.currentUser) {
                const favorites = JSON.parse(localStorage.getItem(`favorites_${authState.currentUser.id}`) || '[]');
                setIsFavorite(favorites.includes(restaurantId));
            }
        } else {
            // 餐厅不存在，返回首页
            router.push('/');
        }
    }, [id, authState, router, canViewReview, isUserFriend]);

    const toggleFavorite = () => {
        if (!authState.isAuthenticated) {
            router.push('/login');
            return;
        }

        const userId = authState.currentUser?.id;
        const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');

        if (isFavorite) {
            // 移除收藏
            const updatedFavorites = favorites.filter((favId: string) => favId !== id);
            localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
        } else {
            // 添加收藏
            favorites.push(id);
            localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
        }

        setIsFavorite(!isFavorite);
    };

    if (!restaurant) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                    <div className="mb-6">
                        <Link href="/" className="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回首页
                        </Link>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <figure>
                            <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-64 object-cover" />
                        </figure>
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                                    <div className="flex items-center mt-2">
                                        <div className="badge badge-secondary mr-2">{restaurant.cuisine}</div>
                                        <div className="badge">{restaurant.priceRange}</div>
                                    </div>
                                </div>
                                <button
                                    className={`btn ${isFavorite ? 'btn-error' : 'btn-outline btn-error'}`}
                                    onClick={toggleFavorite}
                                >
                                    {isFavorite ? '取消收藏' : '收藏'}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="rating rating-md my-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name="rating-2"
                                        className="mask mask-star-2 bg-orange-400"
                                        checked={Math.round(restaurant.rating) === star}
                                        readOnly
                                    />
                                ))}
                                <span className="ml-2">{restaurant.rating.toFixed(1)}</span>
                            </div>

                            <p className="text-lg mb-4">{restaurant.description}</p>

                            <div className="card bg-base-200 p-4 mb-4">
                                <h3 className="text-lg font-semibold">地址</h3>
                                <p>{restaurant.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl mt-8">
                        <div className="card-body">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">用户故事</h2>
                                {authState.isAuthenticated && (
                                    <Link href={`/restaurant/${restaurant.id}/review`} className="btn btn-primary">
                                        写故事
                                    </Link>
                                )}
                            </div>

                            {visibleReviews.length > 0 ? (
                                <div className="mt-4 space-y-6">
                                    {visibleReviews.map((review) => (
                                        <div key={review.id} className="card bg-base-200">
                                            <div className="card-body">
                                                <div className="flex justify-between">
                                                    <div className="flex items-center">
                                                        <div className="avatar placeholder mr-3">
                                                            <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                                                                <span>{review.userName.substring(0, 2)}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold">{review.userName}</h3>
                                                            <p className="text-sm opacity-70">{review.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="badge badge-outline">
                                                        {review.visibility === 'friends' ? '好友可见' : '仅自己可见'}
                                                    </div>
                                                </div>

                                                <div className="rating rating-sm mt-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <input
                                                            key={star}
                                                            type="radio"
                                                            name={`rating-${review.id}`}
                                                            className="mask mask-star-2 bg-orange-400"
                                                            checked={Math.round(review.rating) === star}
                                                            readOnly
                                                        />
                                                    ))}
                                                </div>

                                                <p className="mt-3">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-info mt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>
                                        {authState.isAuthenticated
                                            ? '暂无故事，成为第一个分享在这家餐厅的美食经历吧！'
                                            : '请登录后查看故事或分享你的美食体验！'
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:w-1/3">
                    <div className="card bg-base-100 shadow-xl sticky top-4">
                        <div className="card-body">
                            <h2 className="card-title">营业信息</h2>
                            <div className="mt-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span>周一至周五</span>
                                    <span>上午11:00 - 晚上9:00</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>周六</span>
                                    <span>上午10:00 - 晚上10:00</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>周日</span>
                                    <span>上午10:00 - 晚上9:00</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-bold mb-2">联系方式</h3>
                                <p>电话：010-12345678</p>
                                <p>邮箱：contact@{restaurant.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                            </div>

                            <div className="mt-6">
                                <Link href={`/restaurant/${restaurant.id}/review`} className="btn btn-primary w-full">
                                    分享我的故事
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 