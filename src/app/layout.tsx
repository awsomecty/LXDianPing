'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" data-theme="light">
      <head>
        <script src="/theme-script.js" />
      </head>
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <AppNavbar />
            <main className="flex-grow">{children}</main>
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
              <div>
                <p>良心点评 © 2025 - 分享美食，品味生活</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

function AppNavbar() {
  const pathname = usePathname();
  const { authState, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/">首页</Link></li>
            <li><Link href="/about">关于我们</Link></li>
            {authState.isAuthenticated && (
              <>
                <li><Link href="/profile">个人中心</Link></li>
                <li><Link href="/my-reviews">我的故事</Link></li>
                <li><Link href="/favorites">收藏夹</Link></li>
                <li><Link href="/profile/my-restaurants">我的餐厅</Link></li>
                <li><a onClick={() => logout()}>退出登录</a></li>
              </>
            )}
            {!authState.isAuthenticated && (
              <>
                <li><Link href="/login">登录</Link></li>
                <li><Link href="/register">注册</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">良心点评</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/" className={pathname === '/' ? 'active' : ''}>首页</Link></li>
          <li><Link href="/about" className={pathname === '/about' ? 'active' : ''}>关于我们</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        {authState.isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={authState.currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"} alt="用户头像" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link href="/profile">个人中心</Link></li>
              <li><Link href="/my-reviews">我的故事</Link></li>
              <li><Link href="/favorites">收藏夹</Link></li>
              <li><Link href="/profile/my-restaurants">我的餐厅</Link></li>
              <li><a onClick={() => logout()}>退出登录</a></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="btn btn-sm">登录</Link>
            <Link href="/register" className="btn btn-sm btn-primary">注册</Link>
          </div>
        )}
      </div>
    </div>
  );
}
