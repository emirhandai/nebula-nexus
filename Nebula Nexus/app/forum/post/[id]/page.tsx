'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageSquare, 
  Heart, 
  Eye, 
  Calendar,
  User,
  Reply,
  Pin,
  Lock,
  Send
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  authorId: string;
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
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  views: number;
  likes: number;
  isPinned: boolean;
  isLocked: boolean;
  isTrending: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  _count: {
    comments: number;
    postLikes: number;
  };
}

interface ForumComment {
  id: string;
  content: string;
  authorId: string;
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
  likes: number;
  createdAt: string;
  replies?: ForumComment[];
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLikedPost, setUserLikedPost] = useState(false);
  const [userLikedComments, setUserLikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (params.id) {
      loadPostData();
    }
  }, [params.id]);

  const loadPostData = async () => {
    try {
      setIsLoading(true);
      
      // Post bilgilerini yükle
      const postResponse = await fetch(`/api/forum/posts/${params.id}`);
      if (postResponse.ok) {
        const postData = await postResponse.json();
        if (postData.success) {
          setPost(postData.post);
          
          // Görüntülenme sayısını artır
          await fetch(`/api/forum/posts/${params.id}/view`, {
            method: 'POST'
          });
        }
      }

      // Yorumları yükle
      const commentsResponse = await fetch(`/api/forum/posts/${params.id}/comments`);
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        if (commentsData.success) {
          setComments(commentsData.comments);
        }
      }
    } catch (error) {
      console.error('Post yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isAuthenticated || !user) return;

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/forum/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          postId: post?.id,
          authorId: user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setComments(prev => [data.comment, ...prev]);
          setNewComment('');
        }
      }
    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async () => {
    if (!isAuthenticated || !user || !post) return;

    try {
      const response = await fetch(`/api/forum/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        const data = await response.json();
        setUserLikedPost(data.liked);
        setPost(prev => prev ? {
          ...prev,
          likes: data.liked ? prev.likes + 1 : prev.likes - 1
        } : null);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await fetch(`/api/forum/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        const data = await response.json();
        const newLikedComments = new Set(userLikedComments);
        if (data.liked) {
          newLikedComments.add(commentId);
        } else {
          newLikedComments.delete(commentId);
        }
        setUserLikedComments(newLikedComments);

        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: data.liked ? comment.likes + 1 : comment.likes - 1 }
            : comment
        ));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!isAuthenticated || !user || !post) return;

    if (!confirm('Bu post\'u silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/forum/posts/${post.id}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        router.push('/forum');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isAuthenticated || !user) return;

    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/forum/comments/${commentId}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)} gün önce`;
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
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${levelInfo.bgColor} ${levelInfo.color} border-2 border-white/20`}>
        {initials}
      </div>
    );
  };

  const renderUserBadges = (badges: UserBadge[]) => {
    if (!badges || badges.length === 0) return null;
    
    return (
      <div className="flex space-x-1 mt-1">
        {badges.slice(0, 3).map((badge) => (
          <div
            key={badge.id}
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${badge.color}`}
            title={`${badge.name}: ${badge.description}`}
          >
            {badge.icon}
          </div>
        ))}
        {badges.length > 3 && (
          <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
            +{badges.length - 3}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Post yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Post Bulunamadı</h2>
          <p className="text-gray-400 mb-6">Aradığınız post mevcut değil veya silinmiş olabilir.</p>
          <Link
            href="/forum"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors"
          >
            Forum'a Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/forum"
            className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Forum'a Dön
          </Link>

          {/* Post Header */}
          <div className="ai-card rounded-3xl p-8">
            {/* Category & Status */}
            <div className="flex items-center space-x-2 mb-4">
              {post.isPinned && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium">
                  <Pin className="w-4 h-4" />
                  <span>Sabitlenmiş</span>
                </div>
              )}
              {post.isLocked && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                  <Lock className="w-4 h-4" />
                  <span>Kilitli</span>
                </div>
              )}
              <div className={`px-3 py-1 bg-gradient-to-r ${post.category.color} rounded-lg text-white text-sm font-medium`}>
                <span className="mr-1">{post.category.icon}</span>
                {post.category.name}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-gray-400 mb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  {generateAvatar(post.author.name, post.author.level)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{post.author.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserLevelInfo(post.author.level).bgColor} ${getUserLevelInfo(post.author.level).color}`}>
                        {getUserLevelInfo(post.author.level).icon} {getUserLevelInfo(post.author.level).name}
                      </span>
                    </div>
                    {renderUserBadges(post.author.badges)}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{post._count.postLikes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post._count.comments}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLikePost}
                  disabled={!isAuthenticated}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    userLikedPost
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30'
                  } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  <Heart className={`w-4 h-4 ${userLikedPost ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
              </div>

              {/* Delete button for post author */}
              {isAuthenticated && user && post.authorId === user.id && (
                <button
                  onClick={handleDeletePost}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Sil</span>
                </button>
              )}
            </div>

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-700">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium border border-purple-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Comments Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-cyan-400" />
              Yorumlar ({comments.length})
            </h2>
          </div>

          {/* New Comment Form */}
          {isAuthenticated && !post.isLocked ? (
            <div className="ai-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Yorum Yap</h3>
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorumunuzu yazın..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Gönderiliyor...' : 'Gönder'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="ai-card rounded-2xl p-6 text-center">
              <p className="text-gray-400 mb-4">Yorum yapmak için giriş yapmalısınız.</p>
              <Link
                href="/auth/signin"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          ) : (
            <div className="ai-card rounded-2xl p-6 text-center">
              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Bu post kilitli, yorum yapılamaz.</p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="ai-card rounded-2xl p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Henüz Yorum Yok</h3>
                <p className="text-gray-400">Bu posta ilk yorumu siz yapın!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="ai-card rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    {generateAvatar(comment.author.name, comment.author.level)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{comment.author.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserLevelInfo(comment.author.level).bgColor} ${getUserLevelInfo(comment.author.level).color}`}>
                            {getUserLevelInfo(comment.author.level).icon} {getUserLevelInfo(comment.author.level).name}
                          </span>
                          <span className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            disabled={!isAuthenticated}
                            className={`flex items-center space-x-1 transition-colors ${
                              userLikedComments.has(comment.id)
                                ? 'text-red-400'
                                : 'text-gray-400 hover:text-red-400'
                            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Heart className={`w-4 h-4 ${userLikedComments.has(comment.id) ? 'fill-current' : ''}`} />
                            <span className="text-sm">{comment.likes}</span>
                          </button>
                          {isAuthenticated && user && comment.authorId === user.id && (
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="text-sm">Sil</span>
                            </button>
                          )}
                        </div>
                      </div>
                      {renderUserBadges(comment.author.badges)}
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mt-2">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}