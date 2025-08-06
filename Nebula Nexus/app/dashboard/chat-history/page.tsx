'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  MessageSquare, 
  Clock, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  User,
  Bot,
  Copy,
  ExternalLink,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  tokensUsed?: number;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  messages: ChatMessage[];
}

export default function ChatHistoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadChatHistory();
    }
  }, [isAuthenticated, user]);

  const loadChatHistory = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch('/api/user/chat-history');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.data.sessions);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/user/chat-history?sessionId=${sessionId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
        setShowDeleteModal(false);
        setSessionToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error copying message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('tr-TR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
          <p className="text-purple-200 text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Giriş Gerekli</h2>
          <p className="text-purple-200 mb-8">Sohbet geçmişini görmek için lütfen giriş yapın.</p>
          <Link href="/auth/signin" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20 border border-white/20">
            <Home className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Ana Sayfa</span>
          </button>
        </Link>
      </div>

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
                Sohbet Geçmişi
              </h1>
              <p className="text-purple-200 text-lg">
                AI ile yaptığınız konuşmaların geçmişi
              </p>
            </div>
            <Link href="/chat" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              Yeni Sohbet
            </Link>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Sohbet ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-200 text-sm">
                  {filteredSessions.length} sohbet
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Sessions List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-white mb-4">Sohbetler</h3>
            <div className="space-y-3">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                      selectedSession?.id === session.id ? 'bg-white/20 border-purple-500/50' : ''
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white truncate">
                        {session.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToDelete(session.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">
                        {session.messageCount} mesaj
                      </span>
                      <span className="text-purple-400">
                        {formatDate(session.updatedAt)}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200">Henüz sohbet geçmişi yok</p>
                  <p className="text-purple-300 text-sm">AI ile konuşmaya başlayın</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedSession.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-purple-300">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedSession.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedSession.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-xl ${
                        message.role === 'user' 
                          ? 'bg-purple-500/20 border border-purple-500/30' 
                          : 'bg-white/10 border border-white/20'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {message.role === 'user' ? (
                              <User className="w-4 h-4 text-purple-300" />
                            ) : (
                              <Bot className="w-4 h-4 text-blue-300" />
                            )}
                            <span className="text-sm font-medium text-purple-200">
                              {message.role === 'user' ? 'Siz' : 'AI'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="text-purple-300 hover:text-purple-200 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-purple-400">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className="text-white text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {message.modelUsed && (
                          <div className="mt-2 text-xs text-purple-400">
                            Model: {message.modelUsed}
                            {message.tokensUsed && ` • ${message.tokensUsed} token`}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Sohbet Seçin
                </h3>
                <p className="text-purple-200">
                  Detayları görmek için sol taraftan bir sohbet seçin
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Sohbeti Sil
              </h3>
              <p className="text-purple-200 mb-6">
                Bu sohbeti kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSessionToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
                  className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 