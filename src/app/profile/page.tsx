'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { saveUsersToStorage } from '@/data/mockData';

export default function ProfilePage() {
    const { authState, logout, addFriendByInviteCode } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [friendInviteCode, setFriendInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        // 如果用户未登录，重定向到登录页面
        if (!authState.loading && !authState.isAuthenticated) {
            router.push('/login');
            return;
        }

        // 初始化表单数据
        if (authState.currentUser) {
            setName(authState.currentUser.name);
            setEmail(authState.currentUser.email);
            setAvatar(authState.currentUser.avatar || '');
            setInviteCode(authState.currentUser.inviteCode || '');
        }
    }, [authState, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' });

        try {
            // 在真实应用中，这里应该调用API
            // 这里我们只是模拟更新
            setTimeout(() => {
                if (authState.currentUser) {
                    // 更新当前用户信息
                    const updatedUser = {
                        ...authState.currentUser,
                        name,
                        avatar
                    };

                    // 更新localStorage中的用户信息
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                    // 更新全局用户列表中的用户信息
                    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                    const userIndex = mockUsers.findIndex((u: any) => u.id === authState.currentUser?.id);

                    if (userIndex !== -1) {
                        mockUsers[userIndex] = updatedUser;
                        saveUsersToStorage(mockUsers);
                    }

                    setMessage({ type: 'success', content: '个人资料已更新' });
                }
                setLoading(false);
            }, 500);
        } catch (error) {
            setMessage({ type: 'error', content: '更新失败，请稍后再试' });
            setLoading(false);
        }
    };

    const copyInviteCode = () => {
        navigator.clipboard.writeText(inviteCode);
        setCodeCopied(true);
        setTimeout(() => {
            setCodeCopied(false);
        }, 2000);
    };

    const handleAddFriend = () => {
        if (!friendInviteCode.trim()) {
            setMessage({ type: 'error', content: '请输入好友邀请码' });
            return;
        }

        const result = addFriendByInviteCode(friendInviteCode.trim());
        setMessage({ type: result.success ? 'success' : 'error', content: result.message });

        if (result.success) {
            setFriendInviteCode('');
        }
    };

    // 如果用户未登录，显示加载状态
    if (authState.loading || !authState.currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-6">个人资料</h1>

            {message.content && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                    <span>{message.content}</span>
                </div>
            )}

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex flex-col items-center mb-6">
                        <div className="avatar mb-4">
                            <div className="w-24 rounded-full">
                                <img src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"} alt="头像" />
                            </div>
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">头像URL</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={avatar}
                                onChange={(e) => setAvatar(e.target.value)}
                                placeholder="输入头像图片URL"
                            />
                            <label className="label">
                                <span className="label-text-alt">可使用任意图片URL或保持默认头像</span>
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">用户名</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">邮箱</span>
                            </label>
                            <input
                                type="email"
                                className="input input-bordered"
                                value={email}
                                disabled
                            />
                            <label className="label">
                                <span className="label-text-alt">邮箱不可修改</span>
                            </label>
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

                    <div className="divider"></div>

                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">关注</div>
                            <div className="stat-value">{authState.currentUser.following.length}</div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">粉丝</div>
                            <div className="stat-value">{authState.currentUser.followers.length}</div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">好友</div>
                            <div className="stat-value">{authState.currentUser.friends.length}</div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="card bg-base-200 p-4 mt-4">
                        <h2 className="text-lg font-bold mb-2">我的邀请码</h2>
                        <p className="text-sm mb-2">分享给朋友，邀请他们加入并成为好友</p>
                        <div className="flex items-center justify-between">
                            <code className="bg-base-300 px-3 py-1 rounded font-mono text-lg">{inviteCode}</code>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={copyInviteCode}
                            >
                                {codeCopied ? '已复制' : '复制'}
                            </button>
                        </div>
                    </div>

                    <div className="card bg-base-200 p-4 mt-4">
                        <h2 className="text-lg font-bold mb-2">添加好友</h2>
                        <p className="text-sm mb-2">输入好友的邀请码来添加他们为好友</p>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                className="input input-bordered flex-1"
                                value={friendInviteCode}
                                onChange={(e) => setFriendInviteCode(e.target.value)}
                                placeholder="输入邀请码"
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleAddFriend}
                            >
                                添加
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 