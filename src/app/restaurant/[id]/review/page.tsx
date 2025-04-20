'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants, loadRestaurantsFromStorage, saveRestaurantsToStorage } from '@/data/mockData';
import { Review } from '@/types';

export default function AddStoryPage() {
    const { id } = useParams();
    const router = useRouter();
    const { authState } = useAuth();
    const [restaurant, setRestaurant] = useState<any>(null);
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

        // 查找餐厅信息
        const restaurantId = Array.isArray(id) ? id[0] : id;
        const foundRestaurant = mockRestaurants.find(r => r.id === restaurantId);

        if (foundRestaurant) {
            setRestaurant(foundRestaurant);
        } else {
            // 餐厅不存在，返回首页
            router.push('/');
        }
    }, [id, authState, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.currentUser) {
            setMessage({ type: 'error', content: '请先登录后再分享您的故事' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', content: '' });

        // 创建新故事
        const newReview: Review = {
            id: `review-${Date.now()}`,
            userId: authState.currentUser.id,
            userName: authState.currentUser.name,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0],
            visibility
        };

        // 在真实应用中，这应该是一个API调用
        // 这里我们只是模拟添加故事
        setTimeout(() => {
            try {
                // 从localStorage获取餐厅数据
                const storedRestaurants = loadRestaurantsFromStorage();

                // 更新餐厅故事
                const restaurantIndex = storedRestaurants.findIndex((r: any) => r.id === restaurant.id);
                if (restaurantIndex !== -1) {
                    storedRestaurants[restaurantIndex].reviews.push(newReview);

                    // 更新评分
                    const reviews = storedRestaurants[restaurantIndex].reviews;
                    const totalRating = reviews.reduce((sum: number, r: Review) => sum + r.rating, 0);
                    storedRestaurants[restaurantIndex].rating = Math.round((totalRating / reviews.length) * 10) / 10;

                    // 保存到localStorage
                    saveRestaurantsToStorage(storedRestaurants);

                    // 成功提示
                    setMessage({ type: 'success', content: '您的故事已成功分享，感谢您的美食记忆！' });

                    // 2秒后跳转回餐厅详情页
                    setTimeout(() => {
                        router.push(`/restaurant/${restaurant.id}`);
                    }, 2000);
                }
            } catch (error) {
                setMessage({ type: 'error', content: '分享故事失败，请稍后再试' });
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    if (authState.loading || !restaurant) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <Link href={`/restaurant/${restaurant.id}`} className="btn btn-ghost mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回餐厅
            </Link>

            <h1 className="text-2xl font-bold mb-2">分享您在 {restaurant.name} 的故事</h1>
            <p className="text-base-content/70 mb-6">每一次用餐都是一段珍贵的经历，分享您的美食记忆和独特体验</p>

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
                                <span className="label-text">您的故事</span>
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
                                {loading ? <span className="loading loading-spinner"></span> : '分享我的故事'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 