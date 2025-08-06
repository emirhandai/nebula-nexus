'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Brain, 
  MessageSquare, 
  Target, 
  User, 
  Settings, 
  LogOut,
  BookOpen,
  BarChart3,
  Star,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const menuItems = [
    { icon: Home, label: 'Ana Sayfa', href: '/', color: 'from-blue-500 to-cyan-500' },
    { icon: Brain, label: 'Test Yap', href: '/test', color: 'from-purple-500 to-pink-500' },
    { icon: BarChart3, label: 'Test Geçmişi', href: '/dashboard/test-history', color: 'from-blue-500 to-indigo-500' },
    { icon: MessageSquare, label: 'AI Sohbet', href: '/chat', color: 'from-cyan-500 to-blue-500' },
    { icon: MessageSquare, label: 'Chat Geçmişi', href: '/dashboard/chat-history', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: 'Kariyer Yolu', href: '/career-roadmap', color: 'from-green-500 to-emerald-500' },
    { icon: Star, label: 'Kariyer Önerileri', href: '/dashboard/career-recommendations', color: 'from-yellow-500 to-orange-500' },
    { icon: BookOpen, label: 'Kaynaklar', href: '/resources', color: 'from-yellow-500 to-amber-500' },
    { icon: User, label: 'Profil', href: '/dashboard/profile', color: 'from-gray-500 to-slate-500' },
    { icon: Settings, label: 'Ayarlar', href: '/dashboard/settings', color: 'from-gray-500 to-zinc-500' },
  ];

  return (
    <div className={`lg:hidden ${className}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="mobile-touch-target p-2 text-white hover:text-cyan-400 transition-colors"
        aria-label="Toggle mobile menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeMenu}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 h-full bg-gray-900/95 backdrop-blur-md border-r border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Nebula Nexus</h2>
                    <p className="text-sm text-gray-400">Kariyer Yolculuğu</p>
                  </div>
                </div>
                <button
                  onClick={closeMenu}
                  className="mobile-touch-target p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-4 space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="mobile-nav-item flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="mobile-nav-item flex items-center space-x-3 w-full text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">Çıkış Yap</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 