'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  MessageSquare, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Home,
  User,
  Calendar,
  ThumbsUp,
  MessageCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  };
  tags: string[];
}

interface ForumComment {
  id: string;
  content: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  post: {
    id: string;
    title: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminForumPage() {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'deleted'>('all');
  const [selectedItem, setSelectedItem] = useState<ForumPost | ForumComment | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'delete' | 'view'>('view');

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/dashboard';
      return;
    }
    fetchData();
  }, [isAdmin, activeTab, pagination.page, searchTerm, filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        status: filterStatus
      });

      const endpoint = activeTab === 'posts' ? '/api/admin/forum/posts' : '/api/admin/forum/comments';
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (activeTab === 'posts') {
          setPosts(data.posts || []);
        } else {
          setComments(data.comments || []);
        }
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Forum verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (item: ForumPost | ForumComment, action: 'approve' | 'delete' | 'view') => {
    setSelectedItem(item);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeAction = async () => {
    if (!selectedItem) return;

    try {
      const endpoint = activeTab === 'posts' 
        ? `/api/admin/forum/${actionType === 'approve' ? 'approve' : 'delete'}`
        : `/api/admin/forum/comments/${actionType === 'approve' ? 'approve' : 'delete'}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedItem.id,
          action: actionType
        })
      });

      if (response.ok) {
        fetchData();
        setShowActionModal(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('İşlem hatası:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isApproved: boolean, isDeleted: boolean) => {
    if (isDeleted) {
      return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Silinmiş</span>;
    }
    if (isApproved) {
      return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Onaylı</span>;
    }
    return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Beklemede</span>;
  };

  if (!isAdmin) {
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
                Forum Yönetimi
              </h1>
              <p className="text-gray-400">Forum içeriklerini yönetin ve moderasyon yapın</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-4 py-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Yenile</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Gönderiler</span>
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'comments'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Yorumlar</span>
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                placeholder="İçerik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="approved">Onaylı</option>
              <option value="deleted">Silinmiş</option>
            </select>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-purple-200">Yükleniyor...</p>
            </div>
          ) : activeTab === 'posts' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">Başlık</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">Yazar</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">Durum</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">İstatistikler</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">Tarih</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{post.title}</div>
                          <div className="text-sm text-purple-300 mt-1">
                            {post.content.substring(0, 100)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{post.author.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(post.isApproved, post.isDeleted)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-blue-400" />
                            <span className="text-white">{post.viewCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4 text-green-400" />
                            <span className="text-white">{post.likeCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4 text-purple-400" />
                            <span className="text-white">{post.commentCount}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{formatDate(post.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAction(post, 'view')}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!post.isApproved && !post.isDeleted && (
                            <button
                              onClick={() => handleAction(post, 'approve')}
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {!post.isDeleted && (
                            <button
                              onClick={() => handleAction(post, 'delete')}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">İçerik</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">Yazar</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">Gönderi</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">Durum</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">Tarih</th>
                    <th className="px-6 py-4 text-left text-purple-200 font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white max-w-xs truncate">
                          {comment.content}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{comment.author.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm max-w-xs truncate">
                          {comment.post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(comment.isApproved, comment.isDeleted)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{formatDate(comment.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAction(comment, 'view')}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!comment.isApproved && !comment.isDeleted && (
                            <button
                              onClick={() => handleAction(comment, 'approve')}
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {!comment.isDeleted && (
                            <button
                              onClick={() => handleAction(comment, 'delete')}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex justify-center"
          >
            <div className="flex space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    page === pagination.page
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center space-x-3 mb-4">
              {actionType === 'approve' && <CheckCircle className="w-6 h-6 text-green-400" />}
              {actionType === 'delete' && <XCircle className="w-6 h-6 text-red-400" />}
              {actionType === 'view' && <Eye className="w-6 h-6 text-blue-400" />}
              <h3 className="text-xl font-semibold text-white">
                {actionType === 'approve' && 'İçeriği Onayla'}
                {actionType === 'delete' && 'İçeriği Sil'}
                {actionType === 'view' && 'İçeriği Görüntüle'}
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-purple-200 mb-4">
                {actionType === 'approve' && 'Bu içeriği onaylamak istediğinizden emin misiniz?'}
                {actionType === 'delete' && 'Bu içeriği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
                {actionType === 'view' && activeTab === 'posts' ? (selectedItem as ForumPost).title : selectedItem.content}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                İptal
              </button>
              {actionType !== 'view' && (
                <button
                  onClick={executeAction}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    actionType === 'approve'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {actionType === 'approve' ? 'Onayla' : 'Sil'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 