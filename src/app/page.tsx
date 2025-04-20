'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockRestaurants } from '../data/mockData';
import RestaurantCard from '../components/RestaurantCard';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// 定义餐厅类型
type CuisineType = '全部' | '川菜' | '江浙菜' | '粤菜';

// 每页显示的餐厅数量
const ITEMS_PER_PAGE = 2;

export default function Home() {
  const searchParams = useSearchParams();
  // 添加状态管理当前选中的分类
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType>('全部');
  // 添加搜索状态
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  // 添加分页状态
  const [displayedRestaurants, setDisplayedRestaurants] = useState<typeof mockRestaurants>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // 导入Auth上下文获取用户登录状态
  const { authState } = useAuth();

  // 当URL中的search参数改变时更新搜索词
  useEffect(() => {
    const searchFromParams = searchParams.get('search');
    if (searchFromParams) {
      setSearchTerm(searchFromParams);
    }
  }, [searchParams]);

  // 根据分类和搜索词筛选餐厅
  useEffect(() => {
    let results = mockRestaurants;

    // 先按分类筛选
    if (selectedCuisine !== '全部') {
      results = results.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }

    // 再按搜索词筛选
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.description.toLowerCase().includes(searchLower) ||
        restaurant.cuisine.toLowerCase().includes(searchLower) ||
        restaurant.address.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRestaurants(results);
    // 重置分页
    setPage(1);
    setDisplayedRestaurants(results.slice(0, ITEMS_PER_PAGE));
    setHasMore(results.length > ITEMS_PER_PAGE);
  }, [selectedCuisine, searchTerm]);

  // 加载更多餐厅
  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // 获取下一页的餐厅数据
    const nextPageItems = filteredRestaurants.slice(startIndex, endIndex);

    // 更新显示的餐厅列表
    setDisplayedRestaurants([...displayedRestaurants, ...nextPageItems]);
    setPage(nextPage);

    // 检查是否还有更多数据可以加载
    setHasMore(endIndex < filteredRestaurants.length);
  };

  // 处理搜索提交
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // 搜索逻辑已经在 useEffect 中实现
  };

  return (
    <main className="min-h-screen bg-base-200">
      <div className="hero bg-base-100 py-16">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-base-content">良心点评</h1>
            <p className="py-6 text-base-content">探索城市中的美味佳肴，分享你难忘的用餐体验</p>
            <form onSubmit={handleSearch} className="flex">
              <div className="join w-full">
                <input
                  className="input input-bordered join-item flex-1"
                  placeholder="搜索餐厅或美食"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary join-item text-white">
                  搜索
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-base-content">推荐餐厅</h2>
          <div className="tabs tabs-boxed">
            <a
              className={`tab ${selectedCuisine === '全部' ? 'tab-active' : ''}`}
              onClick={() => setSelectedCuisine('全部')}
            >
              全部
            </a>
            <a
              className={`tab ${selectedCuisine === '川菜' ? 'tab-active' : ''}`}
              onClick={() => setSelectedCuisine('川菜')}
            >
              川菜
            </a>
            <a
              className={`tab ${selectedCuisine === '江浙菜' ? 'tab-active' : ''}`}
              onClick={() => setSelectedCuisine('江浙菜')}
            >
              江浙菜
            </a>
            <a
              className={`tab ${selectedCuisine === '粤菜' ? 'tab-active' : ''}`}
              onClick={() => setSelectedCuisine('粤菜')}
            >
              粤菜
            </a>
          </div>
        </div>

        {searchTerm && (
          <div className="mb-4">
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>搜索: "{searchTerm}" - 找到 {filteredRestaurants.length} 个结果</span>
              {searchTerm && (
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => setSearchTerm('')}
                >
                  清除
                </button>
              )}
            </div>
          </div>
        )}

        {filteredRestaurants.length === 0 ? (
          <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-base-content">没有找到符合条件的餐厅，请尝试其他搜索词或分类</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {displayedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              className="btn btn-outline"
              onClick={loadMore}
            >
              加载更多
            </button>
          </div>
        )}

        {/* 添加餐厅区域 */}
        <div className="divider my-16">想要分享您发现的美食？</div>
        <div className="card bg-base-100 shadow-xl my-8">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-2xl mb-4">添加您自己的餐厅</h2>
            <p className="mb-6">您是否发现了一家尚未在良心点评上出现的好餐厅？添加它并与其他美食爱好者分享您的发现！</p>

            <div className="flex justify-center">
              {authState?.isAuthenticated ? (
                <Link href="/admin/add-restaurant" className="btn btn-primary btn-lg">
                  添加新餐厅
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <p className="font-bold">登录后即可添加餐厅</p>
                  <div className="flex gap-4">
                    <Link href="/login" className="btn btn-primary">
                      登录
                    </Link>
                    <Link href="/register" className="btn btn-outline">
                      注册
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
