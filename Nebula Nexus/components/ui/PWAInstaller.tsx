'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  X, 
  Smartphone, 
  CheckCircle, 
  Info,
  Star,
  Zap,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineIndicator(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineIndicator(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  const handleOfflineDismiss = () => {
    setShowOfflineIndicator(false);
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-4 shadow-2xl border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Nebula Nexus'u İndir</h3>
                    <p className="text-cyan-100 text-sm">Hızlı erişim için ana ekrana ekle</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleInstallClick}
                    className="bg-white text-cyan-600 px-4 py-2 rounded-lg font-medium hover:bg-cyan-50 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>İndir</span>
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Indicator */}
      <AnimatePresence>
        {showOfflineIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-4 shadow-2xl border border-orange-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <WifiOff className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Çevrimdışı Mod</h3>
                    <p className="text-orange-100 text-sm">İnternet bağlantısı yok</p>
                  </div>
                </div>
                <button
                  onClick={handleOfflineDismiss}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Features Info */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full shadow-2xl border border-purple-500/30"
          onClick={() => setShowInstallPrompt(true)}
        >
          <Zap className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </>
  );
}

// PWA Features Component
export function PWAFeatures() {
  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Ana Ekrana Ekle',
      description: 'Uygulamayı ana ekranınıza ekleyin ve hızlı erişim sağlayın'
    },
    {
      icon: <WifiOff className="w-6 h-6" />,
      title: 'Çevrimdışı Çalışma',
      description: 'İnternet olmadan da temel özellikleri kullanın'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Hızlı Yükleme',
      description: 'Önbelleğe alınmış içeriklerle hızlı yükleme'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Güvenli',
      description: 'HTTPS ile güvenli bağlantı ve veri koruması'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Native Deneyim',
      description: 'Mobil uygulama gibi doğal kullanıcı deneyimi'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Güncellemeler',
      description: 'Otomatik güncellemeler ve yeni özellikler'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="ai-card hover:scale-105 transition-transform"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
          </div>
          <p className="text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

// PWA Status Component
export function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="ai-card">
      <h3 className="text-lg font-semibold text-white mb-4">PWA Durumu</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Kurulum Durumu:</span>
          <div className="flex items-center space-x-2">
            {isInstalled ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Kurulu</span>
              </>
            ) : (
              <>
                <Info className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">Kurulmamış</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Bağlantı Durumu:</span>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Çevrimiçi</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Çevrimdışı</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">PWA Desteği:</span>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Destekleniyor</span>
          </div>
        </div>
      </div>
    </div>
  );
} 