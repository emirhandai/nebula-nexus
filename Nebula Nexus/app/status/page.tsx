'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Activity, CheckCircle, AlertCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

export default function Status() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const systemStatus = {
    overall: 'operational',
    uptime: '99.9%',
    lastIncident: '2024-07-15',
    responseTime: '120ms'
  };

  const services = [
    {
      name: 'Web Sitesi',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '120ms',
      lastCheck: '2 dakika önce'
    },
    {
      name: 'API Servisleri',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '85ms',
      lastCheck: '1 dakika önce'
    },
    {
      name: 'Veritabanı',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '45ms',
      lastCheck: '30 saniye önce'
    },
    {
      name: 'AI Sohbet',
      status: 'operational',
      uptime: '99.7%',
      responseTime: '2.1s',
      lastCheck: '1 dakika önce'
    },
    {
      name: 'OCEAN Testi',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '180ms',
      lastCheck: '2 dakika önce'
    },
    {
      name: 'Forum',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '95ms',
      lastCheck: '1 dakika önce'
    },
    {
      name: 'Proje Dayanışması',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '110ms',
      lastCheck: '1 dakika önce'
    },
    {
      name: 'Mesajlaşma',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '75ms',
      lastCheck: '30 saniye önce'
    }
  ];

  const recentIncidents = [
    {
      date: '2024-07-15',
      time: '14:30',
      title: 'API Servislerinde Kısa Süreli Kesinti',
      status: 'resolved',
      description: 'API servislerinde yaşanan kısa süreli kesinti giderildi. Tüm servisler normal çalışmaya devam ediyor.',
      duration: '15 dakika'
    },
    {
      date: '2024-07-10',
      time: '09:15',
      title: 'Planlı Bakım',
      status: 'resolved',
      description: 'Sistem performansını artırmak için planlı bakım gerçekleştirildi.',
      duration: '2 saat'
    },
    {
      date: '2024-07-05',
      time: '16:45',
      title: 'AI Sohbet Servisinde Gecikme',
      status: 'resolved',
      description: 'AI sohbet servisinde yaşanan gecikme sorunu çözüldü.',
      duration: '45 dakika'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400 bg-green-400/10';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'outage':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Çalışıyor';
      case 'degraded':
        return 'Kısmi Sorun';
      case 'outage':
        return 'Kesinti';
      default:
        return 'Bilinmiyor';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sistem Durumu
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Nebula Nexus platformunun tüm servislerinin güncel durumu ve performans bilgileri.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <span className="text-sm text-gray-400">
                Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}
              </span>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Yenile</span>
              </button>
            </div>
          </div>

          {/* Overall Status */}
          <div className="ai-card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Genel Durum</h2>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(systemStatus.overall)}`}>
                {getStatusIcon(systemStatus.overall)}
                <span className="font-medium">{getStatusText(systemStatus.overall)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{systemStatus.uptime}</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{systemStatus.responseTime}</div>
                <div className="text-gray-400">Ortalama Yanıt</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{systemStatus.lastIncident}</div>
                <div className="text-gray-400">Son Kesinti</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">8/8</div>
                <div className="text-gray-400">Aktif Servis</div>
              </div>
            </div>
          </div>

          {/* Services Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Servis Durumları</h2>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="ai-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(service.status)}
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                      </div>
                      <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getStatusColor(service.status)}`}>
                        <span>{getStatusText(service.status)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Uptime</div>
                        <div className="text-white font-medium">{service.uptime}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Yanıt Süresi</div>
                        <div className="text-white font-medium">{service.responseTime}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Son Kontrol</div>
                        <div className="text-white font-medium">{service.lastCheck}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Incidents */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Son Olaylar</h2>
              <div className="space-y-4">
                {recentIncidents.map((incident, index) => (
                  <div key={index} className="ai-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{incident.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{incident.date} {incident.time}</span>
                          <span>•</span>
                          <span>{incident.duration}</span>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getStatusColor(incident.status)}`}>
                        <span>{getStatusText(incident.status)}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{incident.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="ai-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Performans Metrikleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-400">Aylık Uptime</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">120ms</div>
                <div className="text-gray-400">Ortalama Yanıt</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">8/8</div>
                <div className="text-gray-400">Aktif Servis</div>
              </div>
            </div>
          </div>

          {/* Subscribe to Updates */}
          <div className="mt-12 text-center">
            <div className="ai-card max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Durum Güncellemelerini Takip Edin
              </h3>
              <p className="text-gray-400 mb-6">
                Sistem durumu değişikliklerinden haberdar olmak için e-posta listemize abone olun.
              </p>
              <div className="flex space-x-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button className="btn-primary px-6 py-3">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 