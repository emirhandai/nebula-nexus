'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Target,
  BookOpen,
  MessageSquare,
  Award,
  Settings,
  Shield,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Star,
  Heart,
  Brain,
  GraduationCap,
  Home,
  Briefcase,
  Bot,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalTests: number;
  totalChatSessions: number;
  totalCourses: number;
  totalForumPosts: number;
  totalForumComments: number;
  thisWeekPosts: number;
  systemUptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
}

interface UserActivity {
  id: string;
  name: string;
  action: string;
  timestamp: string;
  field?: string;
  score?: number;
}

interface FieldStats {
  field: string;
  users: number;
  percentage: number;
  growth: number;
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalTests: 0,
    totalChatSessions: 0,
    totalCourses: 0,
    totalForumPosts: 0,
    totalForumComments: 0,
    thisWeekPosts: 0,
    systemUptime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkUsage: 0
  });
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [fieldStats, setFieldStats] = useState<FieldStats[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [showSystemMetrics, setShowSystemMetrics] = useState(true);

  // Load admin data on component mount
  useEffect(() => {
    loadAdminData();
  }, []);

  // Real-time data updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && isAdmin) {
        loadAdminData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, isAdmin]);

  // Reload field statistics when time range changes
  useEffect(() => {
    const loadFieldStats = async () => {
      try {
        const response = await fetch(`/api/admin/field-stats?range=${selectedTimeRange}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFieldStats(data.fieldStats || []);
          }
        }
      } catch (error) {
        console.error('Field stats loading error:', error);
      }
    };

    loadFieldStats();
  }, [selectedTimeRange]);

  const loadFieldStats = async () => {
    try {
      const response = await fetch(`/api/admin/field-stats?range=${selectedTimeRange}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFieldStats(data.fieldStats || []);
        }
      }
    } catch (error) {
      console.error('Field stats loading error:', error);
    }
  };

  const loadAdminData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch real data from APIs
      const [statsResponse, activityResponse, forumStatsResponse, systemMetricsResponse, fieldStatsResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/recent-activity'),
        fetch('/api/forum/stats'),
        fetch('/api/admin/system-metrics'),
        fetch(`/api/admin/field-stats?range=${selectedTimeRange}`)
      ]);

      // System stats
      let stats: SystemStats = {
        totalUsers: 0,
        activeUsers: 0,
        newUsersToday: 0,
        totalTests: 0,
        totalChatSessions: 0,
        totalCourses: 0,
        totalForumPosts: 0,
        totalForumComments: 0,
        thisWeekPosts: 0,
        systemUptime: 99.8,
        cpuUsage: 45,
        memoryUsage: 67,
        diskUsage: 23,
        networkUsage: 12
      };

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          stats = {
            ...stats,
            totalUsers: statsData.totalUsers || 0,
            activeUsers: statsData.activeUsers || 0,
            newUsersToday: statsData.recentRegistrations || 0,
            totalTests: statsData.usersWithTests || 0,
            totalChatSessions: statsData.totalChatSessions || 0,
            totalCourses: statsData.completedCourses || 0
          };
        }
      }

      // Forum stats for active users
      if (forumStatsResponse.ok) {
        const forumData = await forumStatsResponse.json();
        if (forumData.success) {
          stats.activeUsers = forumData.stats.activeUsers || stats.activeUsers;
          stats.totalForumPosts = forumData.stats.totalPosts || 0;
          stats.thisWeekPosts = forumData.stats.thisWeekPosts || 0;
        }
      }

      // System metrics
      if (systemMetricsResponse.ok) {
        const metricsData = await systemMetricsResponse.json();
        if (metricsData.success) {
          const metrics = metricsData.metrics;
          stats = {
            ...stats,
            systemUptime: metrics.system.uptime || 99.8,
            cpuUsage: metrics.system.cpuUsage || 45,
            memoryUsage: metrics.system.memoryUsage || 67,
            diskUsage: metrics.system.diskUsage || 23,
            networkUsage: metrics.system.networkUsage || 12,
            totalForumComments: metrics.activity.forumComments24h || 0
          };
        }
      }

      setSystemStats(stats);

      // Recent activity
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        if (activityData.success) {
          setRecentActivity(activityData.activities || []);
        }
      }

      // Field statistics - Real data from new API
      if (fieldStatsResponse.ok) {
        const fieldData = await fieldStatsResponse.json();
        if (fieldData.success) {
          setFieldStats(fieldData.fieldStats || []);
        }
      }

    } catch (error) {
      console.error('Admin data loading error:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getStatusColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return 'text-red-400';
    if (value >= threshold * 0.7) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    );
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
          <p className="text-purple-200 text-lg">Admin paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
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
                Admin Panel
              </h1>
              <p className="text-gray-400">Sistemin genel durumu ve performans metrikleri</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSystemMetrics(!showSystemMetrics)}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/20 transition-all duration-300"
              >
                {showSystemMetrics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>Sistem Metrikleri</span>
              </button>
              <button
                onClick={loadAdminData}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-4 py-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Yenile</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
        >
          {[
            { 
              icon: Users, 
              title: 'Toplam Kullanıcı', 
              value: systemStats.totalUsers.toLocaleString(), 
              change: `+${systemStats.newUsersToday} bugün`,
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'from-blue-500/20 to-cyan-500/20'
            },
            { 
              icon: Activity, 
              title: 'Aktif Kullanıcı', 
              value: systemStats.activeUsers, 
              change: 'Şu anda aktif',
              color: 'from-green-500 to-emerald-500',
              bgColor: 'from-green-500/20 to-emerald-500/20'
            },
            { 
              icon: Brain, 
              title: 'Toplam Test', 
              value: systemStats.totalTests.toLocaleString(), 
              change: 'Tamamlanan test',
              color: 'from-purple-500 to-pink-500',
              bgColor: 'from-purple-500/20 to-pink-500/20'
            },
            { 
              icon: MessageSquare, 
              title: 'Chat Oturumu', 
              value: systemStats.totalChatSessions.toLocaleString(), 
              change: 'AI konuşması',
              color: 'from-indigo-500 to-purple-500',
              bgColor: 'from-indigo-500/20 to-purple-500/20'
            },
            { 
              icon: BookOpen, 
              title: 'Forum Post', 
              value: systemStats.totalForumPosts.toLocaleString(), 
              change: `+${systemStats.thisWeekPosts} bu hafta`,
              color: 'from-orange-500 to-red-500',
              bgColor: 'from-orange-500/20 to-red-500/20'
            },
            { 
              icon: Award, 
              title: 'Forum Yorum', 
              value: systemStats.totalForumComments.toLocaleString(), 
              change: 'Toplam yorum',
              color: 'from-teal-500 to-cyan-500',
              bgColor: 'from-teal-500/20 to-cyan-500/20'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`bg-gradient-to-r ${stat.bgColor} backdrop-blur-sm border border-white/20 rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-purple-200">{stat.title}</div>
                </div>
              </div>
              <div className="text-xs text-purple-300">{stat.change}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* System Metrics */}
        {showSystemMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Sistem Performansı</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { 
                    icon: Cpu, 
                    title: 'CPU Kullanımı', 
                    value: systemStats.cpuUsage, 
                    unit: '%',
                    color: getStatusColor(systemStats.cpuUsage)
                  },
                  { 
                    icon: Database, 
                    title: 'RAM Kullanımı', 
                    value: systemStats.memoryUsage, 
                    unit: '%',
                    color: getStatusColor(systemStats.memoryUsage)
                  },
                  { 
                    icon: HardDrive, 
                    title: 'Disk Kullanımı', 
                    value: systemStats.diskUsage, 
                    unit: '%',
                    color: getStatusColor(systemStats.diskUsage, 90)
                  },
                  { 
                    icon: Wifi, 
                    title: 'Network', 
                    value: systemStats.networkUsage, 
                    unit: 'MB/s',
                    color: 'text-blue-400'
                  },
                  { 
                    icon: Clock, 
                    title: 'Uptime', 
                    value: systemStats.systemUptime, 
                    unit: '%',
                    color: 'text-green-400'
                  }
                ].map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}{metric.unit}
                    </div>
                    <div className="text-sm text-purple-200">{metric.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Field Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Alan İstatistikleri</h3>
              </div>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
              >
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="90d">Son 90 Gün</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Field Chart */}
              <div className="space-y-4">
                {fieldStats.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <div>
                        <div className="text-white font-medium">{field.field}</div>
                        <div className="text-sm text-purple-200">{field.users} kullanıcı</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-white font-semibold">{field.percentage}%</div>
                        <div className="flex items-center text-sm">
                          {getGrowthIcon(field.growth)}
                          <span className={field.growth > 0 ? 'text-green-400' : 'text-red-400'}>
                            {Math.abs(field.growth)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie Chart Placeholder */}
              <div className="flex items-center justify-center h-64 bg-white/5 rounded-xl">
                <div className="text-center">
                  <PieChart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200">Alan Dağılımı Grafiği</p>
                  <p className="text-sm text-purple-300">Görselleştirme yakında eklenecek</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Son Aktiviteler</h3>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.name}</div>
                    <div className="text-sm text-purple-200">{activity.action}</div>
                    {activity.field && (
                      <div className="text-xs text-blue-300">Alan: {activity.field}</div>
                    )}
                    {activity.score && (
                      <div className="text-xs text-green-300">Puan: {activity.score}</div>
                    )}
                  </div>
                  <div className="text-xs text-purple-300">{activity.timestamp}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Hızlı İşlemler</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  icon: Users, 
                  title: 'Kullanıcı Yönetimi', 
                  description: 'Kullanıcıları görüntüle ve yönet',
                  href: '/admin/users',
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  icon: MessageSquare, 
                  title: 'Forum Yönetimi', 
                  description: 'Forum post ve yorumları yönet',
                  href: '/admin/forum',
                  color: 'from-orange-500 to-red-500'
                },
                { 
                  icon: BarChart3, 
                  title: 'Analitikler', 
                  description: 'Detaylı raporları görüntüle',
                  href: '/admin/analytics',
                  color: 'from-purple-500 to-pink-500'
                },
                { 
                  icon: Shield, 
                  title: 'Güvenlik', 
                  description: 'Sistem güvenlik ayarları',
                  href: '/admin/security',
                  color: 'from-red-500 to-pink-500'
                },
                { 
                  icon: Brain, 
                  title: 'Test Yönetimi', 
                  description: 'Test sonuçları ve analizler',
                  href: '/admin/tests',
                  color: 'from-yellow-500 to-orange-500'
                },
                { 
                  icon: Briefcase, 
                  title: 'Kariyer Verileri', 
                  description: 'Kariyer önerileri ve veriler',
                  href: '/admin/careers',
                  color: 'from-indigo-500 to-purple-500'
                },
                { 
                  icon: Bot, 
                  title: 'AI Sistem', 
                  description: 'AI modelleri ve sistem durumu',
                  href: '/admin/ai',
                  color: 'from-teal-500 to-cyan-500'
                },
                { 
                  icon: Cpu, 
                  title: 'Performans', 
                  description: 'Sistem performans metrikleri',
                  href: '/admin/performance',
                  color: 'from-green-500 to-emerald-500'
                },
                { 
                  icon: Mail, 
                  title: 'İletişim', 
                  description: 'Mesajlar ve bildirimler',
                  href: '/admin/communication',
                  color: 'from-pink-500 to-rose-500'
                },
                { 
                  icon: Settings, 
                  title: 'Ayarlar', 
                  description: 'Sistem ayarları ve konfigürasyon',
                  href: '/admin/settings',
                  color: 'from-gray-500 to-gray-600'
                }
              ].map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 text-left"
                  onClick={() => window.location.href = action.href}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{action.title}</div>
                    <div className="text-sm text-purple-200">{action.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 