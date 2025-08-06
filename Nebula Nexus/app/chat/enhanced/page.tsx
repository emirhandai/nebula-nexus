'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  MessageSquare,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Activity,
  Lock,
  BookOpen,
  Lightbulb,
  Star,
  Clock,
  Settings,
  Download,
  Share2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  FileText,
  BarChart3,
  Users,
  Calendar,
  Award,
  Rocket,
  Code,
  Database,
  Shield,
  Smartphone,
  Globe,
  Gamepad2,
  Cpu,
  Network,
  Eye,
  Home,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingIndicators, { Spinner, Dots } from '@/components/ui/LoadingIndicators';
import { useNotificationManager } from '@/components/ui/NotificationSystem';
import { toast } from 'react-hot-toast';
import LazyLoad from '@/components/ui/LazyLoad';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'general' | 'career_advice' | 'field_details' | 'motivation';
  metadata?: {
    confidence?: number;
    field?: string;
    suggestions?: string[];
  };
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  messageCount: number;
}

interface UserContext {
  oceanScores?: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number };
  recommendedFields?: Array<{
    field: string;
    confidence: number;
  }>;
  userProfile?: {
    name: string;
    email: string;
    joinDate: Date;
  };
}

// Field icons mapping
const fieldIcons: Record<string, any> = {
  'Yapay Zeka & ML': Brain,
  'Web Geliştirme': Globe,
  'Mobil Geliştirme': Smartphone,
  'Siber Güvenlik': Shield,
  'Veri Bilimi': Database,
  'Oyun Geliştirme': Gamepad2,
  'DevOps': Cpu,
  'Blockchain': Network,
  'IoT': Activity,
  'AR/VR': Eye
};

export default function EnhancedChatPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { addNotification } = useNotificationManager();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [showSessions, setShowSessions] = useState(false);
  const [selectedMessageType, setSelectedMessageType] = useState<'general' | 'career_advice' | 'field_details' | 'motivation'>('general');
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick action suggestions
  const quickActions = [
    {
      icon: Brain,
      title: 'Kariyer Önerisi',
      description: 'OCEAN test sonuçlarına göre kişiselleştirilmiş öneriler',
      type: 'career_advice' as const,
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Code,
      title: 'Alan Detayları',
      description: 'Yazılım alanları hakkında detaylı bilgi',
      type: 'field_details' as const,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Rocket,
      title: 'Motivasyon',
      description: 'Kariyer yolculuğunda motivasyonel mesajlar',
      type: 'motivation' as const,
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: BookOpen,
      title: 'Öğrenme Yolu',
      description: 'Kişiselleştirilmiş öğrenme planı',
      type: 'general' as const,
      color: 'from-orange-500 to-red-600'
    }
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirect=/chat/enhanced');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      checkUserAccess();
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id && selectedField) {
      loadChatSessions();
      loadUserContext();
    }
  }, [isAuthenticated, user?.id, selectedField]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkUserAccess = async () => {
    try {
      // Check if user has completed test
      const testResult = localStorage.getItem('oceanTestResult');
      if (!testResult) {
        setHasCompletedTest(false);
        setSelectedField('');
        setIsCheckingAccess(false);
        return;
      }

      setHasCompletedTest(true);

      // Get user's selected field from API
      const response = await fetch(`/api/user/profile?userId=${user?.id}`);
      if (response.ok) {
        const userData = await response.json();
        setSelectedField(userData.selectedField || '');
      }

      setIsCheckingAccess(false);
    } catch (error) {
      console.error('Error checking user access:', error);
      setIsCheckingAccess(false);
    }
  };

  const loadChatSessions = async () => {
    try {
      const response = await fetch(`/api/chat/enhanced?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setChatSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const loadUserContext = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserContext(data);
      }
    } catch (error) {
      console.error('Error loading user context:', error);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/enhanced?userId=${user?.id}&sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setCurrentSessionId(sessionId);
        setShowSessions(false);
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user?.id) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: selectedMessageType
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: user.id,
          sessionId: currentSessionId,
          messageType: selectedMessageType,
          selectedField: selectedField,
          context: {
            previousMessages: messages.slice(-5).map(m => m.content)
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update session ID if new session created
        if (data.sessionId && !currentSessionId) {
          setCurrentSessionId(data.sessionId);
        }

        // Add AI response
        const aiMessage: Message = {
          id: data.messages[1].id,
          content: data.messages[1].content,
          sender: 'ai',
          timestamp: new Date(data.messages[1].timestamp),
          type: selectedMessageType,
          metadata: data.context
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Update user context
        if (data.context) {
          setUserContext(data.context);
        }

        // Reload sessions
        loadChatSessions();

        addNotification({
          type: 'success',
          title: 'Mesaj Gönderildi',
          message: 'AI yanıtı başarıyla alındı.',
          duration: 3000
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj gönderilirken hata oluştu');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setSelectedMessageType(action.type);
    setInputMessage(`Merhaba! ${action.title.toLowerCase()} hakkında bilgi almak istiyorum.`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Mesaj kopyalandı');
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.sender === 'user' ? 'Sen' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Sohbet dışa aktarıldı');
  };

  if (isLoading || isCheckingAccess) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-white mt-4">Chat yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-white mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-400">Gelişmiş chat özelliklerine erişmek için lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  if (!hasCompletedTest) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Test Gerekli</h2>
          <p className="text-gray-300 mb-6">Gelişmiş AI Chat'e erişmek için önce kişilik testini tamamlamalısınız.</p>
          <div className="space-y-3">
            <Link href="/test">
              <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                Teste Başla
              </button>
            </Link>
            <Link href="/">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                Ana Sayfaya Dön
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedField) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md mx-auto">
          <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Alan Seçimi Gerekli</h2>
          <p className="text-gray-300 mb-6">Gelişmiş AI Chat'e erişmek için önce dashboard'dan kariyer alanınızı seçmelisiniz.</p>
          <div className="space-y-3">
            <Link href="/dashboard">
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                Dashboard'a Git
              </button>
            </Link>
            <Link href="/">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                Ana Sayfaya Dön
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg">
      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-gray-900/50 border-r border-gray-700 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold">AI Asistan</h2>
                <p className="text-gray-400 text-sm">Gelişmiş Kariyer Danışmanı</p>
              </div>
            </div>

            {/* User Context */}
            {userContext && (
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h3 className="text-white text-sm font-medium mb-2">Kullanıcı Profili</h3>
                  <p className="text-gray-300 text-sm">{userContext.userProfile?.name}</p>
                  {selectedField && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-xs">Seçilen Alan:</p>
                      <div className="flex items-center space-x-1 bg-cyan-500/20 rounded-full px-2 py-1 mt-1">
                        {(() => {
                          const Icon = fieldIcons[selectedField] || Target;
                          return <Icon className="w-3 h-3 text-cyan-400" />;
                        })()}
                        <span className="text-gray-300 text-xs">{selectedField}</span>
                      </div>
                    </div>
                  )}
                  {userContext.recommendedFields && userContext.recommendedFields.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-400 text-xs">Önerilen Alanlar:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userContext.recommendedFields.slice(0, 2).map((field, index) => {
                          const Icon = fieldIcons[field.field] || Code;
                          return (
                            <div key={index} className="flex items-center space-x-1 bg-gray-700/50 rounded px-2 py-1">
                              <Icon className="w-3 h-3 text-cyan-400" />
                              <span className="text-gray-300 text-xs">{field.field}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-white font-medium mb-3">Hızlı Eylemler</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickAction(action)}
                  className={`w-full p-3 rounded-lg bg-gradient-to-r ${action.color} text-white text-left transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium">Sohbet Geçmişi</h3>
              <button
                onClick={() => setShowSessions(!showSessions)}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <AnimatePresence>
              {showSessions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {chatSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => loadSessionMessages(session.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        currentSessionId === session.id
                          ? 'bg-cyan-500/20 border border-cyan-500/30'
                          : 'bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                    >
                      <p className="text-white text-sm font-medium truncate">{session.title}</p>
                      <p className="text-gray-400 text-xs truncate">{session.lastMessage}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-500 text-xs">
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="text-gray-500 text-xs">{session.messageCount} mesaj</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-900/30 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <button className="text-gray-400 hover:text-white transition-colors p-2">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </Link>
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-semibold">Gelişmiş AI Chat</h1>
                  <p className="text-gray-400 text-sm">Kişiselleştirilmiş kariyer danışmanlığı</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportChat}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                  title="Sohbeti Dışa Aktar"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMessages([])}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                  title="Yeni Sohbet"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <Link href="/">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors" title="Ana Sayfa">
                    <Home className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Hoş Geldiniz!</h3>
                <p className="text-gray-400 mb-6">
                  Gelişmiş AI asistanınız {selectedField} alanında kariyeriniz hakkında size yardımcı olmaya hazır.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(action)}
                      className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white text-left transition-all duration-200 hover:shadow-lg`}
                    >
                      <div className="flex items-center space-x-3">
                        <action.icon className="w-6 h-6" />
                        <div>
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <LazyLoad key={message.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3xl ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-600'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block p-4 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                              : 'bg-gray-800/50 text-white border border-gray-700'
                          }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            
                            {/* Message metadata */}
                            {message.metadata && (
                              <div className="mt-3 pt-3 border-t border-gray-600/30">
                                {message.metadata.field && (
                                  <div className="flex items-center space-x-2 text-xs text-gray-300">
                                    <Code className="w-3 h-3" />
                                    <span>{message.metadata.field}</span>
                                  </div>
                                )}
                                {message.metadata.confidence && (
                                  <div className="flex items-center space-x-2 text-xs text-gray-300 mt-1">
                                    <BarChart3 className="w-3 h-3" />
                                    <span>Güven: {Math.round(message.metadata.confidence * 100)}%</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center space-x-2 mt-2 text-xs text-gray-400 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            
                            {message.sender === 'ai' && (
                              <>
                                <button
                                  onClick={() => copyMessage(message.content)}
                                  className="hover:text-white transition-colors"
                                  title="Kopyala"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button
                                  className="hover:text-green-400 transition-colors"
                                  title="Beğen"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </button>
                                <button
                                  className="hover:text-red-400 transition-colors"
                                  title="Beğenme"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </LazyLoad>
              ))
            )}
            
            {isChatLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4">
                    <Dots />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-gray-900/30 border-t border-gray-700 p-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <select
                    value={selectedMessageType}
                    onChange={(e) => setSelectedMessageType(e.target.value as any)}
                    className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="general">Genel Sohbet</option>
                    <option value="career_advice">Kariyer Önerisi</option>
                    <option value="field_details">Alan Detayları</option>
                    <option value="motivation">Motivasyon</option>
                  </select>
                </div>
                
                <div className="relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Mesajınızı yazın... (Shift+Enter ile yeni satır)"
                    className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    rows={3}
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isChatLoading}
                    className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 