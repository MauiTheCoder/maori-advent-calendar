'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdminContext } from '@/contexts/AdminContext';
import AdminGuard from '@/components/auth/AdminGuard';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { signOut, user } = useAuthContext();
  const { adminUser } = useAdminContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigationItems = [
    { href: '/admin/dashboard', label: '📊 Dashboard', icon: '📊' },
    { href: '/admin/activities', label: '🎯 Activities', icon: '🎯' },
    { href: '/admin/content', label: '📝 Content', icon: '📝' },
    { href: '/admin/media', label: '🖼️ Media', icon: '🖼️' },
    { href: '/admin/layout', label: '🎨 Layout', icon: '🎨' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Title */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌿</span>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Admin Dashboard
                  </h1>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label.replace(/^[^\s]+ /, '')}</span>
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {/* Quick Access */}
                <Link
                  href="/"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <span>🏠</span>
                  <span className="text-sm font-medium">Home</span>
                </Link>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.displayName || adminUser?.displayName || 'Admin User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </div>
                  </div>
                  
                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 bg-gray-50">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white"
                >
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label.replace(/^[^\s]+ /, '')}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-3">
              <nav className="text-sm text-gray-500">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/admin" className="hover:text-primary">
                  Admin
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">
                  {typeof window !== 'undefined' ? 
                    (() => {
                      const lastSegment = window.location.pathname.split('/').pop();
                      return lastSegment ? 
                        lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : 
                        'Dashboard';
                    })()
                    : 'Dashboard'
                  }
                </span>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                © 2025 Mahuru Māori Activation Platform
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/admin/help" className="hover:text-primary">
                  Help
                </Link>
                <span>|</span>
                <span>Version 1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AdminGuard>
  );
}