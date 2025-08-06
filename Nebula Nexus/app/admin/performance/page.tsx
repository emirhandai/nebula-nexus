'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  Activity, 
  Zap, 
  Clock, 
  Database, 
  Network, 
  HardDrive, 
  Cpu, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Home,
  Settings,
  BarChart3,
  Gauge,
  Server
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export default function AdminPerformancePage() {
  const { user, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkUsage: 0,
    responseTime: 0,
    throughput: 0,
    errorRate: 0,
    uptime: 0
  });
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/dashboard';
      return;
    }
    loadPerformanceData();
  }, [isAdmin]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadPerformanceData, 10000); // 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch real performance data from API
      const response = await fetch('/api/admin/system-metrics');
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Use real system metrics
        const realMetrics: PerformanceMetrics = {
          cpuUsage: data.metrics.cpuUsage || 0,
          memoryUsage: data.metrics.memoryUsage || 0,
          diskUsage: data.metrics.diskUsage || 0,
          networkUsage: data.metrics.networkUsage || 0,
          responseTime: data.metrics.responseTime || 0,
          throughput: data.metrics.throughput || 0,
          errorRate: data.metrics.errorRate || 0,
          uptime: data.metrics.uptime || 100
        };

        const realAlerts: PerformanceAlert[] = data.alerts || [
          {
            id: '1',
            type: 'info',
            message: 'Sistem performansı normal seviyelerde',
            timestamp: new Date().toISOString(),
            severity: 'low'
          }
        ];

        setMetrics(realMetrics);
        setAlerts(realAlerts);
      } else {
        console.error('Failed to load performance data:', data.error);
        // Fallback to minimal data instead of mock
        const fallbackMetrics: PerformanceMetrics = {
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0,
          networkUsage: 0,
          responseTime: 0,
          throughput: 0,
          errorRate: 0,
          uptime: 100
        };
        setMetrics(fallbackMetrics);
        setAlerts([]);
      }
    } catch (error) {
      console.error('Performance data loading error:', error);
      // Fallback to minimal data instead of mock
      const fallbackMetrics: PerformanceMetrics = {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkUsage: 0,
        responseTime: 0,
        throughput: 0,
        errorRate: 0,
        uptime: 100
      };
      setMetrics(fallbackMetrics);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Erişim Reddedildi</h2>
          <p className="text-purple-200 mb-8">Bu sayfaya erişmek için admin yetkisine sahip olmanız gerekiyor.</p>
          <a href="/dashboard" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Dashboard'a Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Performans İzleme
              </h1>
              <p className="text-gray-400">Sistem performansını ve kaynak kullanımını izleyin</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  autoRefresh 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Otomatik Yenile</span>
              </button>
              <button
                onClick={loadPerformanceData}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-4 py-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Yenile</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* System Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(metrics.cpuUsage, { warning: 70, critical: 90 })}`}>
                {metrics.cpuUsage}%
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">CPU Kullanımı</h3>
            <p className="text-purple-200 text-sm">İşlemci yükü</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-green-400" />
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(metrics.memoryUsage, { warning: 80, critical: 95 })}`}>
                {metrics.memoryUsage}%
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">RAM Kullanımı</h3>
            <p className="text-purple-200 text-sm">Bellek kullanımı</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-purple-400" />
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(metrics.diskUsage, { warning: 85, critical: 95 })}`}>
                {metrics.diskUsage}%
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Disk Kullanımı</h3>
            <p className="text-purple-200 text-sm">Depolama alanı</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Network className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {metrics.networkUsage} MB/s
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Network</h3>
            <p className="text-purple-200 text-sm">Ağ trafiği</p>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Uygulama Performansı</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Yanıt Süresi</span>
                </div>
                <span className={`font-semibold ${getStatusColor(metrics.responseTime, { warning: 200, critical: 500 })}`}>
                  {metrics.responseTime}ms
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-white">Throughput</span>
                </div>
                <span className="font-semibold text-white">
                  {metrics.throughput} req/s
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-white">Hata Oranı</span>
                </div>
                <span className={`font-semibold ${getStatusColor(metrics.errorRate, { warning: 1, critical: 5 })}`}>
                  {metrics.errorRate.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Server className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Uptime</span>
                </div>
                <span className="font-semibold text-green-400">
                  {metrics.uptime.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Performans Uyarıları</h3>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-purple-200">Yükleniyor...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white text-sm">{alert.message}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertColor(alert.type)}`}>
                          {alert.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-purple-200 text-xs">
                        {new Date(alert.timestamp).toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Performance Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Performans Grafikleri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-4">CPU Kullanımı (Son 24 Saat)</h4>
              <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-200">Grafik burada görünecek</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-4">Yanıt Süresi (Son 24 Saat)</h4>
              <div className="h-32 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-200">Grafik burada görünecek</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 