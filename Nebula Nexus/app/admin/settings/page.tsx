'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Shield, 
  Bell, 
  Globe, 
  Palette,
  Server,
  Key,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  maxFileSize: number;
  sessionTimeout: number;
  backupFrequency: string;
  logLevel: string;
  cacheEnabled: boolean;
}

interface SecuritySettings {
  passwordMinLength: number;
  requireSpecialChars: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorEnabled: boolean;
  sslEnabled: boolean;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Nebula Nexus',
    siteDescription: 'AI Destekli Kariyer Yönlendirme Platformu',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    maxFileSize: 10,
    sessionTimeout: 30,
    backupFrequency: 'daily',
    logLevel: 'info',
    cacheEnabled: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorEnabled: false,
    sslEnabled: true
  });

  const [systemStatus, setSystemStatus] = useState({
    database: 'healthy',
    cache: 'healthy',
    email: 'healthy',
    storage: 'healthy'
  });

  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: Settings },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'system', name: 'Sistem Durumu', icon: Activity }
  ];

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Ayarlar başarıyla kaydedildi');
    } catch (error) {
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSystemRestart = async () => {
    if (!confirm('Sistemi yeniden başlatmak istediğinizden emin misiniz?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate system restart
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Sistem başarıyla yeniden başlatıldı');
    } catch (error) {
      toast.error('Sistem yeniden başlatma sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Sistem Ayarları</h1>
          <p className="text-gray-400">Platform konfigürasyonu ve güvenlik ayarları</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSystemRestart}
            disabled={isLoading}
            className="ai-button-secondary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sistemi Yeniden Başlat
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="ai-button-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="ai-card p-6"
      >
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ai-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Genel Ayarlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Site Adı
              </label>
              <input
                type="text"
                value={systemSettings.siteName}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Site Açıklaması
              </label>
              <input
                type="text"
                value={systemSettings.siteDescription}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Maksimum Dosya Boyutu (MB)
              </label>
              <input
                type="number"
                value={systemSettings.maxFileSize}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Oturum Zaman Aşımı (dakika)
              </label>
              <input
                type="number"
                value={systemSettings.sessionTimeout}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={systemSettings.maintenanceMode}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <label className="text-gray-400 text-sm">Bakım Modu</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={systemSettings.registrationEnabled}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, registrationEnabled: e.target.checked }))}
                className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <label className="text-gray-400 text-sm">Kayıt Olmaya İzin Ver</label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ai-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Güvenlik Ayarları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Minimum Şifre Uzunluğu
              </label>
              <input
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Maksimum Giriş Denemesi
              </label>
              <input
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.requireSpecialChars}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, requireSpecialChars: e.target.checked }))}
                className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <label className="text-gray-400 text-sm">Özel Karakter Gerektir</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorEnabled}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <label className="text-gray-400 text-sm">İki Faktörlü Doğrulama</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings.sslEnabled}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sslEnabled: e.target.checked }))}
                className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <label className="text-gray-400 text-sm">SSL Zorunlu</label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ai-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Bildirim Ayarları</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={systemSettings.emailNotifications}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <label className="text-gray-400 text-sm">Email Bildirimleri</label>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Yedekleme Sıklığı
              </label>
              <select
                value={systemSettings.backupFrequency}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              >
                <option value="hourly">Saatlik</option>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Log Seviyesi
              </label>
              <select
                value={systemSettings.logLevel}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, logLevel: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* System Status */}
      {activeTab === 'system' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ai-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Sistem Durumu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">Veritabanı</span>
                </div>
                <div className={`flex items-center space-x-2 ${getStatusColor(systemStatus.database)}`}>
                  {getStatusIcon(systemStatus.database)}
                  <span className="text-sm capitalize">{systemStatus.database}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">SQLite - Aktif ve çalışıyor</p>
            </div>

            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Cache</span>
                </div>
                <div className={`flex items-center space-x-2 ${getStatusColor(systemStatus.cache)}`}>
                  {getStatusIcon(systemStatus.cache)}
                  <span className="text-sm capitalize">{systemStatus.cache}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Memory Cache - Aktif</p>
            </div>

            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Email Servisi</span>
                </div>
                <div className={`flex items-center space-x-2 ${getStatusColor(systemStatus.email)}`}>
                  {getStatusIcon(systemStatus.email)}
                  <span className="text-sm capitalize">{systemStatus.email}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">SMTP - Hazır</p>
            </div>

            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Depolama</span>
                </div>
                <div className={`flex items-center space-x-2 ${getStatusColor(systemStatus.storage)}`}>
                  {getStatusIcon(systemStatus.storage)}
                  <span className="text-sm capitalize">{systemStatus.storage}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Local Storage - 2.1GB kullanıldı</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 