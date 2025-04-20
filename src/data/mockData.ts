import { Restaurant, Review, User } from '../types';

// 默认用户数据
const defaultUsers: User[] = [
    {
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        inviteCode: 'ZS1234',
        following: ['2'],
        followers: ['2'],
        friends: ['2'] // 互相关注
    },
    {
        id: '2',
        name: '李四',
        email: 'lisi@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        inviteCode: 'LS5678',
        following: ['1'],
        followers: ['1'],
        friends: ['1'] // 互相关注
    },
    {
        id: '3',
        name: '王五',
        email: 'wangwu@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        inviteCode: 'WW9012',
        following: [],
        followers: [],
        friends: []
    }
];

// 从localStorage读取用户数据，如果没有则使用默认数据
const loadUsersFromStorage = (): User[] => {
    if (typeof window === 'undefined') {
        return defaultUsers; // 服务器端渲染时返回默认数据
    }

    const storedUsers = localStorage.getItem('mockUsers');
    if (storedUsers) {
        try {
            let users = JSON.parse(storedUsers);

            // 检查是否所有用户都有邀请码，如果没有则添加
            let needUpdate = false;
            users = users.map((user: User) => {
                if (!user.inviteCode) {
                    needUpdate = true;
                    return {
                        ...user,
                        inviteCode: `${user.name.substring(0, 2)}${Math.floor(1000 + Math.random() * 9000)}`
                    };
                }
                return user;
            });

            // 如果有更新，保存回localStorage
            if (needUpdate) {
                localStorage.setItem('mockUsers', JSON.stringify(users));
            }

            return users;
        } catch (error) {
            console.error('Failed to parse users from localStorage:', error);
            return defaultUsers;
        }
    }

    // 如果localStorage中没有数据，存入默认数据
    localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
    return defaultUsers;
};

// 保存用户数据到localStorage
export const saveUsersToStorage = (users: User[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mockUsers', JSON.stringify(users));
    }
};

export let mockUsers: User[] = loadUsersFromStorage();

export const mockReviews: Review[] = [
    {
        id: '1',
        userId: '1',
        userName: '张三',
        rating: 4.5,
        comment: '菜品很好吃，服务态度也很好！',
        date: '2024-04-19',
        visibility: 'public' // 公开评论
    },
    {
        id: '2',
        userId: '2',
        userName: '李四',
        rating: 4.0,
        comment: '环境不错，就是价格稍贵。',
        date: '2024-04-18',
        visibility: 'friends' // 仅朋友可见
    },
    {
        id: '3',
        userId: '2',
        userName: '李四',
        rating: 3.5,
        comment: '这家店的菜有点咸，不太符合我的口味。',
        date: '2024-04-16',
        visibility: 'private' // 仅自己可见
    }
];

// 默认餐厅数据
const defaultRestaurants: Restaurant[] = [
    {
        id: '1',
        name: '老王川菜馆',
        description: '正宗川菜，麻辣鲜香',
        address: '北京市朝阳区建国路88号',
        rating: 4.5,
        priceRange: '¥¥',
        cuisine: '川菜',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
        reviews: [mockReviews[0], mockReviews[1]]
    },
    {
        id: '2',
        name: '江南小馆',
        description: '精致江浙菜，清淡可口',
        address: '北京市海淀区中关村大街1号',
        rating: 4.2,
        priceRange: '¥¥¥',
        cuisine: '江浙菜',
        imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500',
        reviews: [mockReviews[2]]
    },
    {
        id: '3',
        name: '粤式茶餐厅',
        description: '正宗粤式早茶，点心精致',
        address: '北京市西城区西单北大街120号',
        rating: 4.7,
        priceRange: '¥¥',
        cuisine: '粤菜',
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500',
        reviews: []
    }
];

// 从localStorage读取餐厅数据，如果没有则使用默认数据
export const loadRestaurantsFromStorage = (): Restaurant[] => {
    if (typeof window === 'undefined') {
        return defaultRestaurants; // 服务器端渲染时返回默认数据
    }

    const storedRestaurants = localStorage.getItem('mockRestaurants');
    if (storedRestaurants) {
        try {
            return JSON.parse(storedRestaurants);
        } catch (error) {
            console.error('Failed to parse restaurants from localStorage:', error);
            return defaultRestaurants;
        }
    }

    // 如果localStorage中没有数据，存入默认数据
    localStorage.setItem('mockRestaurants', JSON.stringify(defaultRestaurants));
    return defaultRestaurants;
};

// 保存餐厅数据到localStorage
export const saveRestaurantsToStorage = (restaurants: Restaurant[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mockRestaurants', JSON.stringify(restaurants));
    }
};

export let mockRestaurants: Restaurant[] = loadRestaurantsFromStorage(); 