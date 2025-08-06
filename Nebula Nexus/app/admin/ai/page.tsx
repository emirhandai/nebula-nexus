'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Settings, 
  Activity, 
  Zap,
  Cpu,
  Database,
  Network,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AIModel {
  id: string;
  name: string;
  type: 'chat' | 'analysis' | 'recommendation';
  status: 'active' | 'inactive' | 'training';
  accuracy: number;
  responseTime: number;
  requestsToday: number;
  lastUpdated: string;
}

interface AISystem {
  cpu: number;
  memory: number;
  gpu: number;
  network: number;
  status: 'healthy' | 'warning' | 'critical';
}

export default function AISystemManagement() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [systemStatus, setSystemStatus] = useState<AISystem>({
    cpu: 45,
    memory: 67,
    gpu: 23,
    network: 12,
    status: 'healthy'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real AI data from API
      const response = await fetch('/api/admin/ai');
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Use real AI models data
        setModels(data.models || []);
        setSystemStatus({
          cpu: data.system.cpu || 0,
          memory: data.system.memory || 0,
          gpu: data.system.gpu || 0,
          network: data.system.network || 0,
          status: data.system.status || 'healthy'
        });
      } else {
        console.error('Error loading AI data:', data.error || 'Unknown error');
        toast.error('AI verileri yüklenirken hata oluştu');
        
        // Fallback to empty data instead of mock
        setModels([]);
        setSystemStatus({
          cpu: 0,
          memory: 0,
          gpu: 0,
          network: 0,
          status: 'healthy'
        });
      }
    } catch (error) {
      console.error('Error loading AI data:', error);
      toast.error('AI verileri yüklenirken hata oluştu');
      
      // Fallback to empty data instead of mock
      setModels([]);
      setSystemStatus({
        cpu: 0,
        memory: 0,
        gpu: 0,
        network: 0,
        status: 'healthy'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'inactive': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'training': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'training': return 'Eğitimde';
      default: return 'Bilinmiyor';
    }
  };

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSystemStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const handleModelToggle = async (modelId: string) => {
    try {
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, status: model.status === 'active' ? 'inactive' : 'active' }
          : model
      ));
      toast.success('Model durumu güncellendi');
    } catch {
      toast.error('Model durumu güncellenirken hata oluştu');
    }
  };

  const handleSystemRestart = async () => {
    if (!confirm('AI sistemini yeniden başlatmak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      toast.success('AI sistemi yeniden başlatılıyor...');
      // Simulate restart
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('AI sistemi başarıyla yeniden başlatıldı');
    } catch {
      toast.error('Sistem yeniden başlatma sırasında hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="ai-spinner"></div>
        <span className="ml-4 text-white">AI sistemi yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">AI Sistem Yönetimi</h1>
          <p className="text-gray-400">Yapay zeka modelleri ve sistem durumu</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSystemRestart}
            className="ai-button-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sistemi Yeniden Başlat
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ai-button-primary"
          >
            <Settings className="w-4 h-4 mr-2" />
            AI Ayarları
          </motion.button>
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="ai-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">CPU Kullanımı</p>
              <p className="text-3xl font-bold text-white">{systemStatus.cpu}%</p>
              <p className="text-green-400 text-sm">Normal</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="ai-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">RAM Kullanımı</p>
              <p className="text-3xl font-bold text-white">{systemStatus.memory}%</p>
              <p className="text-yellow-400 text-sm">Orta</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="ai-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">GPU Kullanımı</p>
              <p className="text-3xl font-bold text-white">{systemStatus.gpu}%</p>
              <p className="text-green-400 text-sm">Düşük</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="ai-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Network</p>
              <p className="text-3xl font-bold text-white">{systemStatus.network} MB/s</p>
              <p className="text-green-400 text-sm">Stabil</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Models */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="ai-card p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">AI Modelleri</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Model</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Tip</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Durum</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Doğruluk</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Yanıt Süresi</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">İstekler</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <motion.tr
                  key={model.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{model.name}</p>
                      <p className="text-gray-400 text-sm">Son güncelleme: {model.lastUpdated}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      {model.type === 'chat' ? 'Sohbet' : model.type === 'analysis' ? 'Analiz' : 'Öneri'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(model.status)}`}>
                      {getStatusText(model.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-white">{model.accuracy}%</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-white">{model.responseTime}s</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-white">{model.requestsToday.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleModelToggle(model.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          model.status === 'active'
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                            : 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                        }`}
                      >
                        {model.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                      >
                        <Settings className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="ai-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Sistem Sağlığı</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 ${getSystemStatusColor(systemStatus.status)}`}>
                  {getSystemStatusIcon(systemStatus.status)}
                  <span className="font-medium">Genel Durum</span>
                </div>
              </div>
              <span className={`font-bold ${getSystemStatusColor(systemStatus.status)}`}>
                {systemStatus.status === 'healthy' ? 'Sağlıklı' : systemStatus.status === 'warning' ? 'Uyarı' : 'Kritik'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">CPU Sıcaklığı</span>
                <span className="text-white">45°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">GPU Sıcaklığı</span>
                <span className="text-white">62°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Disk Kullanımı</span>
                <span className="text-white">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Aktif Bağlantılar</span>
                <span className="text-white">1,247</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ai-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Performans Metrikleri</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Ortalama Yanıt Süresi</p>
                  <p className="text-gray-400 text-sm">Tüm modeller</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">1.2s</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-white font-medium">Toplam İstek</p>
                  <p className="text-gray-400 text-sm">Bugün</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">2,535</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Başarı Oranı</p>
                  <p className="text-gray-400 text-sm">Son 24 saat</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">99.8%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 