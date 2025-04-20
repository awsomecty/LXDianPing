'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockRestaurants, loadRestaurantsFromStorage, saveRestaurantsToStorage } from '@/data/mockData';
import { Restaurant } from '@/types';

export default function AddRestaurantPage() {
    const router = useRouter();
    const { authState } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    // 表单状态
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [cuisine, setCuisine] = useState('川菜');
    const [priceRange, setPriceRange] = useState<'¥' | '¥¥' | '¥¥¥'>('¥¥');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        // 检查用户是否已登录
        if (!authState.loading && !authState.isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [authState, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.currentUser) {
            setMessage({ type: 'error', content: '您需要登录才能添加餐厅' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', content: '' });

        // 创建新餐厅对象
        const newRestaurant: Restaurant = {
            id: `restaurant-${Date.now()}`,
            name,
            description,
            address,
            cuisine,
            priceRange,
            rating: 0,
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', // 默认图片
            reviews: [],
            ownerId: authState.currentUser.id // 添加餐厅创建者ID
        };

        // 在真实应用中，这应该是API调用
        // 这里我们模拟添加到本地存储
        setTimeout(() => {
            try {
                // 从localStorage获取餐厅数据
                const restaurantsData = loadRestaurantsFromStorage();

                // 添加新餐厅
                restaurantsData.push(newRestaurant);

                // 保存到localStorage
                saveRestaurantsToStorage(restaurantsData);

                // 显示成功消息
                setMessage({ type: 'success', content: `餐厅"${name}"已成功添加` });

                // 重置表单
                setName('');
                setDescription('');
                setAddress('');
                setCuisine('川菜');
                setPriceRange('¥¥');
                setImageUrl('');

                // 2秒后跳转到我的餐厅页面
                setTimeout(() => {
                    router.push('/profile/my-restaurants');
                }, 2000);
            } catch (error) {
                setMessage({ type: 'error', content: '添加餐厅失败，请稍后再试' });
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    if (authState.loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-xl">
            <div className="mb-6">
                <Link href="/" className="btn btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回首页
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">添加新餐厅</h1>

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
                                <span className="label-text">餐厅名称</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="请输入餐厅名称"
                                required
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">餐厅描述</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="请输入餐厅描述"
                                required
                            ></textarea>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">地址</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="请输入详细地址"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">菜系</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={cuisine}
                                    onChange={(e) => setCuisine(e.target.value)}
                                >
                                    <option value="川菜">川菜</option>
                                    <option value="江浙菜">江浙菜</option>
                                    <option value="粤菜">粤菜</option>
                                    <option value="湘菜">湘菜</option>
                                    <option value="东北菜">东北菜</option>
                                    <option value="西餐">西餐</option>
                                    <option value="日料">日料</option>
                                    <option value="韩餐">韩餐</option>
                                    <option value="其他">其他</option>
                                </select>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">价格区间</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value as '¥' | '¥¥' | '¥¥¥')}
                                >
                                    <option value="¥">¥ (便宜)</option>
                                    <option value="¥¥">¥¥ (适中)</option>
                                    <option value="¥¥¥">¥¥¥ (昂贵)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">餐厅图片URL</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="请输入图片URL（可选）"
                            />
                            <label className="label">
                                <span className="label-text-alt">如不提供，将使用默认图片</span>
                            </label>
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : '添加餐厅'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 