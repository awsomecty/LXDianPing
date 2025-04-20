'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { mockUsers, saveUsersToStorage } from '../data/mockData';

interface AuthContextProps {
    authState: AuthState;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    followUser: (userId: string) => void;
    unfollowUser: (userId: string) => void;
    isUserFriend: (userId: string) => boolean;
    canViewReview: (userId: string, visibility: 'friends' | 'private') => boolean;
    addFriendByInviteCode: (inviteCode: string) => { success: boolean; message: string };
    generateInviteCode: () => string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        currentUser: null,
        error: null,
        loading: true
    });

    useEffect(() => {
        // 检查本地存储中是否有已登录用户
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);

                // 确保用户数据是最新的（特别是关注关系等）
                const currentUserInMockUsers = mockUsers.find(u => u.id === user.id);

                // 如果在mockUsers中找到用户，使用最新数据
                // 否则使用存储的数据（可能是刚刚注册但还未保存到mockUsers的用户）
                const updatedUser = currentUserInMockUsers || user;

                setAuthState({
                    isAuthenticated: true,
                    currentUser: updatedUser,
                    error: null,
                    loading: false
                });

                // 更新本地存储为最新数据
                if (currentUserInMockUsers && JSON.stringify(currentUserInMockUsers) !== JSON.stringify(user)) {
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                }
            } catch (error) {
                // 如果解析出错，清除本地存储
                localStorage.removeItem('currentUser');
                setAuthState({
                    isAuthenticated: false,
                    currentUser: null,
                    error: null,
                    loading: false
                });
            }
        } else {
            setAuthState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // 在真实项目中，这里应该是API调用
        try {
            // 模拟网络延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 从最新的用户数据中查找
            const user = mockUsers.find(u => u.email === email && u.password === password);

            if (user) {
                // 更新用户对象为最新的版本（包含最新的关注关系等）
                const updatedUser = { ...user };

                setAuthState({
                    isAuthenticated: true,
                    currentUser: updatedUser,
                    error: null,
                    loading: false
                });

                // 存储用户信息到本地存储
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                return true;
            } else {
                setAuthState({
                    isAuthenticated: false,
                    currentUser: null,
                    error: '邮箱或密码不正确',
                    loading: false
                });
                return false;
            }
        } catch (error) {
            setAuthState({
                isAuthenticated: false,
                currentUser: null,
                error: '登录失败，请稍后再试',
                loading: false
            });
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setAuthState({
            isAuthenticated: false,
            currentUser: null,
            error: null,
            loading: false
        });
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        // 在真实项目中，这里应该是API调用
        try {
            // 模拟网络延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 检查邮箱是否已被注册
            const userExists = mockUsers.some(u => u.email === email);

            if (userExists) {
                setAuthState(prev => ({
                    ...prev,
                    error: '该邮箱已被注册',
                    loading: false
                }));
                return false;
            }

            // 创建新用户
            const newUser: User = {
                id: `user-${Date.now()}`,
                name,
                email,
                password,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
                inviteCode: generateInviteCode(),
                following: [],
                followers: [],
                friends: []
            };

            // 在真实环境中，这里应该是添加用户到数据库
            // 这里我们只是模拟
            mockUsers.push(newUser);
            // 保存更新后的用户数据到localStorage
            saveUsersToStorage(mockUsers);

            // 自动登录
            setAuthState({
                isAuthenticated: true,
                currentUser: newUser,
                error: null,
                loading: false
            });

            localStorage.setItem('currentUser', JSON.stringify(newUser));
            return true;
        } catch (error) {
            setAuthState(prev => ({
                ...prev,
                error: '注册失败，请稍后再试',
                loading: false
            }));
            return false;
        }
    };

    const followUser = (userId: string) => {
        if (!authState.currentUser) return;

        const currentUser = { ...authState.currentUser };

        // 添加到关注列表
        if (!currentUser.following.includes(userId)) {
            currentUser.following = [...currentUser.following, userId];

            // 更新朋友关系
            const targetUser = mockUsers.find(u => u.id === userId);
            if (targetUser && targetUser.following.includes(currentUser.id)) {
                currentUser.friends = [...currentUser.friends, userId];

                // 在实际应用中，应该也更新目标用户的friends数组
                const targetUserIndex = mockUsers.findIndex(u => u.id === userId);
                if (targetUserIndex !== -1) {
                    mockUsers[targetUserIndex].friends = [...mockUsers[targetUserIndex].friends, currentUser.id];
                }
            }

            // 更新目标用户的粉丝列表
            const targetUserIndex = mockUsers.findIndex(u => u.id === userId);
            if (targetUserIndex !== -1) {
                mockUsers[targetUserIndex].followers = [...mockUsers[targetUserIndex].followers, currentUser.id];
            }

            // 保存更新后的用户数据到localStorage
            saveUsersToStorage(mockUsers);

            // 更新当前用户状态
            setAuthState({
                ...authState,
                currentUser
            });

            // 更新本地存储
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    };

    const unfollowUser = (userId: string) => {
        if (!authState.currentUser) return;

        const currentUser = { ...authState.currentUser };

        // 从关注列表中移除
        currentUser.following = currentUser.following.filter(id => id !== userId);

        // 更新朋友关系
        currentUser.friends = currentUser.friends.filter(id => id !== userId);

        // 更新目标用户的粉丝列表
        const targetUserIndex = mockUsers.findIndex(u => u.id === userId);
        if (targetUserIndex !== -1) {
            mockUsers[targetUserIndex].followers = mockUsers[targetUserIndex].followers.filter(id => id !== currentUser.id);
            mockUsers[targetUserIndex].friends = mockUsers[targetUserIndex].friends.filter(id => id !== currentUser.id);
        }

        // 保存更新后的用户数据到localStorage
        saveUsersToStorage(mockUsers);

        // 更新当前用户状态
        setAuthState({
            ...authState,
            currentUser
        });

        // 更新本地存储
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    };

    const isUserFriend = (userId: string): boolean => {
        if (!authState.currentUser) return false;
        return authState.currentUser.friends.includes(userId);
    };

    const canViewReview = (userId: string, visibility: 'friends' | 'private'): boolean => {
        if (!authState.currentUser) return false;

        if (authState.currentUser.id === userId) {
            return true; // 用户可以看到自己的所有评价
        }

        switch (visibility) {
            case 'friends':
                return isUserFriend(userId);
            case 'private':
                return false;
            default:
                return false;
        }
    };

    // 生成6位随机邀请码
    const generateInviteCode = (): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    // 通过邀请码添加好友
    const addFriendByInviteCode = (inviteCode: string): { success: boolean; message: string } => {
        if (!authState.currentUser) {
            return { success: false, message: '请先登录' };
        }

        // 查找具有此邀请码的用户
        const targetUser = mockUsers.find(u => u.inviteCode === inviteCode);

        if (!targetUser) {
            return { success: false, message: '邀请码无效' };
        }

        // 不能添加自己为好友
        if (targetUser.id === authState.currentUser.id) {
            return { success: false, message: '不能添加自己为好友' };
        }

        // 检查是否已经是好友
        if (authState.currentUser.friends.includes(targetUser.id)) {
            return { success: false, message: '你们已经是好友了' };
        }

        // 更新当前用户信息
        const currentUser = { ...authState.currentUser };

        // 两边都添加对方为好友
        currentUser.friends = [...currentUser.friends, targetUser.id];
        currentUser.following = [...currentUser.following, targetUser.id];
        currentUser.followers = [...currentUser.followers, targetUser.id];

        // 更新目标用户信息
        const targetUserIndex = mockUsers.findIndex(u => u.id === targetUser.id);
        if (targetUserIndex !== -1) {
            mockUsers[targetUserIndex].friends = [...mockUsers[targetUserIndex].friends, currentUser.id];
            mockUsers[targetUserIndex].following = [...mockUsers[targetUserIndex].following, currentUser.id];
            mockUsers[targetUserIndex].followers = [...mockUsers[targetUserIndex].followers, currentUser.id];
        }

        // 保存更新后的用户数据
        saveUsersToStorage(mockUsers);

        // 更新当前用户状态
        setAuthState({
            ...authState,
            currentUser
        });

        // 更新本地存储
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        return { success: true, message: '已成功添加好友' };
    };

    return (
        <AuthContext.Provider value={{
            authState,
            login,
            logout,
            register,
            followUser,
            unfollowUser,
            isUserFriend,
            canViewReview,
            addFriendByInviteCode,
            generateInviteCode
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 