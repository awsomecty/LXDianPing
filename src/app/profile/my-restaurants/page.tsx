'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Restaurant } from '@/types';

export default function MyRestaurantsPage() {
    const router = useRouter();
    const { authState } = useAuth();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        // 检查用户是否已登录
        if (!authState.loading && !authState.isAuthenticated) {
            router.push('/login');
            return;
        }

        // 加载用户创建的餐厅
        loadUserRestaurants();
    }, [authState, router]);

    const loadUserRestaurants = () => {
        setLoading(true);

        try {
            // 获取所有餐厅数据
            const storedRestaurants = localStorage.getItem('mockRestaurants');
            if (!storedRestaurants) {
                setRestaurants([]);
                setLoading(false);
                return;
            }

            const allRestaurants: Restaurant[] = JSON.parse(storedRestaurants);

            // 筛选出当前用户创建的餐厅
            const userRestaurants = allRestaurants.filter(
                restaurant => restaurant.ownerId === authState.currentUser?.id
            );

            setRestaurants(userRestaurants);
        } catch (error) {
            console.error('加载餐厅数据失败:', error);
            setMessage({ type: 'error', content: '加载餐厅数据失败，请稍后再试' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRestaurant = (restaurantId: string) => {
        if (!window.confirm('确定要删除这家餐厅吗？此操作无法撤销。')) {
            return;
        }

        try {
            // 获取所有餐厅数据
            const storedRestaurants = localStorage.getItem('mockRestaurants');
            if (!storedRestaurants) return;

            const allRestaurants: Restaurant[] = JSON.parse(storedRestaurants);

            // 移除要删除的餐厅
            const updatedRestaurants = allRestaurants.filter(
                restaurant => restaurant.id !== restaurantId
            );

            // 保存更新后的数据到localStorage
            localStorage.setItem('mockRestaurants', JSON.stringify(updatedRestaurants));

            // 更新页面上的餐厅列表
            setRestaurants(prev => prev.filter(restaurant => restaurant.id !== restaurantId));

            setMessage({ type: 'success', content: '餐厅已成功删除' });
        } catch (error) {
            console.error('删除餐厅失败:', error);
            setMessage({ type: 'error', content: '删除餐厅失败，请稍后再试' });
        }
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">我的餐厅</h1>
                <Link href="/admin/add-restaurant" className="btn btn-primary">
                    添加新餐厅
                </Link>
            </div>

            {message.content && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                    <span>{message.content}</span>
                </div>
            )}

            {restaurants.length === 0 ? (
                <div className="card bg-base-100 shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h2 className="text-xl font-bold mb-2">您还没有添加任何餐厅</h2>
                    <p className="mb-6">点击上方"添加新餐厅"按钮来创建您的第一家餐厅</p>
                    <Link href="/admin/add-restaurant" className="btn btn-primary">
                        添加新餐厅
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map(restaurant => (
                        <div key={restaurant.id} className="card bg-base-100 shadow-xl">
                            <figure>
                                <img src={restaurant.imageUrl} alt={restaurant.name} className="h-48 w-full object-cover" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{restaurant.name}</h2>
                                <p className="line-clamp-2">{restaurant.description}</p>
                                <div className="flex gap-2 mt-2">
                                    <div className="badge badge-secondary">{restaurant.cuisine}</div>
                                    <div className="badge">{restaurant.priceRange}</div>
                                </div>
                                <div className="card-actions justify-between mt-4">
                                    <Link href={`/restaurant/${restaurant.id}`} className="btn btn-sm btn-primary">
                                        查看详情
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        删除餐厅
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 