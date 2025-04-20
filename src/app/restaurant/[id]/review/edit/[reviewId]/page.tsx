'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants, loadRestaurantsFromStorage, saveRestaurantsToStorage } from '@/data/mockData';
import { Review, Restaurant } from '@/types';

export default function EditStoryPage() {
    const { id, reviewId } = useParams();
    const router = useRouter();
    const { authState } = useAuth();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [review, setReview] = useState<Review | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [visibility, setVisibility] = useState<'friends' | 'private'>('private');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        // 如果用户未登录，重定向到登录页面
        if (!authState.loading && !authState.isAuthenticated) {
            router.push('/login');
            return;
        }

        // 加载餐厅和故事数据
        loadData();
    }, [id, reviewId, authState, router]);

    const loadData = () => {
        setLoading(true);

        // 获取餐厅ID和故事ID
        const restaurantId = Array.isArray(id) ? id[0] : id;
        const reviewIdentifier = Array.isArray(reviewId) ? reviewId[0] : reviewId;

        // 尝试从localStorage获取餐厅数据
        const restaurantsData = loadRestaurantsFromStorage();

        // 查找餐厅和故事
        const foundRestaurant = restaurantsData.find((r: Restaurant) => r.id === restaurantId);

        if (foundRestaurant) {
            setRestaurant(foundRestaurant);

            // 查找故事
            const foundReview = foundRestaurant.reviews.find((r: Review) => r.id === reviewIdentifier);

            if (foundReview) {
                // 确认故事属于当前用户
                if (foundReview.userId === authState.currentUser?.id) {
                    setReview(foundReview);
                    setRating(foundReview.rating);
                    setComment(foundReview.comment);
                    // 处理可见性，如果是public则转换为friends
                    if (foundReview.visibility === 'public') {
                        setVisibility('friends');
                    } else {
                        setVisibility(foundReview.visibility as 'friends' | 'private');
                    }
                    setLoading(false);
                } else {
                    // 不是用户自己的故事，无权编辑
                    setMessage({ type: 'error', content: '您没有权限编辑这个故事' });

                    // 3秒后返回我的故事页面
                    setTimeout(() => {
                        router.push('/my-reviews');
                    }, 3000);
                }
            } else {
                // 故事不存在
                setMessage({ type: 'error', content: '故事不存在' });
                setTimeout(() => {
                    router.push('/my-reviews');
                }, 2000);
            }
        } else {
            // 餐厅不存在
            setMessage({ type: 'error', content: '餐厅不存在' });
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.currentUser || !restaurant || !review) {
            setMessage({ type: 'error', content: '无法更新故事，请稍后再试' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', content: '' });

        // 创建更新后的故事
        const updatedReview: Review = {
            ...review,
            rating,
            comment,
            visibility,
            // 可选：更新故事时间
            date: new Date().toISOString().split('T')[0],
        };

        // 在真实应用中，这应该是一个API调用
        // 这里我们只是模拟更新故事
        setTimeout(() => {
            try {
                // 从localStorage获取餐厅数据
                const restaurantsData = loadRestaurantsFromStorage();

                // 找到餐厅和故事
                const restaurantIndex = restaurantsData.findIndex((r: Restaurant) => r.id === restaurant.id);

                if (restaurantIndex !== -1) {
                    const reviewIndex = restaurantsData[restaurantIndex].reviews.findIndex(
                        (r: Review) => r.id === review.id
                    );

                    if (reviewIndex !== -1) {
                        // 更新故事
                        restaurantsData[restaurantIndex].reviews[reviewIndex] = updatedReview;

                        // 更新餐厅评分
                        const reviews = restaurantsData[restaurantIndex].reviews;
                        const totalRating = reviews.reduce((sum: number, r: Review) => sum + r.rating, 0);
                        restaurantsData[restaurantIndex].rating = Math.round((totalRating / reviews.length) * 10) / 10;

                        // 保存到localStorage
                        saveRestaurantsToStorage(restaurantsData);

                        // 成功提示
                        setMessage({ type: 'success', content: '您的故事已成功更新' });

                        // 2秒后跳转回我的故事页面
                        setTimeout(() => {
                            router.push('/my-reviews');
                        }, 2000);
                    }
                } else {
                    throw new Error('餐厅不存在');
                }
            } catch (error) {
                console.error('更新故事失败:', error);
                setMessage({ type: 'error', content: '更新故事失败，请稍后再试' });
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!restaurant || !review) {
        return (
            <div className="container mx-auto p-4 max-w-md">
                <div className="alert alert-error mb-4">
                    <span>{message.content || '加载故事失败'}</span>
                </div>
                <Link href="/my-reviews" className="btn btn-primary">
                    返回我的故事
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <Link href="/my-reviews" className="btn btn-ghost mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回我的故事
            </Link>

            <h1 className="text-2xl font-bold mb-2">编辑您的美食故事</h1>
            <div className="flex items-center gap-2 mb-6">
                <span className="font-medium">餐厅：</span>
                <Link href={`/restaurant/${restaurant.id}`} className="link link-hover text-primary">
                    {restaurant.name}
                </Link>
            </div>

            {message.content && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                    <span>{message.content}</span>
                </div>
            )}

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">您的体验评分</span>
                            </label>
                            <div className="rating rating-lg">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name="rating"
                                        className={`mask mask-star-2 ${star <= 3 ? 'bg-orange-400' : 'bg-orange-400'}`}
                                        checked={rating === star}
                                        onChange={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">您的故事内容</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="分享您的用餐经历、美食故事、难忘瞬间或特别的服务体验..."
                                required
                            ></textarea>
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">谁可以看到这个故事？</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as 'friends' | 'private')}
                            >
                                <option value="friends">仅好友可见</option>
                                <option value="private">仅自己可见</option>
                            </select>
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : '保存修改'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 