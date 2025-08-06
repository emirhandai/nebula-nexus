'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Star,
  Target,
  BookOpen,
  Trophy,
  Zap
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'achievement':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTextColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-200';
      case 'warning':
        return 'text-yellow-200';
      case 'info':
        return 'text-blue-200';
      case 'achievement':
        return 'text-purple-200';
      default:
        return 'text-gray-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`max-w-sm w-full backdrop-blur-sm border rounded-2xl p-4 shadow-xl ${getBgColor(notification.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {notification.icon || getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-semibold ${getTextColor(notification.type)}`}>
                    {notification.title}
                  </h4>
                  <button
                    onClick={() => onRemove(notification.id)}
                    className="flex-shrink-0 ml-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className={`text-sm mt-1 ${getTextColor(notification.type)}`}>
                  {notification.message}
                </p>
                
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-3 text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Notification Manager Hook
export function useNotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove if autoClose is true
    if (notification.autoClose !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Predefined notification types
  const showSuccess = (title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'success',
      title,
      message,
      action,
      autoClose: true,
      duration: 4000
    });
  };

  const showWarning = (title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'warning',
      title,
      message,
      action,
      autoClose: true,
      duration: 6000
    });
  };

  const showInfo = (title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'info',
      title,
      message,
      action,
      autoClose: true,
      duration: 5000
    });
  };

  const showAchievement = (title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'achievement',
      title,
      message,
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      action,
      autoClose: false,
      duration: 8000
    });
  };

  // Special notification types for the app
  const showTestCompletion = (score: number) => {
    showAchievement(
      'Test Tamamlandı! 🎉',
      `OCEAN kişilik testinizi başarıyla tamamladınız. Puanınız: ${score}/100`,
      {
        label: 'Sonuçları Gör',
        onClick: () => window.location.href = '/dashboard'
      }
    );
  };

  const showFieldSelection = (field: string) => {
    showSuccess(
      'Alan Seçildi! 🎯',
      `${field} alanını seçtiniz. Artık AI ile bu alan hakkında konuşabilirsiniz.`,
      {
        label: 'AI Chat\'e Git',
        onClick: () => window.location.href = '/chat'
      }
    );
  };

  const showCourseRecommendation = (field: string) => {
    showInfo(
      'Yeni Eğitimler! 📚',
      `${field} alanında yeni eğitimler eklendi. Hemen göz atın!`,
      {
        label: 'Eğitimleri Gör',
        onClick: () => window.location.href = '/resources'
      }
    );
  };

  const showLevelUp = (newLevel: number) => {
    showAchievement(
      'Seviye Atladınız! ⭐',
      `Tebrikler! Seviye ${newLevel}'e yükseldiniz. Daha fazla özellik açıldı.`,
      {
        label: 'Dashboard\'a Git',
        onClick: () => window.location.href = '/dashboard'
      }
    );
  };

  const showChatReminder = () => {
    showWarning(
      'AI Chat Hatırlatması 🤖',
      'Seçtiğiniz alan hakkında AI ile konuşarak daha fazla bilgi edinebilirsiniz.',
      {
        label: 'Chat\'e Git',
        onClick: () => window.location.href = '/chat'
      }
    );
  };

  const showCourseReminder = () => {
    showInfo(
      'Eğitim Hatırlatması 📖',
      'Seçtiğiniz alanda kendinizi geliştirmek için önerilen eğitimleri tamamlayın.',
      {
        label: 'Eğitimleri Gör',
        onClick: () => window.location.href = '/resources'
      }
    );
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showWarning,
    showInfo,
    showAchievement,
    showTestCompletion,
    showFieldSelection,
    showCourseRecommendation,
    showLevelUp,
    showChatReminder,
    showCourseReminder
  };
}

// Notification Bell Component
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate unread notifications
    const interval = setInterval(() => {
      setUnreadCount(prev => Math.min(prev + Math.floor(Math.random() * 2), 5));
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl z-50"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Bildirimler</h3>
              <button
                onClick={() => setUnreadCount(0)}
                className="text-sm text-purple-300 hover:text-white"
              >
                Tümünü Okundu İşaretle
              </button>
            </div>

            {unreadCount === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Yeni bildiriminiz yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: Math.min(unreadCount, 3) }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">
                        {index === 0 ? 'Test tamamlama hatırlatması' : 
                         index === 1 ? 'Yeni eğitim önerisi' : 'AI chat hatırlatması'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {index === 0 ? 'OCEAN testinizi tamamlayın' :
                         index === 1 ? 'Seçtiğiniz alanda yeni eğitimler var' : 'AI ile konuşarak bilgi edinin'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
} 