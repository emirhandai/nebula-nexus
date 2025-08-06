'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Users, MessageSquare, Award, TrendingUp, Star } from 'lucide-react';

export default function Community() {
  const [mounted, setMounted] = useState(false);
  const [communityStats, setCommunityStats] = useState([
    { label: "Aktif Üyeler", value: "0", icon: Users, color: "from-blue-500 to-purple-600" },
    { label: "Toplam Post", value: "0", icon: MessageSquare, color: "from-green-500 to-blue-600" },
    { label: "Rozet Kazananlar", value: "0", icon: Award, color: "from-purple-500 to-pink-600" },
    { label: "Günlük Aktiflik", value: "0%", icon: TrendingUp, color: "from-orange-500 to-red-600" }
  ]);
  const [topContributors, setTopContributors] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      
      // Fetch forum stats
      const statsResponse = await fetch('/api/forum/stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setCommunityStats([
          { label: "Aktif Üyeler", value: statsData.stats.activeUsers.toString(), icon: Users, color: "from-blue-500 to-purple-600" },
          { label: "Toplam Post", value: statsData.stats.totalPosts.toString(), icon: MessageSquare, color: "from-green-500 to-blue-600" },
          { label: "Bu Hafta Post", value: statsData.stats.thisWeekPosts.toString(), icon: Award, color: "from-purple-500 to-pink-600" },
          { label: "Günlük Aktiflik", value: "85%", icon: TrendingUp, color: "from-orange-500 to-red-600" }
        ]);
      }

      // Fetch recent posts for top contributors
      const postsResponse = await fetch('/api/forum/posts?limit=10');
      const postsData = await postsResponse.json();
      
      if (postsData.success) {
        setRecentPosts(postsData.posts);
        
        // Calculate top contributors from posts
        const contributors = postsData.posts.reduce((acc, post) => {
          const existing = acc.find(c => c.authorId === post.author.id);
          if (existing) {
            existing.posts++;
            existing.likes += post.likes;
          } else {
            acc.push({
              authorId: post.author.id,
              name: post.author.name,
              posts: 1,
              likes: post.likes,
              level: "Aktif",
              avatar: post.author.name?.substring(0, 2).toUpperCase() || "AN"
            });
          }
          return acc;
        }, []);

        // Sort by posts and likes, take top 5
        const topContributors = contributors
          .sort((a, b) => (b.posts + b.likes) - (a.posts + a.likes))
          .slice(0, 5);
        
        setTopContributors(topContributors);
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-6"></div>
                <div className="h-12 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }



  const communityGuidelines = [
    "Saygılı ve yapıcı iletişim kurun",
    "Spam ve reklam içerikli paylaşımlardan kaçının",
    "Telif hakkı kurallarına uyun",
    "Kişisel bilgileri paylaşmayın",
    "Topluluk kurallarına uyun"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nebula Nexus Topluluğu
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Yazılım kariyer yolculuğunuzda size eşlik eden binlerce kişiyle tanışın, deneyimlerinizi paylaşın ve birlikte büyüyün.
            </p>
          </div>

                     {/* Community Stats */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
             {loading ? (
               // Loading skeleton
               Array.from({ length: 4 }).map((_, index) => (
                 <div key={index} className="ai-card text-center">
                   <div className="w-12 h-12 bg-gray-700 rounded-xl mx-auto mb-4 animate-pulse"></div>
                   <div className="h-8 bg-gray-700 rounded mb-2 animate-pulse"></div>
                   <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                 </div>
               ))
             ) : (
               communityStats.map((stat, index) => (
                 <div key={index} className="ai-card text-center">
                   <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                     <stat.icon className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                   <div className="text-gray-400">{stat.label}</div>
                 </div>
               ))
             )}
           </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Community Features */}
            <div className="lg:col-span-2 space-y-8">
              {/* Forum Link */}
              <div className="ai-card">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-400 mr-3" />
                  <h2 className="text-2xl font-semibold text-white">Forum</h2>
                </div>
                <p className="text-gray-300 mb-6">
                  Kariyer sorularınızı sorun, deneyimlerinizi paylaşın ve diğer üyelerle etkileşim kurun.
                </p>
                <a href="/forum" className="btn-primary">
                  Foruma Git
                </a>
              </div>

              

                             {/* Recent Posts */}
               <div className="ai-card">
                 <div className="flex items-center mb-6">
                   <MessageSquare className="w-6 h-6 text-blue-400 mr-3" />
                   <h2 className="text-2xl font-semibold text-white">Son Paylaşımlar</h2>
                 </div>
                 <div className="space-y-4">
                   {loading ? (
                     // Loading skeleton for posts
                     Array.from({ length: 3 }).map((_, index) => (
                       <div key={index} className="border border-gray-700 rounded-lg p-4">
                         <div className="h-4 bg-gray-700 rounded mb-2 animate-pulse"></div>
                         <div className="h-3 bg-gray-700 rounded mb-2 animate-pulse"></div>
                         <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                       </div>
                     ))
                   ) : recentPosts.length > 0 ? (
                     recentPosts.slice(0, 3).map((post, index) => (
                       <div key={index} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                         <div className="flex items-start justify-between mb-2">
                           <h3 className="text-lg font-semibold text-white line-clamp-2">{post.title}</h3>
                           <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded ml-2 flex-shrink-0">
                             {post.category?.name || 'Genel'}
                           </span>
                         </div>
                         <div className="flex items-center text-gray-400 text-sm mb-2">
                           <span>{post.author.name}</span>
                           <span className="mx-2">•</span>
                           <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                         </div>
                         <div className="flex items-center justify-between text-sm text-gray-400">
                           <span>{post.commentCount} yorum</span>
                           <span>{post.likes} beğeni</span>
                         </div>
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-8">
                       <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                       <p className="text-gray-400">Henüz forum paylaşımı bulunmuyor</p>
                       <a href="/forum" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                         İlk paylaşımı sen yap
                       </a>
                     </div>
                   )}
                 </div>
                 {recentPosts.length > 0 && (
                   <div className="mt-6">
                     <a href="/forum" className="btn-secondary">
                       Tüm Paylaşımları Gör
                     </a>
                   </div>
                 )}
               </div>

               {/* Community Guidelines */}
               <div className="ai-card">
                 <h2 className="text-2xl font-semibold text-white mb-6">Topluluk Kuralları</h2>
                 <div className="space-y-3">
                   {communityGuidelines.map((guideline, index) => (
                     <div key={index} className="flex items-start">
                       <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                       <span className="text-gray-300">{guideline}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
                             {/* Top Contributors */}
               <div className="ai-card">
                 <div className="flex items-center mb-6">
                   <Award className="w-6 h-6 text-yellow-400 mr-3" />
                   <h2 className="text-2xl font-semibold text-white">En Aktif Üyeler</h2>
                 </div>
                 <div className="space-y-4">
                   {loading ? (
                     // Loading skeleton for contributors
                     Array.from({ length: 5 }).map((_, index) => (
                       <div key={index} className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
                         <div className="flex-1">
                           <div className="h-4 bg-gray-700 rounded mb-2 animate-pulse"></div>
                           <div className="h-3 bg-gray-700 rounded animate-pulse"></div>
                         </div>
                       </div>
                     ))
                   ) : topContributors.length > 0 ? (
                     topContributors.map((contributor, index) => (
                       <div key={index} className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                           {contributor.avatar}
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center space-x-2">
                             <span className="text-white font-medium">{contributor.name}</span>
                             <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                               {contributor.level}
                             </span>
                           </div>
                           <div className="text-sm text-gray-400">
                             {contributor.posts} post • {contributor.likes} beğeni
                           </div>
                         </div>
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-8">
                       <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                       <p className="text-gray-400">Henüz forum aktivitesi bulunmuyor</p>
                       <a href="/forum" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                         İlk postu sen oluştur
                       </a>
                     </div>
                   )}
                 </div>
               </div>

              {/* Quick Actions */}
              <div className="ai-card">
                <h2 className="text-2xl font-semibold text-white mb-6">Hızlı Erişim</h2>
                <div className="space-y-3">
                  <a href="/forum" className="block w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="text-white">Yeni Post Oluştur</span>
                    </div>
                  </a>
                  <a href="/projects" className="block w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-white">Proje Ara</span>
                    </div>
                  </a>
                  <a href="/chat" className="block w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-3" />
                      <span className="text-white">AI ile Sohbet Et</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Community Badges */}
              <div className="ai-card">
                <h2 className="text-2xl font-semibold text-white mb-6">Rozetler</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-white">İlk Post</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-white">Aktif Üye</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-white">Ekip Lideri</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-white">Uzman</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Join Community CTA */}
          <div className="mt-16 text-center">
            <div className="ai-card max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                Topluluğumuza Katılın
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Yazılım kariyer yolculuğunuzda size eşlik eden binlerce kişiyle tanışın. 
                Deneyimlerinizi paylaşın, sorularınızı sorun ve birlikte büyüyün.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/forum" className="btn-primary px-8 py-3">
                  Foruma Katıl
                </a>
                <a href="/projects" className="btn-secondary px-8 py-3">
                  Proje Bul
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 