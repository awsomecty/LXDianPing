'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        setLoading(true);

        try {
            const success = await register(name, email, password);
            if (success) {
                router.push('/login');
            } else {
                setError('注册失败，请稍后再试');
            }
        } catch (err) {
            setError('注册时发生错误');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center mb-6">注册</h2>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">用户名</span>
                            </label>
                            <input
                                type="text"
                                placeholder="请输入用户名"
                                className="input input-bordered"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">邮箱</span>
                            </label>
                            <input
                                type="email"
                                placeholder="请输入邮箱"
                                className="input input-bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">密码</span>
                            </label>
                            <input
                                type="password"
                                placeholder="请输入密码"
                                className="input input-bordered"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">确认密码</span>
                            </label>
                            <input
                                type="password"
                                placeholder="请再次输入密码"
                                className="input input-bordered"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : '注册'}
                            </button>
                        </div>
                    </form>

                    <div className="divider">或者</div>

                    <div className="text-center">
                        <Link href="/login" className="link link-hover text-primary">
                            已有账号？立即登录
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 