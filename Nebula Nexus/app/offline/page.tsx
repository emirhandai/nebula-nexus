'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Home, 
  Brain, 
  MessageSquare,
  BookOpen,
  Settings,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow
} from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);
    setConnectionType(getConnectionType());

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionType(getConnectionType());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionType('none');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getConnectionType = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      // Try to fetch a simple resource to test connectivity
      await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      // If successful, redirect to home
      window.location.href = '/';
    } catch (error) {
      console.log('Retry failed:', error);
      setIsRetrying(false);
    }
  };

  const getConnectionIcon = () => {
    if (!isOnline) return <WifiOff className="w-16 h-16 text-red-400" />;
    
    switch (connectionType) {
      case '4g':
        return <SignalHigh className="w-16 h-16 text-green-400" />;
      case '3g':
        return <SignalMedium className="w-16 h-16 text-yellow-400" />;
      case '2g':
      case 'slow-2g':
        return <SignalLow className="w-16 h-16 text-orange-400" />;
      default:
        return <Wifi className="w-16 h-16 text-cyan-400" />;
    }
  };

  const getConnectionText = () => {
    if (!isOnline) return 'İnternet bağlantısı yok';
    
    switch (connectionType) {
      case '4g':
        return 'Hızlı bağlantı (4G)';
      case '3g':
        return 'Orta hızda bağlantı (3G)';
      case '2g':
      case 'slow-2g':
        return 'Yavaş bağlantı (2G)';
      default:
        return 'Bağlantı mevcut';
    }
  };

  const getConnectionColor = () => {
    if (!isOnline) return 'text-red-400';
    
    switch (connectionType) {
      case '4g':
        return 'text-green-400';
      case '3g':
        return 'text-yellow-400';
      case '2g':
      case 'slow-2g':
        return 'text-orange-400';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="min-h-screen ai-gradient-bg flex items-center justify-center p-6">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20 border border-white/20">
            <Home className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Ana Sayfa</span>
          </button>
        </Link>
      </div>

      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ai-card text-center"
        >
          {/* Connection Status */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            {getConnectionIcon()}
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {isOnline ? 'Bağlantı Sorunu' : 'Çevrimdışı'}
          </h1>
          
          <p className={`text-lg mb-4 ${getConnectionColor()}`}>
            {getConnectionText()}
          </p>

          <p className="text-gray-400 mb-8">
            {isOnline 
              ? 'Sunucuya bağlanırken bir sorun oluştu. Lütfen tekrar deneyin.'
              : 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.'
            }
          </p>

          {/* Retry Button */}
          <motion.button
            onClick={handleRetry}
            disabled={isRetrying}
            className="ai-button-primary w-full mb-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Deneniyor...' : 'Tekrar Dene'}
          </motion.button>

          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mb-6">
              {retryCount} kez denendi
            </p>
          )}

          {/* Offline Features */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-t border-gray-700 pt-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Çevrimdışı Özellikler
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Link href="/test">
                  <motion.button
                    className="w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Test Hazırla</span>
                  </motion.button>
                </Link>

                <Link href="/chat">
                  <motion.button
                    className="w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Sohbet Hazırla</span>
                  </motion.button>
                </Link>

                <Link href="/resources">
                  <motion.button
                    className="w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Kaynaklar</span>
                  </motion.button>
                </Link>

                <Link href="/dashboard/profile">
                  <motion.button
                    className="w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <span className="text-sm text-white">Ayarlar</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Connection Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-gray-800/30 rounded-lg"
          >
            <h4 className="text-sm font-medium text-white mb-2">
              Bağlantı İpuçları
            </h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Wi-Fi bağlantınızı kontrol edin</li>
              <li>• Mobil veri kullanıyorsanız sinyal gücünü kontrol edin</li>
              <li>• Tarayıcınızı yeniden başlatın</li>
              <li>• Farklı bir ağ deneyin</li>
            </ul>
          </motion.div>

          {/* Home Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <Link href="/">
              <button className="ai-button-secondary w-full">
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 