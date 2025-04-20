'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants, loadRestaurantsFromStorage, saveRestaurantsToStorage } from '@/data/mockData';
import { Review, Restaurant } from '@/types';

// 扩展后的故事类型，包含餐厅信息
type ReviewWithRestaurant = Review & {
    restaurant: {
        id: string;
        name: string;
        imageUrl: string;
    }
};

export default function MyReviewsPage() {
    const { authState } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState<ReviewWithRestaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        // 如果用户未登录，重定向到登录页面
        if (!authState.loading && !authState.isAuthenticated) {
            router.push('/login');
            return;
        }

        // 加载用户故事
        if (authState.currentUser) {
            loadUserReviews();
        }
    }, [authState, router]);

    const loadUserReviews = () => {
        setLoading(true);

        // 在真实应用中，这应该是API调用
        // 这里我们从localStorage或mockData中获取数据
        setTimeout(() => {
            try {
                // 从localStorage获取餐厅数据
                const restaurantsData = loadRestaurantsFromStorage();

                // 查找用户发表的所有故事
                const userReviews: ReviewWithRestaurant[] = [];

                restaurantsData.forEach((restaurant: Restaurant) => {
                    const restaurantReviews = restaurant.reviews.filter(
                        review => review.userId === authState.currentUser?.id
                    );

                    // 为每条故事添加餐厅信息
                    restaurantReviews.forEach(review => {
                        userReviews.push({
                            ...review,
                            restaurant: {
                                id: restaurant.id,
                                name: restaurant.name,
                                imageUrl: restaurant.imageUrl
                            }
                        });
                    });
                });

                // 按日期降序排序
                userReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setReviews(userReviews);
                setLoading(false);
            } catch (error) {
                console.error('加载故事失败:', error);
                setMessage({ type: 'error', content: '加载故事失败，请稍后再试' });
                setLoading(false);
            }
        }, 500);
    };

    const deleteReview = (reviewId: string, restaurantId: string) => {
        setLoading(true);

        // 在真实应用中，这应该是API调用
        setTimeout(() => {
            try {
                // 从localStorage获取餐厅数据
                const restaurantsData = loadRestaurantsFromStorage();

                // 找到包含该故事的餐厅
                const restaurantIndex = restaurantsData.findIndex(
                    (r: Restaurant) => r.id === restaurantId
                );

                if (restaurantIndex !== -1) {
                    // 移除故事
                    const restaurant = restaurantsData[restaurantIndex];
                    const reviewIndex = restaurant.reviews.findIndex((r: Review) => r.id === reviewId);

                    if (reviewIndex !== -1) {
                        restaurant.reviews.splice(reviewIndex, 1);

                        // 更新餐厅评分
                        if (restaurant.reviews.length > 0) {
                            const totalRating = restaurant.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0);
                            restaurant.rating = Math.round((totalRating / restaurant.reviews.length) * 10) / 10;
                        } else {
                            restaurant.rating = 0;
                        }

                        // 保存更新后的数据
                        saveRestaurantsToStorage(restaurantsData);

                        // 更新页面上的故事列表
                        setReviews(reviews.filter((r: ReviewWithRestaurant) => r.id !== reviewId));
                        setMessage({ type: 'success', content: '故事已成功删除' });
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('删除故事失败:', error);
                setMessage({ type: 'error', content: '删除故事失败，请稍后再试' });
                setLoading(false);
            }
        }, 500);
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
            <h1 className="text-2xl font-bold mb-6">我的故事</h1>

            {message.content && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                    <span>{message.content}</span>
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="card bg-base-100 shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-xl font-bold mb-2">您还没有分享任何用餐故事</h2>
                    <p className="mb-6">浏览餐厅并分享您的美食体验</p>
                    <Link href="/" className="btn btn-primary">
                        浏览餐厅
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="md:w-1/4">
                                        <Link href={`/restaurant/${review.restaurant.id}`}>
                                            <div className="relative h-32 w-full rounded-lg overflow-hidden">
                                                <img
                                                    src={review.restaurant.imageUrl}
                                                    alt={review.restaurant.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <h3 className="font-bold mt-2 text-center">{review.restaurant.name}</h3>
                                        </Link>
                                    </div>

                                    <div className="md:w-3/4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="rating rating-sm">
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
                                                    <span className="text-sm opacity-70">{review.date}</span>
                                                </div>

                                                <div className="mt-1">
                                                    <span className={`badge ${review.visibility === 'friends' ? 'badge-info' : 'badge-warning'}`}>
                                                        {review.visibility === 'friends' ? '好友可见' : '仅自己可见'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/restaurant/${review.restaurant.id}/review/edit/${review.id}`}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    编辑
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-outline btn-error"
                                                    onClick={() => {
                                                        if (window.confirm('确定要删除这条故事吗？')) {
                                                            deleteReview(review.id, review.restaurant.id);
                                                        }
                                                    }}
                                                >
                                                    删除
                                                </button>
                                            </div>
                                        </div>

                                        <p className="mt-4">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 