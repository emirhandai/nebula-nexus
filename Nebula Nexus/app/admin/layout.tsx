'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Brain, 
  Briefcase, 
  Bot, 
  Settings, 
  Mail, 
  TrendingUp,
  Shield,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Database,
  Bell,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const adminMenuItems = [
  { name: 'Dashboard', href: '/admin', icon: Home, color: 'from-cyan-500 to-blue-600' },
  { name: 'Kullanıcılar', href: '/admin/users', icon: Users, color: 'from-purple-500 to-pink-600' },
  { name: 'Forum', href: '/admin/forum', icon: MessageSquare, color: 'from-blue-500 to-indigo-600' },
  { name: 'Güvenlik', href: '/admin/security', icon: Shield, color: 'from-red-500 to-rose-600' },
  { name: 'Analitik', href: '/admin/analytics', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
  { name: 'Test Yönetimi', href: '/admin/tests', icon: Brain, color: 'from-yellow-500 to-orange-600' },
  { name: 'Kariyer Verileri', href: '/admin/careers', icon: Briefcase, color: 'from-indigo-500 to-purple-600' },
  { name: 'AI Sistem', href: '/admin/ai', icon: Bot, color: 'from-teal-500 to-cyan-600' },
  { name: 'Ayarlar', href: '/admin/settings', icon: Settings, color: 'from-gray-500 to-gray-600' },
  { name: 'İletişim', href: '/admin/communication', icon: Mail, color: 'from-pink-500 to-rose-600' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/signin?redirect=/admin');
        return;
      }
      
      if (!isAdmin) {
        router.push('/dashboard?error=unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <div className="ai-card p-8 text-center">
          <div className="ai-spinner mb-4"></div>
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <div className="ai-card p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-400 mb-6">
            Bu sayfaya erişmek için admin yetkisine sahip olmanız gerekiyor.
          </p>
          <Link href="/auth/signin" className="ai-button-primary">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: sidebarOpen ? 0 : -400 }}
        className={`fixed left-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                  <p className="text-sm text-gray-400">Nebula Nexus</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Ana Sayfa Butonu - Header altında */}
            <div className="mt-6">
              <Link 
                href="/"
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 text-white font-medium shadow-lg"
              >
                <Home className="w-5 h-5" />
                <span>Ana Sayfaya Dön</span>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {adminMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' 
                      : 'hover:bg-gray-800/50'
                  }`}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-medium text-base ${
                    isActive ? 'text-cyan-400' : 'text-gray-300'
                  }`}>
                    {item.name}
                  </span>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-base font-medium">Sistem Aktif</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-96' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:text-white bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Database className="w-4 h-4" />
                <span className="text-sm">v1.0.0</span>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium text-sm">{user?.name}</span>
                  <p className="text-gray-400 text-xs">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 