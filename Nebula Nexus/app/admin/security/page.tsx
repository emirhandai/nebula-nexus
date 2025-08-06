'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Lock, 
  Activity,
  Users,
  Database,
  Globe,
  Settings
} from 'lucide-react';

interface SecurityMetric {
  id: string;
  title: string;
  value: number;
  maxValue: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
  description: string;
}

interface SecurityLog {
  id: string;
  action: string;
  severity: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [recentLogs, setRecentLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      const mockMetrics: SecurityMetric[] = [
        {
          id: 'auth',
          title: 'Authentication Security',
          value: 9,
          maxValue: 10,
          status: 'good',
          icon: <Lock className="w-6 h-6" />,
          description: 'bcrypt hashing, session management'
        },
        {
          id: 'validation',
          title: 'Input Validation',
          value: 9,
          maxValue: 10,
          status: 'good',
          icon: <Shield className="w-6 h-6" />,
          description: 'Zod schemas, XSS protection'
        },
        {
          id: 'api',
          title: 'API Security',
          value: 8,
          maxValue: 10,
          status: 'good',
          icon: <Globe className="w-6 h-6" />,
          description: 'Rate limiting, CORS, headers'
        },
        {
          id: 'database',
          title: 'Database Security',
          value: 8,
          maxValue: 10,
          status: 'good',
          icon: <Database className="w-6 h-6" />,
          description: 'Prisma validation, sanitization'
        },
        {
          id: 'monitoring',
          title: 'Security Monitoring',
          value: 8,
          maxValue: 10,
          status: 'good',
          icon: <Activity className="w-6 h-6" />,
          description: 'Logging, IP reputation'
        },
        {
          id: 'environment',
          title: 'Environment Security',
          value: 9,
          maxValue: 10,
          status: 'good',
          icon: <Settings className="w-6 h-6" />,
          description: 'Secret management, HTTPS'
        }
      ];

      const mockLogs: SecurityLog[] = [
        {
          id: '1',
          action: 'LOGIN_SUCCESS',
          severity: 'info',
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: '2',
          action: 'RATE_LIMIT_EXCEEDED',
          severity: 'warning',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          ipAddress: '10.0.0.50'
        },
        {
          id: '3',
          action: 'SUSPICIOUS_ACTIVITY',
          severity: 'warning',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          ipAddress: '203.0.113.0'
        }
      ];

      setMetrics(mockMetrics);
      setRecentLogs(mockLogs);
    } catch (error) {
      console.error('Security data load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const overallScore = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-purple-400" />
            Security Dashboard
          </h1>
          <p className="text-gray-300">Nebula Nexus güvenlik durumu ve monitoring</p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Genel Güvenlik Skoru</h2>
                <p className="text-gray-300">Sistem güvenlik durumu: {overallScore}/10</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-purple-400">{overallScore}/10</div>
                <div className="text-sm text-gray-400">Güvenlik Seviyesi</div>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(overallScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Security Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-purple-400">
                    {metric.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{metric.title}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {metric.status.toUpperCase()}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Skor</span>
                  <span className="text-white font-medium">{metric.value}/{metric.maxValue}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.status === 'good' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(metric.value / metric.maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-400">{metric.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Security Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-400" />
            Son Güvenlik Logları
          </h2>
          
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                    {log.severity.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{log.action}</div>
                    <div className="text-sm text-gray-400">
                      {log.ipAddress && `IP: ${log.ipAddress}`}
                      {log.ipAddress && log.userAgent && ' • '}
                      {log.userAgent && `${log.userAgent.substring(0, 30)}...`}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(log.timestamp).toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 