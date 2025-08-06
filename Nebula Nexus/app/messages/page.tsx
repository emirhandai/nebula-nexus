'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Send,
  Inbox,
  Archive,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Forward,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Calendar,
  User,
  FolderOpen,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  receiver: {
    id: string;
    name: string;
    image?: string;
  };
  project?: {
    id: string;
    title: string;
  };
}

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadMessages();
    }
  }, [isAuthenticated, user, activeTab, showUnreadOnly]);

  const loadMessages = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        userId: user.id,
        type: activeTab,
        ...(showUnreadOnly && { isRead: 'false' })
      });

      const response = await fetch(`/api/messages?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setUnreadCount(data.unreadCount);
      } else {
        toast.error('Mesajlar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Mesajlar yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        toast.success('Mesaj silindi');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Mesaj silinirken hata oluştu');
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showUnreadOnly && activeTab === 'inbox') {
      return matchesSearch && !message.isRead;
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('tr-TR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Giriş Yapın</h2>
          <p className="text-purple-200 mb-6">Mesajlarınızı görüntülemek için giriş yapmalısınız.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Giriş Yap
          </button>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-purple-300 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard'a Dön
              </button>
            </div>
            <h1 className="text-3xl font-bold text-white">Mesajlar</h1>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Mesajlarda ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    showUnreadOnly 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Sadece Okunmamış</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Message List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all duration-300 ${
                    activeTab === 'inbox'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>Gelen Kutusu</span>
                  {activeTab === 'inbox' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all duration-300 ${
                    activeTab === 'sent'
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Gönderilen</span>
                </button>
              </div>

              {/* Message List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-200">Yükleniyor...</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Henüz mesaj yok</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.isRead && activeTab === 'inbox') {
                          markAsRead(message.id);
                        }
                      }}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedMessage?.id === message.id
                          ? 'bg-purple-500/20 border border-purple-500/30'
                          : message.isRead
                          ? 'bg-white/5 hover:bg-white/10'
                          : 'bg-blue-500/20 border border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {message.sender.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`font-semibold truncate ${
                              message.isRead ? 'text-gray-300' : 'text-white'
                            }`}>
                              {message.sender.name}
                            </p>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${
                            message.isRead ? 'text-gray-400' : 'text-gray-200'
                          }`}>
                            {message.subject}
                          </p>
                          {message.project && (
                            <span className="inline-block mt-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
                              {message.project.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Message Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {selectedMessage ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                {/* Message Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {selectedMessage.sender.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {selectedMessage.subject}
                      </h2>
                      <p className="text-purple-200">
                        {activeTab === 'inbox' ? 'Gönderen: ' : 'Alıcı: '}
                        {activeTab === 'inbox' ? selectedMessage.sender.name : selectedMessage.receiver.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Project Info */}
                {selectedMessage.project && (
                  <div className="mb-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <h3 className="text-sm font-semibold text-purple-300 mb-1">İlgili Proje</h3>
                    <p className="text-white">{selectedMessage.project.title}</p>
                  </div>
                )}

                {/* Message Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      // Reply functionality would go here
                      toast.info('Yanıtlama özelliği yakında eklenecek');
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Yanıtla</span>
                  </button>
                  <button
                    onClick={() => {
                      // Forward functionality would go here
                      toast.info('İletme özelliği yakında eklenecek');
                    }}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                  >
                    <Forward className="w-4 h-4" />
                    <span>İlet</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Mesaj Seçin</h3>
                  <p className="text-gray-400">Görüntülemek istediğiniz mesajı seçin</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 