'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  Users,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Pin,
  Lock,
  TrendingUp,
  Clock,
  User,
  X,
  ChevronRight,
  ArrowRight,
  Trophy,
  Award
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserLevel {
  name: string;
  title: string;
  color: string;
  icon: string;
  minPosts: number;
  minPoints: number;
  benefits: string[];
}

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'achievement' | 'contribution' | 'special';
  earnedAt?: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    image?: string;
    level: 'rookie' | 'member' | 'expert' | 'moderator' | 'admin';
    joinDate: string;
    postCount: number;
    points: number;
    badges: UserBadge[];
  };
  category: string;
  views: number;
  likes: number;
  commentCount: number;
  isPinned: boolean;
  isLocked: boolean;
  isTrending: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ForumPage() {
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
    categoryId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forumStats, setForumStats] = useState({
    totalPosts: 0,
    activeUsers: 0,
    thisWeekPosts: 0
  });

  // User level system
  const userLevels: UserLevel[] = [
    {
      name: 'rookie',
      title: 'Çaylak',
      color: 'text-gray-400',
      icon: '🌱',
      minPosts: 0,
      minPoints: 0,
      benefits: ['Temel forum erişimi']
    },
    {
      name: 'member',
      title: 'Üye',
      color: 'text-blue-400',
      icon: '👤',
      minPosts: 5,
      minPoints: 50,
      benefits: ['Resim yükleme', 'Profil düzenleme']
    },
    {
      name: 'expert',
      title: 'Uzman',
      color: 'text-purple-400',
      icon: '⭐',
      minPosts: 25,
      minPoints: 200,
      benefits: ['Mentorluk yapabilme', 'Özel rozetler']
    },
    {
      name: 'moderator',
      title: 'Moderatör',
      color: 'text-orange-400',
      icon: '🛡️',
      minPosts: 100,
      minPoints: 500,
      benefits: ['İçerik moderasyonu', 'Özel yetkiler']
    },
    {
      name: 'admin',
      title: 'Yönetici',
      color: 'text-red-400',
      icon: '👑',
      minPosts: 500,
      minPoints: 1000,
      benefits: ['Tam sistem kontrolü']
    }
  ];

  // Badge system
  const availableBadges: UserBadge[] = [
    {
      id: 'first-post',
      name: 'İlk Post',
      description: 'İlk forum postunu yayınladı',
      icon: '🎯',
      color: 'text-green-400',
      type: 'achievement'
    },
    {
      id: 'helpful',
      name: 'Yardımsever',
      description: '10+ yardımcı yorum yaptı',
      icon: '🤝',
      color: 'text-blue-400',
      type: 'contribution'
    },
    {
      id: 'expert-advice',
      name: 'Uzman Tavsiyesi',
      description: '50+ beğenilen yorum',
      icon: '💡',
      color: 'text-purple-400',
      type: 'contribution'
    },
    {
      id: 'trending',
      name: 'Trending',
      description: 'Trending post oluşturdu',
      icon: '🔥',
      color: 'text-orange-400',
      type: 'achievement'
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Mentorluk yapmaya başladı',
      icon: '🎓',
      color: 'text-indigo-400',
      type: 'special'
    }
  ];

  // Categories will be loaded from API - no dummy data
  const defaultCategories: ForumCategory[] = [];

  useEffect(() => {
    loadForumData();
  }, []);

  const loadForumData = async () => {
    try {
      setIsLoading(true);
      
      // Kategorileri yükle
      const categoriesResponse = await fetch('/api/forum/categories');
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          setCategories(categoriesData.categories);
        }
      } else {
        // Fallback: default kategoriler
        setCategories(defaultCategories);
      }

      // Son postları yükle
      const postsResponse = await fetch('/api/forum/posts?limit=10');
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        if (postsData.success) {
          setRecentPosts(postsData.posts);
        }
      }

      // Forum istatistiklerini yükle
      const statsResponse = await fetch('/api/forum/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setForumStats(statsData.stats);
        }
      }
      
    } catch (error) {
      console.error('Error loading forum data:', error);
      // Fallback: default veriler
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = recentPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
                           (typeof post.category === 'string' ? post.category === selectedCategory : post.category?.id === selectedCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log('Category selected:', categoryId);
    
    // Son postlar kısmına scroll et
    const postsSection = document.getElementById('posts-section');
    if (postsSection) {
      postsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleCreatePost = async () => {
    if (!newPostData.title.trim() || !newPostData.content.trim() || !newPostData.categoryId || !user) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPostData.title,
          content: newPostData.content,
          categoryId: newPostData.categoryId,
          authorId: user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNewPostData({ title: '', content: '', categoryId: '' });
          setShowNewPostModal(false);
          await loadForumData(); // Verileri yenile
          console.log('✅ Post başarıyla oluşturuldu:', data.post);
        }
      }
    } catch (error) {
      console.error('❌ Post oluşturma hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  // Kullanıcı seviyesi bilgilerini getir
  const getUserLevelInfo = (level: string) => {
    const levels = {
      rookie: { name: 'Çaylak', color: 'text-gray-400', bgColor: 'bg-gray-500/20', icon: '🌱' },
      member: { name: 'Üye', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: '👤' },
      expert: { name: 'Uzman', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: '⭐' },
      moderator: { name: 'Moderatör', color: 'text-purple-400', bgColor: 'bg-purple-500/20', icon: '🛡️' },
      admin: { name: 'Admin', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: '👑' }
    };
    return levels[level as keyof typeof levels] || levels.member;
  };

  // Avatar oluştur
  const generateAvatar = (name: string, level: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const levelInfo = getUserLevelInfo(level);
    
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${levelInfo.bgColor} ${levelInfo.color} border-2 border-white/20`}>
        {initials}
      </div>
    );
  };

  const getUserLevel = (postCount: number, points: number): UserLevel => {
    for (let i = userLevels.length - 1; i >= 0; i--) {
      if (postCount >= userLevels[i].minPosts && points >= userLevels[i].minPoints) {
        return userLevels[i];
      }
    }
    return userLevels[0]; // Default to rookie
  };

  const getUserBadges = (userId: string, postCount: number, points: number): UserBadge[] => {
    const badges: UserBadge[] = [];
    
    // First post badge
    if (postCount >= 1) {
      badges.push({
        ...availableBadges.find(b => b.id === 'first-post')!,
        earnedAt: new Date().toISOString()
      });
    }
    
    // Helpful badge (simplified logic)
    if (postCount >= 10) {
      badges.push({
        ...availableBadges.find(b => b.id === 'helpful')!,
        earnedAt: new Date().toISOString()
      });
    }
    
    // Expert advice badge
    if (points >= 200) {
      badges.push({
        ...availableBadges.find(b => b.id === 'expert-advice')!,
        earnedAt: new Date().toISOString()
      });
    }
    
    return badges;
  };

  const renderUserBadges = (badges: UserBadge[]) => {
    return (
      <div className="flex space-x-1">
        {badges.slice(0, 3).map((badge, index) => (
          <div
            key={badge.id}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${badge.color}`}
            title={`${badge.name}: ${badge.description}`}
          >
            {badge.icon}
          </div>
        ))}
        {badges.length > 3 && (
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
            +{badges.length - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen ai-gradient-bg">
      <Header />
      
      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl mb-6 ai-glow">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Topluluk Forum
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Kariyer yolculuğunda aynı hedefleri paylaşan arkadaşlarınızla buluşun. 
              Sorularınızı sorun, deneyimlerinizi paylaşın ve birlikte büyüyün.
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold text-cyan-400">{forumStats.totalPosts}</div>
                <div className="text-sm text-gray-400">Toplam Post</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div>
                <div className="text-3xl font-bold text-purple-400">{forumStats.activeUsers}</div>
                <div className="text-sm text-gray-400">Aktif Üye</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div>
                <div className="text-3xl font-bold text-pink-400">{forumStats.thisWeekPosts}</div>
                <div className="text-sm text-gray-400">Bu Hafta</div>
              </div>
            </div>
          </motion.div>

          {/* User Level System Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-black/20 border border-gray-600 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Seviye Sistemi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {userLevels.map((level, index) => (
                  <div key={level.name} className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-600">
                    <div className="text-2xl mb-2">{level.icon}</div>
                    <div className={`font-semibold ${level.color} mb-1`}>{level.title}</div>
                    <div className="text-xs text-gray-400 mb-2">
                      {level.minPosts} post • {level.minPoints} puan
                    </div>
                    <div className="text-xs text-gray-500">
                      {level.benefits[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Badge System Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <div className="bg-black/20 border border-gray-600 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-400" />
                Rozet Sistemi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {availableBadges.map((badge) => (
                  <div key={badge.id} className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-600">
                    <div className={`text-2xl mb-2 ${badge.color}`}>{badge.icon}</div>
                    <div className={`font-semibold ${badge.color} mb-1`}>{badge.name}</div>
                    <div className="text-xs text-gray-400">
                      {badge.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Search and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-6 mb-12"
          >
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Forum postlarında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black/20 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* New Post Button */}
            {isAuthenticated && (
              <motion.button
                onClick={() => setShowNewPostModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Yeni Post
              </motion.button>
            )}
          </motion.div>

          {/* Categories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mb-4 ai-glow">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
                Forum Kategorileri
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                İlgilendiğiniz konulara göre kategori seçin ve tartışmalara katılın
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mt-4"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tümü Kartı */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`ai-card rounded-3xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group ${
                  selectedCategory === 'all' 
                    ? 'ring-2 ring-cyan-500 bg-gradient-to-br from-cyan-500/10 to-blue-600/10' 
                    : ''
                }`}
                onClick={() => handleCategoryClick('all')}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Tüm Kategoriler
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Tüm forum kategorilerini görüntüle
                </p>
                <div className="mt-4 flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="text-sm font-medium ml-1">Tümünü Gör</span>
                </div>
              </motion.div>

              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className={`ai-card rounded-3xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group ${
                    selectedCategory === category.id 
                      ? 'ring-2 ring-cyan-500 bg-gradient-to-br from-cyan-500/10 to-blue-600/10' 
                      : ''
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="text-sm font-medium ml-1">Postları Gör</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Posts */}
          <motion.div
            id="posts-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-4 ai-glow">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">
                {selectedCategory === 'all' ? 'Son Postlar' : `${categories.find(c => c.id === selectedCategory)?.name || 'Kategori'} Postları`}
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
                {selectedCategory === 'all' 
                  ? 'Topluluktan en son paylaşımları keşfedin ve tartışmalara katılın'
                  : `${categories.find(c => c.id === selectedCategory)?.name || 'Bu kategori'} hakkındaki tüm postları görüntüleyin`
                }
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-8"></div>
              
              {/* Filter + Back Button */}
              <div className="flex justify-center items-center space-x-4">
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>Tümüne Dön</span>
                  </button>
                )}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-3 bg-black/20 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                >
                  <option value="all">🌟 Tüm Kategoriler</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="ai-card rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {generateAvatar(post.author.name, post.author.level || 'member')}
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isPinned && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium">
                            <Pin className="w-3 h-3" />
                            <span>Sabitlenmiş</span>
                          </div>
                        )}
                        {post.isLocked && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                            <Lock className="w-3 h-3" />
                            <span>Kilitli</span>
                          </div>
                        )}
                        {post.isTrending && (
                          <div className="flex items-center space-x-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium">
                            <TrendingUp className="w-3 h-3" />
                            <span>Trending</span>
                          </div>
                        )}
                        <span className="px-2 py-1 bg-gray-600/30 text-gray-300 rounded-lg text-xs font-medium">
                          {categories.find(c => c.id === (typeof post.category === 'string' ? post.category : post.category?.id))?.icon} {categories.find(c => c.id === (typeof post.category === 'string' ? post.category : post.category?.id))?.name}
                        </span>
                      </div>

                      <h3 
                        className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer"
                        onClick={() => {
                          // Post detay sayfasına yönlendir
                          window.location.href = `/forum/post/${post.id}`;
                        }}
                      >
                        {post.title}
                      </h3>

                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      {/* Post Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium border border-purple-500/30"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-600/30 text-gray-400 rounded-lg text-xs font-medium">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">{post.author.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserLevelInfo(post.author.level || 'member').bgColor} ${getUserLevelInfo(post.author.level || 'member').color}`}>
                              {getUserLevelInfo(post.author.level || 'member').icon} {getUserLevelInfo(post.author.level || 'member').name}
                            </span>
                            {/* User Badges */}
                            {post.author.badges && post.author.badges.length > 0 && (
                              <div className="flex space-x-1">
                                {post.author.badges.slice(0, 2).map((badge) => (
                                  <div
                                    key={badge.id}
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${badge.color}`}
                                    title={`${badge.name}: ${badge.description}`}
                                  >
                                    {badge.icon}
                                  </div>
                                ))}
                                {post.author.badges.length > 2 && (
                                  <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                    +{post.author.badges.length - 2}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{post.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Henüz Post Yok</h3>
                <p className="text-gray-400 mb-6">Bu kategoride henüz post bulunmuyor. İlk postu siz atın!</p>
                {isAuthenticated && (
                  <button 
                    onClick={() => setShowNewPostModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors"
                  >
                    İlk Postu At
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* New Post Modal */}
          <AnimatePresence>
            {showNewPostModal && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => {
                  setShowNewPostModal(false);
                  setNewPostData({ title: '', content: '', categoryId: '' });
                }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Yeni Post Oluştur</h3>
                    <button
                      onClick={() => {
                        setShowNewPostModal(false);
                        setNewPostData({ title: '', content: '', categoryId: '' });
                      }}
                      className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Kategori Seçin
                      </label>
                      <select 
                        value={newPostData.categoryId}
                        onChange={(e) => setNewPostData({...newPostData, categoryId: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      >
                        <option value="">Kategori seçin...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Post Başlığı
                      </label>
                      <input
                        type="text"
                        value={newPostData.title}
                        onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                        placeholder="Başlık yazın..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        İçerik
                      </label>
                      <textarea
                        value={newPostData.content}
                        onChange={(e) => setNewPostData({...newPostData, content: e.target.value})}
                        placeholder="Postunuzun içeriğini yazın..."
                        rows={8}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          setShowNewPostModal(false);
                          setNewPostData({ title: '', content: '', categoryId: '' });
                        }}
                        className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                      >
                        İptal
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPostData.title.trim() || !newPostData.content.trim() || !newPostData.categoryId || isSubmitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Gönderiliyor...</span>
                          </>
                        ) : (
                          <span>Gönder</span>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Join CTA */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-16"
            >
              <div className="ai-card p-8 rounded-3xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-6 ai-glow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Topluluğa Katılın</h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Forum'da post oluşturmak ve yorumlar yapmak için önce platforma üye olmanız gerekiyor.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Üye Ol
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </Link>
                  <Link href="/auth/signin">
                    <motion.button
                      className="px-8 py-4 bg-black/20 border border-gray-600 text-white rounded-2xl font-semibold hover:bg-gray-700 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Giriş Yap
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}