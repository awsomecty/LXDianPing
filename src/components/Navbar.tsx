'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const { authState, logout } = useAuth();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
            setSearchOpen(false);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-md">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">小众点评</Link>
            </div>
            <div className="flex-none gap-2">
                {searchOpen ? (
                    <form onSubmit={handleSearchSubmit} className="join">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered join-item"
                            placeholder="搜索餐厅或美食"
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary join-item">搜索</button>
                        <button
                            type="button"
                            className="btn btn-ghost join-item"
                            onClick={() => setSearchOpen(false)}
                        >
                            取消
                        </button>
                    </form>
                ) : (
                    <button
                        className="btn btn-ghost btn-circle"
                        onClick={() => setSearchOpen(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                )}
                <ThemeSwitcher />
                <div className="dropdown dropdown-end">
                    {authState.isAuthenticated ? (
                        <>
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img src={authState.currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"} alt="用户头像" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li>
                                    <Link href="/profile" className="justify-between">
                                        个人资料
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/my-reviews">我的评价</Link>
                                </li>
                                <li>
                                    <Link href="/favorites">收藏餐厅</Link>
                                </li>
                                {authState.currentUser?.id === '1' && (
                                    <li>
                                        <Link href="/admin/add-restaurant">添加商家</Link>
                                    </li>
                                )}
                                <li>
                                    <button onClick={logout}>退出登录</button>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login" className="btn btn-ghost">登录</Link>
                            <Link href="/register" className="btn btn-primary">注册</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 