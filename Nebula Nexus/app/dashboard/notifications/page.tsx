'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell,
  BellOff,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Clock,
  Star,
  MessageSquare,
  Target,
  Activity
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNotificationManager } from '@/components/ui/NotificationSystem';
import { PageLoading } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorBoundary';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  testCompleted: boolean;
  chatMessage: boolean;
  careerUpdate: boolean;
  achievement: boolean;
  system: boolean;
}

export default function NotificationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { notifications, removeNotification, clearAll } = useNotificationManager();
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    testCompleted: true,
    chatMessage: true,
    careerUpdate: true,
    achievement: true,
    system: true
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotificationSettings();
    }
  }, [isAuthenticated, user]);

  const loadNotificationSettings = async () => {
    try {
      setIsLoadingData(true);
      setError(null);

      const response = await fetch(`/api/user/notification-settings?userId=${user?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Notification settings error:', error);
      setError('Bildirim ayarları yüklenirken hata oluştu');
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          settings: newSettings
        })
      });

      if (response.ok) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Update settings error:', error);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'test_completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'chat_message':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'career_update':
        return <Target className="w-4 h-4 text-purple-400" />;
      case 'achievement':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} gün önce`;
    if (hours > 0) return `${hours} saat önce`;
    if (minutes > 0) return `${minutes} dakika önce`;
    return 'Az önce';
  };

  if (isLoading) {
    return <PageLoading text="Bildirim ayarları yükleniyor..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 text-white mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-400">Bildirim ayarlarını görüntülemek için lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Bildirim Yönetimi</h1>
            <p className="text-gray-400">Bildirim tercihlerinizi ve geçmişinizi yönetin</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={clearAll}
              className="ai-button-secondary"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Tümünü Okundu İşaretle
            </button>
            <button
              onClick={clearAll}
              className="ai-button-secondary"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Temizle
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            title="Hata" 
            message={error} 
            onRetry={loadNotificationSettings}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* General Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="ai-card"
            >
              <h3 className="text-lg font-bold text-white mb-4">Genel Ayarlar</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'E-posta Bildirimleri', icon: Bell },
                  { key: 'push', label: 'Push Bildirimleri', icon: Bell },
                  { key: 'sms', label: 'SMS Bildirimleri', icon: Bell }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <setting.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{setting.label}</span>
                    </div>
                    <button
                      onClick={() => handleSettingChange(setting.key as keyof NotificationSettings)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings[setting.key as keyof NotificationSettings]
                          ? 'bg-cyan-500'
                          : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        settings[setting.key as keyof NotificationSettings]
                          ? 'transform translate-x-6'
                          : 'transform translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notification Types */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="ai-card"
            >
              <h3 className="text-lg font-bold text-white mb-4">Bildirim Türleri</h3>
              <div className="space-y-4">
                {[
                  { key: 'testCompleted', label: 'Test Tamamlandı', icon: CheckCircle },
                  { key: 'chatMessage', label: 'AI Sohbet Mesajları', icon: MessageSquare },
                  { key: 'careerUpdate', label: 'Kariyer Güncellemeleri', icon: Target },
                  { key: 'achievement', label: 'Başarılar', icon: Star },
                  { key: 'system', label: 'Sistem Bildirimleri', icon: Settings }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <setting.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{setting.label}</span>
                    </div>
                    <button
                      onClick={() => handleSettingChange(setting.key as keyof NotificationSettings)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings[setting.key as keyof NotificationSettings]
                          ? 'bg-cyan-500'
                          : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        settings[setting.key as keyof NotificationSettings]
                          ? 'transform translate-x-6'
                          : 'transform translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="ai-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Bildirim Geçmişi</h3>
                <span className="text-sm text-gray-400">
                  {notifications.length} bildirim
                </span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Henüz bildirim yok</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border border-gray-700/50 rounded-lg hover:bg-gray-800/30 transition-colors cursor-pointer ${
                        'bg-blue-500/5 border-l-2 border-l-blue-500'
                      }`}
                      onClick={() => removeNotification(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                            <span className="text-xs text-gray-400">Az önce</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-300">{notification.message}</p>
                        </div>
                        {true && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 