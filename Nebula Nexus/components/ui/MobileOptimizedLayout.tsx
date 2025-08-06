'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Target,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function MobileOptimizedLayout({ children, currentPage }: MobileOptimizedLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Ana Sayfa', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'Test', href: '/test', icon: Brain },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
    { name: 'Eğitimler', href: '/resources', icon: BookOpen },
    { name: 'Kariyer Yolu', href: '/career-roadmap', icon: Target }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-bold text-white">Nebula AI</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {isProfileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900/95 backdrop-blur-sm border-t border-white/10"
            >
              <div className="px-4 py-3 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.name || 'Kullanıcı'}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link href="/dashboard/profile">
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profil</span>
                    </button>
                  </Link>
                  <Link href="/dashboard/settings">
                    <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Ayarlar</span>
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-80 h-full bg-gray-900/95 backdrop-blur-sm z-50 lg:hidden border-r border-white/10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white">Nebula AI</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = currentPage === item.href;
                    return (
                      <Link key={item.href} href={item.href}>
                        <button
                          onClick={() => setIsMenuOpen(false)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Hızlı Erişim</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/test">
                        <button className="w-full px-3 py-2 bg-purple-600/20 text-purple-300 rounded-lg text-sm hover:bg-purple-600/30 transition-colors">
                          Test Çöz
                        </button>
                      </Link>
                      <Link href="/chat">
                        <button className="w-full px-3 py-2 bg-pink-600/20 text-pink-300 rounded-lg text-sm hover:bg-pink-600/30 transition-colors">
                          AI Chat
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-16 lg:pt-0 ${isMenuOpen ? 'lg:ml-0' : ''}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-white/10 lg:hidden z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.slice(0, 5).map((item) => {
            const isActive = currentPage === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-purple-400 bg-purple-600/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.name}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Content Padding */}
      <div className="pb-20 lg:pb-0" />
    </div>
  );
} 