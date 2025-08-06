'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Bot, 
  Plus,
  Settings,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Brain,
  Target,
  BookOpen,
  AlertCircle,
  TestTube,
  GraduationCap,
  Lock,
  MessageSquare,
  Zap,
  Star,
  Home,
  ArrowLeft,
  Shield,
  Globe,
  Smartphone,
  Database,
  Gamepad2,
  Cpu,
  Network,
  Activity,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Search,
  X,
  Download,
  Tag,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationManager } from '@/components/ui/NotificationSystem';
import { toast } from 'react-hot-toast';
import GeneratedContentDisplay from '@/components/chat/GeneratedContentDisplay';

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  mimeType?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  userFeedback?: 'like' | 'dislike' | null;
  emojiReactions?: { [emoji: string]: number };
  isFavorited?: boolean;
  tags?: string[];
  attachments?: Attachment[];
}



interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
  messageCount: number;
  createdAt: Date;
}

type ChatCategory = 'casual' | 'career' | 'education' | 'technical';

// Common emoji reactions
const emojiReactions = [
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '😂', label: 'Joy' },
  { emoji: '😮', label: 'Surprised' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💡', label: 'Light Bulb' }
];

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

export default function ChatPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { addNotification } = useNotificationManager();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory>('casual');
  const [showCommandSuggestions, setShowCommandSuggestions] = useState(false);
  const [commandSuggestions, setCommandSuggestions] = useState<string[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showTagSelector, setShowTagSelector] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // AI Features
  const [aiPersonality, setAiPersonality] = useState<'mentor' | 'friend' | 'professional' | 'motivator'>('friend');
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [currentMoodAnalysis, setCurrentMoodAnalysis] = useState<any>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<any>(null);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [contextualHelp, setContextualHelp] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Chat categories
  const chatCategories = [
    { id: 'casual', name: 'Gündelik Sohbet', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'career', name: 'Kariyer Danışmanlığı', icon: Target, color: 'bg-green-500' },
    { id: 'education', name: 'Eğitim & Öğrenme', icon: BookOpen, color: 'bg-purple-500' },
    { id: 'technical', name: 'Teknik Destek', icon: Cpu, color: 'bg-orange-500' }
  ];

  // AI Personalities
  const aiPersonalities = [
    { id: 'mentor', name: 'Mentor', icon: '👨‍🏫', description: 'Deneyimli danışman', color: 'bg-blue-500' },
    { id: 'friend', name: 'Arkadaş', icon: '🤝', description: 'Samimi ve destekleyici', color: 'bg-green-500' },
    { id: 'professional', name: 'Profesyonel', icon: '💼', description: 'Resmi ve detaylı', color: 'bg-gray-500' },
    { id: 'motivator', name: 'Motivatör', icon: '🔥', description: 'Enerjik ve cesaret verici', color: 'bg-orange-500' }
  ];

  // Available commands
  const availableCommands = [
    '/help',
    '/clear',
    '/roadmap',
    '/casual',
    '/career',
    '/education',
    '/technical',
    '/profile',
    '/progress',
    '/stats'
  ];

  // Available tags for message categorization
  const availableTags = [
    { id: 'career', name: 'Kariyer', color: 'bg-green-500', icon: Target },
    { id: 'technical', name: 'Teknik', color: 'bg-blue-500', icon: Cpu },
    { id: 'motivation', name: 'Motivasyon', color: 'bg-yellow-500', icon: Star },
    { id: 'education', name: 'Eğitim', color: 'bg-purple-500', icon: BookOpen },
    { id: 'personal', name: 'Kişisel', color: 'bg-pink-500', icon: User },
    { id: 'important', name: 'Önemli', color: 'bg-red-500', icon: AlertCircle },
    { id: 'question', name: 'Soru', color: 'bg-cyan-500', icon: MessageSquare },
    { id: 'tip', name: 'İpucu', color: 'bg-orange-500', icon: Sparkles }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputMessage]);

  // Check user access to chat
  useEffect(() => {
    if (isAuthenticated && user) {
      checkUserAccess();
    } else {
      setIsCheckingAccess(false);
    }
  }, [isAuthenticated, user]);

  // Load chat history when user is ready
  useEffect(() => {
    if (isAuthenticated && user?.id && selectedField) {
      loadChatHistory();
    }
  }, [isAuthenticated, user?.id, selectedField]);

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

  // Special commands handling
  const handleSpecialCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      case '/help':
        return {
          content: `🤖 **Mevcut Komutlar:**

**📚 Temel Komutlar:**
• \`/help\` - Bu yardım menüsünü gösterir
• \`/clear\` - Sohbeti temizler
• \`/roadmap\` - Kariyer yol haritası oluşturur

**🎯 Kategori Komutları:**
• \`/casual\` - Gündelik sohbet moduna geçer
• \`/career\` - Kariyer danışmanlığı moduna geçer
• \`/education\` - Eğitim moduna geçer
• \`/technical\` - Teknik destek moduna geçer

**📊 Bilgi Komutları:**
• \`/profile\` - Profil bilgilerinizi gösterir
• \`/progress\` - İlerleme durumunuzu gösterir
• \`/stats\` - İstatistiklerinizi gösterir

**💡 İpucu:** Komutları yazmaya başladığınızda otomatik tamamlama özelliği devreye girer!`,
          isCommand: true
        };
      
      case '/clear':
        clearChat();
        return {
          content: '🗑️ Sohbet temizlendi! Yeni bir konuşmaya başlayabilirsiniz.',
          isCommand: true
        };
      
      case '/roadmap':
        return {
          content: `🎯 **Kariyer Yol Haritası Oluşturuluyor...**

Seçili alanınız: **${selectedField}**

Bu komut için kariyer yol haritası sayfasına yönlendiriliyorsunuz. Orada detaylı bir yol haritası oluşturabiliriz.

[Kariyer Yol Haritası Oluştur](https://your-domain.com/career-roadmap)`,
          isCommand: true
        };
      
      case '/casual':
        setSelectedCategory('casual');
        return {
          content: '💬 **Gündelik Sohbet** moduna geçildi! Artık genel konularda sohbet edebiliriz.',
          isCommand: true
        };
      
      case '/career':
        setSelectedCategory('career');
        return {
          content: '🎯 **Kariyer Danışmanlığı** moduna geçildi! Kariyer konularında size yardımcı olabilirim.',
          isCommand: true
        };
      
      case '/education':
        setSelectedCategory('education');
        return {
          content: '📚 **Eğitim & Öğrenme** moduna geçildi! Eğitim konularında size rehberlik edebilirim.',
          isCommand: true
        };
      
      case '/technical':
        setSelectedCategory('technical');
        return {
          content: '⚙️ **Teknik Destek** moduna geçildi! Teknik konularda size yardımcı olabilirim.',
          isCommand: true
        };
      
      case '/profile':
        return {
          content: `👤 **Profil Bilgileri:**

**Seçili Alan:** ${selectedField}
**Kategori:** ${chatCategories.find(cat => cat.id === selectedCategory)?.name}
**Test Durumu:** ✅ Tamamlandı
**Toplam Mesaj:** ${messages.length}
**Aktif Oturum:** ${currentSessionId ? 'Var' : 'Yok'}

Daha detaylı bilgi için dashboard'ı ziyaret edebilirsiniz.`,
          isCommand: true
        };
      
      case '/progress':
        return {
          content: `📊 **İlerleme Durumu:**

**Test Tamamlama:** ✅ %100
**Alan Seçimi:** ✅ %100
**Chat Kategorileri:** ✅ %100
**Mesaj Sayısı:** ${messages.length}
**Favori Mesajlar:** ${messages.filter(m => m.isFavorited).length}
**Toplam Reaksiyon:** ${messages.reduce((acc, m) => acc + Object.values(m.emojiReactions || {}).reduce((sum, val) => sum + val, 0), 0)}

Devam etmek için farklı kategorilerde sohbet edebilirsiniz!`,
          isCommand: true
        };
      
      case '/stats':
        return {
          content: `📈 **İstatistikler:**

**Toplam Mesaj:** ${messages.length}
**Kullanıcı Mesajları:** ${messages.filter(m => m.sender === 'user').length}
**AI Yanıtları:** ${messages.filter(m => m.sender === 'ai').length}
**Favori Mesajlar:** ${messages.filter(m => m.isFavorited).length}
**Beğenilen Mesajlar:** ${messages.filter(m => m.userFeedback === 'like').length}
**Toplam Emoji Reaksiyonu:** ${messages.reduce((acc, m) => acc + Object.values(m.emojiReactions || {}).reduce((sum, val) => sum + val, 0), 0)}

**En Aktif Kategori:** ${chatCategories.find(cat => cat.id === selectedCategory)?.name}`,
          isCommand: true
        };
      
      default:
        return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isChatLoading) return;
    
    if (!user?.id) {
      toast.error('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Check for special commands first
    const commandResponse = handleSpecialCommand(userMessage);
    if (commandResponse) {
      // Add user message
      const newUserMessage: Message = {
        id: Date.now().toString(),
        content: userMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      // Add command response
      const commandMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: commandResponse.content,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newUserMessage, commandMessage]);
      return;
    }
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsChatLoading(true);

    try {
      // Send to API with category
      const response = await fetch('/api/chat/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userId: user.id,
          sessionId: currentSessionId,
          selectedField: selectedField,
          category: selectedCategory,
          context: {
            selectedField: selectedField,
            category: selectedCategory,
            previousMessages: messages.map(m => m.content)
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (data.success) {
        // Extract AI message from the response
        const aiMessageData = data.messages?.find((msg: any) => msg.role === 'assistant');
        const aiResponse = aiMessageData?.content || data.response || 'Yanıt alınamadı';
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: 'ai',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        setCurrentSessionId(data.sessionId);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj gönderilirken hata oluştu!');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputMessage(value);
    
    // Check for command suggestions
    if (value.startsWith('/')) {
      const suggestions = availableCommands.filter(cmd => 
        cmd.toLowerCase().includes(value.toLowerCase())
      );
      setCommandSuggestions(suggestions);
      setShowCommandSuggestions(suggestions.length > 0);
    } else {
      setShowCommandSuggestions(false);
    }
  };

  const selectCommandSuggestion = (command: string) => {
    setInputMessage(command);
    setShowCommandSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'career_change':
        message = 'Kariyer değişimi için tavsiye verir misin? Mevcut durumumda hangi adımları atmalıyım?';
        break;
      case 'weekly_plan':
        message = 'Bu hafta kariyer gelişimim için ne yapmalıyım? Hangi konulara odaklanmalıyım?';
        break;
      case 'motivation':
        message = 'Motivasyon konuşması yapar mısın? Son zamanlarda kendimi biraz düşük hissediyorum.';
        break;
      case 'interview_prep':
        message = 'Mülakat hazırlığı yapmak istiyorum. Hangi soruları çalışmalı, nasıl hazırlanmalıyım?';
        break;
      case 'skill_assessment':
        message = 'Mevcut becerilerimi değerlendirir misin? Hangi alanlarda gelişmem gerekiyor?';
        break;
      case 'learning_plan':
        message = 'Kişiselleştirilmiş bir öğrenme planı oluşturur musun? Hedeflerimi nasıl belirlemeliyim?';
        break;
      default:
        return;
    }
    
    setInputMessage(message);
    setShowQuickActions(false);
    textareaRef.current?.focus();
  };

  // AI Analysis Functions
  const analyzeMood = async () => {
    try {
      const response = await fetch('/api/chat/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          messages: messages.slice(-10), // Son 10 mesaj
          analysisType: 'mood_analysis'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentMoodAnalysis(data.analysis);
        toast.success('Ruh hali analizi tamamlandı!');
      }
    } catch (error) {
      console.error('Mood analysis error:', error);
    }
  };

  const getSmartSuggestions = async () => {
    try {
      const response = await fetch('/api/chat/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          messages: messages.slice(-5),
          analysisType: 'smart_suggestions'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSmartSuggestions(data.analysis);
      }
    } catch (error) {
      console.error('Smart suggestions error:', error);
    }
  };

  const generateContent = async (contentType: string, topic?: string) => {
    try {
      setShowContentGenerator(true);
      console.log('🚀 Starting content generation:', { contentType, topic, userId: user?.id });
      
      const response = await fetch('/api/chat/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          contentType,
          userProfile: {
            selectedField,
            oceanScores: {
              openness: 4.2,
              conscientiousness: 4.2,
              extraversion: 4.2,
              agreeableness: 4.2,
              neuroticism: 3
            }
          },
          topic: topic || selectedField,
          difficulty: 'intermediate',
          format: 'interactive'
        })
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Response data:', data);
        setGeneratedContent(data.generatedContent);
        
        if (data.isFallback) {
          toast.error('Gemini quota limit aşıldı, örnek içerik gösteriliyor');
        } else {
          toast.success('İçerik oluşturuldu!');
        }
      } else {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        toast.error(errorData.error || 'İçerik oluşturulamadı');
      }
    } catch (error) {
      console.error('💥 Content generation error:', error);
      toast.error('Bir hata oluştu, tekrar deneyin');
    } finally {
      setShowContentGenerator(false);
    }
  };

  const toggleMessageTag = (messageId: string, tagId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentTags = msg.tags || [];
        const newTags = currentTags.includes(tagId)
          ? currentTags.filter(tag => tag !== tagId)
          : [...currentTags, tagId];
        
        return { ...msg, tags: newTags };
      }
      return msg;
    }));
  };

  const getMessageTags = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    return message?.tags || [];
  };

  const getTagInfo = (tagId: string) => {
    return availableTags.find(tag => tag.id === tagId);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const cycleFontSize = () => {
    setFontSize(prev => {
      switch (prev) {
        case 'small':
          return 'medium';
        case 'medium':
          return 'large';
        case 'large':
          return 'small';
        default:
          return 'medium';
      }
    });
  };

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      toast.success('Mesaj kopyalandı!');
    } catch (error) {
      toast.error('Kopyalama başarısız!');
    }
  };

  // Function to detect and render code blocks
  const renderMessageContent = (content: string, attachments?: Attachment[]) => {
    // Handle null or undefined content
    if (!content) {
      return <span className="text-gray-400">İçerik yüklenemedi</span>;
    }

    // Simple code block detection (```code```)
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'javascript',
        content: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return (
      <div>
        {parts.map((part, index) => {
          if (part.type === 'code') {
            return (
              <div key={index} className="my-3 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs text-gray-400 uppercase font-medium">{part.language}</span>
                  <button
                    onClick={() => copyMessage(part.content, `code-${index}`)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors p-1 rounded"
                    title="Kodu Kopyala"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                    <code>{part.content}</code>
                  </pre>
                </div>
              </div>
            );
          }
          return (
            <span key={index} className="whitespace-pre-wrap">
              {part.content}
            </span>
          );
        })}
        
        {/* Render attachments */}
        {attachments && attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                {attachment.type === 'image' && (
                  <div>
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                    />
                    <p className="text-sm text-gray-400 mt-1">{attachment.name}</p>
                  </div>
                )}
                
                {attachment.type === 'audio' && (
                  <div>
                    <audio controls className="w-full">
                      <source src={attachment.url} type={attachment.mimeType} />
                      Tarayıcınız ses dosyasını desteklemiyor.
                    </audio>
                    <p className="text-sm text-gray-400 mt-1">{attachment.name}</p>
                  </div>
                )}
                
                {attachment.type === 'file' && (
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{attachment.name}</p>
                      <p className="text-xs text-gray-400">
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <a 
                      href={attachment.url} 
                      download={attachment.name}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleMessageFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, userFeedback: msg.userFeedback === feedback ? null : feedback }
        : msg
    ));

    // Show feedback toast
    const feedbackText = feedback === 'like' ? 'Beğendiniz' : 'Beğenmediniz';
    toast.success(`Mesaj ${feedbackText}!`);

    // TODO: Send feedback to backend for AI improvement
    console.log(`Message ${messageId} feedback: ${feedback}`);
  };

  const handleEmojiReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentReactions = msg.emojiReactions || {};
        const currentCount = currentReactions[emoji] || 0;
        
        return {
          ...msg,
          emojiReactions: {
            ...currentReactions,
            [emoji]: currentCount + 1
          }
        };
      }
      return msg;
    }));

    toast.success(`${emoji} reaksiyonu eklendi!`);
  };

  const toggleFavorite = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isFavorited: !msg.isFavorited }
        : msg
    ));

    const message = messages.find(msg => msg.id === messageId);
    const isFavorited = !message?.isFavorited;
    const action = isFavorited ? 'favorilere eklendi' : 'favorilerden çıkarıldı';
    toast.success(`Mesaj ${action}!`);
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast.success('Mesaj silindi!');
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Sohbet temizlendi!');
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat/enhanced?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setChatSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/enhanced?userId=${user?.id}&sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setCurrentSessionId(sessionId);
        setShowChatHistory(false);
        toast.success('Sohbet yüklendi!');
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Sohbet yüklenirken hata oluştu!');
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setShowChatHistory(false);
    toast.success('Yeni sohbet başlatıldı!');
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter(message =>
    message.content && message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  const exportChat = () => {
    if (messages.length === 0) {
      toast.error('Dışa aktarılacak mesaj yok!');
      return;
    }

    const chatContent = messages.map(message => {
      const sender = message.sender === 'user' ? 'Siz' : 'AI';
      const timestamp = message.timestamp.toLocaleString('tr-TR');
      const content = message.content || 'İçerik yüklenemedi';
      return `[${timestamp}] ${sender}: ${content}`;
    }).join('\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Sohbet dışa aktarıldı!');
  };



  if (isLoading || isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md mx-auto">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Giriş Gerekli</h2>
          <p className="text-gray-300 mb-6">AI Chat'e erişmek için lütfen giriş yapın.</p>
          <Link href="/auth/signin">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
              Giriş Yap
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!hasCompletedTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md mx-auto">
          <TestTube className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Test Gerekli</h2>
          <p className="text-gray-300 mb-6">AI Chat'e erişmek için önce kişilik testini tamamlamalısınız.</p>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md mx-auto">
          <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Alan Seçimi Gerekli</h2>
          <p className="text-gray-300 mb-6">AI Chat'e erişmek için önce dashboard'dan kariyer alanınızı seçmelisiniz.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Sidebar - Chat Categories */}
      <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Chat</h1>
              {selectedField && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-300">Alan:</span>
                  <div className="flex items-center space-x-1 bg-cyan-500/20 rounded-full px-2 py-0.5">
                    {(() => {
                      const Icon = fieldIcons[selectedField] || Target;
                      return <Icon className="w-2.5 h-2.5 text-cyan-400" />;
                    })()}
                    <span className="text-xs text-cyan-400">{selectedField}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Categories */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-3 text-sm">Sohbet Kategorileri</h3>
          <div className="space-y-2">
            {chatCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as ChatCategory)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? `${category.color} text-white shadow-lg` 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                  title={category.name}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Personality Selector */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-3 text-sm">AI Kişiliği</h3>
          <div className="space-y-2">
            {aiPersonalities.map((personality) => (
              <button
                key={personality.id}
                onClick={() => setAiPersonality(personality.id as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  aiPersonality === personality.id 
                    ? `${personality.color} text-white shadow-lg` 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                title={personality.description}
              >
                <span className="text-sm">{personality.icon}</span>
                <span className="text-sm font-medium">{personality.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">AI Öngörüler</h3>
            <button
              onClick={() => setShowAiInsights(!showAiInsights)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Brain className="w-4 h-4" />
            </button>
          </div>
          
          {showAiInsights && (
            <div className="space-y-2">
              <button
                onClick={analyzeMood}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Ruh Hali Analizi</span>
              </button>
              
              <button
                onClick={getSmartSuggestions}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm">Akıllı Öneriler</span>
              </button>
              
              <button
                onClick={() => generateContent('roadmap')}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all duration-200"
              >
                <Target className="w-4 h-4" />
                <span className="text-sm">Yol Haritası</span>
              </button>
              
              <button
                onClick={() => generateContent('quiz')}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-all duration-200"
              >
                <TestTube className="w-4 h-4" />
                <span className="text-sm">Quiz Oluştur</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="space-y-2">
            <Link href="/dashboard">
              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-all duration-200">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
            </Link>
            <Link href="/">
              <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-all duration-200">
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Ana Sayfa</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <button className="text-gray-400 hover:text-white transition-colors p-2">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </Link>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {chatCategories.find(cat => cat.id === selectedCategory)?.name || 'AI Chat'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {selectedCategory === 'casual' && 'Gündelik sohbet için hazırım'}
                    {selectedCategory === 'career' && 'Kariyer danışmanlığı için hazırım'}
                    {selectedCategory === 'education' && 'Eğitim ve öğrenme için hazırım'}
                    {selectedCategory === 'technical' && 'Teknik destek için hazırım'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Mesaj Ara"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowChatHistory(!showChatHistory)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Sohbet Geçmişi"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={startNewChat}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Yeni Sohbet"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={exportChat}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Sohbeti Dışa Aktar"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Sohbeti Temizle"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                {/* Font Size Control */}
                <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
                  <button
                    onClick={cycleFontSize}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                    title={`Font Boyutu: ${fontSize === 'small' ? 'Küçük' : fontSize === 'medium' ? 'Orta' : 'Büyük'}`}
                  >
                    <span className={`font-bold ${getFontSizeClass()}`}>A</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl h-[600px] flex flex-col relative">
              {/* Chat History Sidebar */}
              {showChatHistory && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  className="absolute left-0 top-0 w-80 h-full bg-gray-900/95 backdrop-blur-sm border-r border-white/10 z-10 rounded-l-2xl"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold mb-2">Sohbet Geçmişi</h3>
                    <p className="text-gray-400 text-sm">Önceki sohbetlerinizi görüntüleyin</p>
                  </div>
                  <div className="overflow-y-auto h-[calc(100%-80px)]">
                    {chatSessions.length === 0 ? (
                      <div className="p-4 text-center">
                        <p className="text-gray-400 text-sm">Henüz sohbet geçmişi yok</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {chatSessions.map((session) => (
                          <button
                            key={session.id}
                            onClick={() => loadSession(session.id)}
                            className={`
                              w-full p-3 rounded-lg text-left transition-colors mb-2 ${
                                currentSessionId === session.id
                                  ? 'bg-cyan-500/20 border border-cyan-500/30'
                                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
                              }
                            `}
                          >
                            <p className="text-white text-sm font-medium truncate mb-1">{session.title}</p>
                            <p className="text-gray-400 text-xs truncate mb-2">{session.lastMessage}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{new Date(session.updatedAt).toLocaleDateString('tr-TR')}</span>
                              <span>{session.messageCount} mesaj</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Search Bar */}
              {showSearch && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="p-4 border-b border-white/10"
                >
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Mesajlarda ara..."
                      className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        title="Aramayı Temizle"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-xs text-gray-400">
                      {filteredMessages.length} mesaj bulundu
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">AI Chat'e Hoş Geldiniz! 🤖</h3>
                    <p className="text-gray-300 mb-6">
                      {selectedField} alanında size nasıl yardımcı olabilirim? Kariyer tavsiyeleri, teknik sorular veya genel konularda sohbet edebiliriz.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <Brain className="w-6 h-6 text-cyan-400 mb-2" />
                        <p className="text-sm text-gray-300">Kişilik analizi</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <Target className="w-6 h-6 text-purple-400 mb-2" />
                        <p className="text-sm text-gray-300">Kariyer önerileri</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <BookOpen className="w-6 h-6 text-green-400 mb-2" />
                        <p className="text-sm text-gray-300">Eğitim tavsiyeleri</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <Star className="w-6 h-6 text-yellow-400 mb-2" />
                        <p className="text-sm text-gray-300">Motivasyon</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {(searchQuery ? filteredMessages : messages).map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.sender === 'user' 
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}>
                              {message.sender === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                              ) : (
                                <Bot className="w-4 h-4 text-white" />
                              )}
                            </div>
                            
                            <div className={`rounded-2xl px-4 py-3 ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30'
                                : 'bg-white/10 border border-white/20'
                            }`}>
                              <div className={`text-white leading-relaxed ${getFontSizeClass()}`}>
                                {renderMessageContent(message.content, message.attachments)}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                  {message.timestamp.toLocaleTimeString('tr-TR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                                <div className="flex items-center space-x-2">
                                  {/* Emoji Reactions */}
                                  {message.sender === 'ai' && (
                                    <div className="flex items-center space-x-1">
                                      {emojiReactions.map((reaction) => (
                                        <button
                                          key={reaction.emoji}
                                          onClick={() => handleEmojiReaction(message.id, reaction.emoji)}
                                          className="text-sm hover:scale-110 transition-transform p-1 rounded"
                                          title={reaction.label}
                                        >
                                          {reaction.emoji}
                                          {message.emojiReactions?.[reaction.emoji] && (
                                            <span className="ml-1 text-xs text-gray-400">
                                              {message.emojiReactions[reaction.emoji]}
                                            </span>
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {/* Favorite Button */}
                                  <button
                                    onClick={() => toggleFavorite(message.id)}
                                    className={`p-1 rounded transition-colors ${
                                      message.isFavorited
                                        ? 'text-yellow-400 bg-yellow-400/20'
                                        : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                                    }`}
                                    title={message.isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                                  >
                                    <Star className="w-3 h-3" />
                                  </button>
                                  
                                  {message.sender === 'ai' && (
                                    <>
                                      <button
                                        onClick={() => handleMessageFeedback(message.id, 'like')}
                                        className={`p-1 rounded transition-colors ${
                                          message.userFeedback === 'like'
                                            ? 'text-green-400 bg-green-400/20'
                                            : 'text-gray-400 hover:text-green-400 hover:bg-green-400/10'
                                        }`}
                                        title="Beğen"
                                      >
                                        <ThumbsUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleMessageFeedback(message.id, 'dislike')}
                                        className={`p-1 rounded transition-colors ${
                                          message.userFeedback === 'dislike'
                                            ? 'text-red-400 bg-red-400/20'
                                            : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                                        }`}
                                        title="Beğenme"
                                      >
                                        <ThumbsDown className="w-3 h-3" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => copyMessage(message.content, message.id)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                  >
                                    {copiedMessageId === message.id ? (
                                      <Check className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                  
                                  {/* Tag Button */}
                                  <button
                                    onClick={() => setShowTagSelector(showTagSelector === message.id ? null : message.id)}
                                    className="text-gray-400 hover:text-purple-400 transition-colors p-1"
                                    title="Etiket Ekle/Çıkar"
                                  >
                                    <Tag className="w-3 h-3" />
                                  </button>
                                  
                                  <button
                                    onClick={() => deleteMessage(message.id)}
                                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                                    title="Mesajı Sil"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  
                                  {/* Tag Selector */}
                                  {showTagSelector === message.id && (
                                    <div className="absolute top-full left-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl z-20 p-2 min-w-[200px]">
                                      <div className="text-xs text-gray-400 mb-2">Etiketler:</div>
                                      <div className="grid grid-cols-2 gap-1">
                                        {availableTags.map((tag) => {
                                          const isSelected = getMessageTags(message.id).includes(tag.id);
                                          const Icon = tag.icon;
                                          return (
                                            <button
                                              key={tag.id}
                                              onClick={() => toggleMessageTag(message.id, tag.id)}
                                              className={`flex items-center space-x-2 px-2 py-1 rounded text-xs transition-colors ${
                                                isSelected
                                                  ? `${tag.color} text-white`
                                                  : 'text-gray-300 hover:bg-white/10'
                                              }`}
                                            >
                                              <Icon className="w-3 h-3" />
                                              <span>{tag.name}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Display Tags */}
                                  {getMessageTags(message.id).length > 0 && (
                                    <div className="flex items-center space-x-1 mt-2">
                                      {getMessageTags(message.id).map((tagId) => {
                                        const tagInfo = getTagInfo(tagId);
                                        if (!tagInfo) return null;
                                        const Icon = tagInfo.icon;
                                        return (
                                          <span
                                            key={tagId}
                                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${tagInfo.color} text-white`}
                                          >
                                            <Icon className="w-3 h-3" />
                                            <span>{tagInfo.name}</span>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                
                {isChatLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-white/10 p-6">
                {/* AI Insights Results */}
                {currentMoodAnalysis && (
                  <div className="mb-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h3 className="text-sm font-medium text-white">Ruh Hali Analizi</h3>
                      </div>
                      <button
                        onClick={() => setCurrentMoodAnalysis(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">Ruh Hali:</span>
                        <span className={`text-sm font-medium ${
                          currentMoodAnalysis.mood === 'positive' ? 'text-green-400' :
                          currentMoodAnalysis.mood === 'negative' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {currentMoodAnalysis.mood === 'positive' ? '😊 Pozitif' :
                           currentMoodAnalysis.mood === 'negative' ? '😔 Negatif' : '😐 Nötr'}
                        </span>
                      </div>
                      {currentMoodAnalysis.emotions && (
                        <div>
                          <span className="text-sm text-gray-300">Duygular: </span>
                          <span className="text-sm text-purple-300">
                            {currentMoodAnalysis.emotions.join(', ')}
                          </span>
                        </div>
                      )}
                      {currentMoodAnalysis.suggestions && (
                        <div>
                          <span className="text-sm text-gray-300">Öneriler:</span>
                          <ul className="text-sm text-purple-300 ml-4 mt-1">
                            {currentMoodAnalysis.suggestions.map((suggestion: string, index: number) => (
                              <li key={index} className="list-disc">{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Smart Suggestions */}
                {smartSuggestions && (
                  <div className="mb-4 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-sm font-medium text-white">Akıllı Öneriler</h3>
                      </div>
                      <button
                        onClick={() => setSmartSuggestions(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {smartSuggestions.quickActions && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-300 block mb-2">Hızlı Eylemler:</span>
                        <div className="flex flex-wrap gap-2">
                          {smartSuggestions.quickActions.map((action: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => setInputMessage(action.text)}
                              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                            >
                              {action.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {smartSuggestions.followUpQuestions && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-300 block mb-2">Takip Soruları:</span>
                        <div className="space-y-1">
                          {smartSuggestions.followUpQuestions.map((question: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => setInputMessage(question)}
                              className="block w-full text-left px-3 py-2 bg-cyan-500/10 text-cyan-300 rounded-lg text-sm hover:bg-cyan-500/20 transition-colors"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Generated Content */}
                {generatedContent && (
                  <div className="mb-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-green-400" />
                        <h3 className="text-sm font-medium text-white">
                          {generatedContent.quiz ? '🧪 Quiz Hazırlandı' :
                           generatedContent.roadmap ? '🗺️ Yol Haritası Oluşturuldu' :
                           generatedContent.projects ? '🚀 Proje Fikirleri' :
                           generatedContent.interview ? '🎤 Mülakat Soruları' :
                           'Oluşturulan İçerik'}
                        </h3>
                      </div>
                      <button
                        onClick={() => setGeneratedContent(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <GeneratedContentDisplay content={generatedContent} />
                  </div>
                )}

                {/* Quick Actions */}
                {showQuickActions && (
                  <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-sm font-medium text-white">Hızlı İşlemler</h3>
                      </div>
                      <button
                        onClick={() => setShowQuickActions(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Gizle"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <button
                        onClick={() => handleQuickAction('career_change')}
                        className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Target className="w-4 h-4 text-orange-400" />
                        <span>Kariyer Değişimi</span>
                      </button>
                      <button
                        onClick={() => handleQuickAction('weekly_plan')}
                        className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Haftalık Plan</span>
                      </button>
                      <button
                        onClick={() => handleQuickAction('motivation')}
                        className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        <span>Motivasyon</span>
                      </button>
                      <button
                        onClick={() => handleQuickAction('interview_prep')}
                        className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                      >
                        <GraduationCap className="w-4 h-4 text-green-400" />
                        <span>Mülakat Hazırlığı</span>
                      </button>
                      <button
                        onClick={() => handleQuickAction('skill_assessment')}
                        className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span>Beceri Değerlendirme</span>
                      </button>
                      <button
                        onClick={() => handleQuickAction('learning_plan')}
                        className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                      >
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span>Öğrenme Planı</span>
                      </button>
                    </div>
                    
                    {/* AI Content Generation */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">🤖 AI İçerik Üreticisi</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => generateContent('quiz')}
                          disabled={showContentGenerator}
                          className="flex items-center space-x-2 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {showContentGenerator ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                          ) : (
                            <TestTube className="w-4 h-4 text-yellow-400" />
                          )}
                          <span>{showContentGenerator ? 'Oluşturuluyor...' : 'Quiz Oluştur'}</span>
                        </button>
                        
                        <button
                          onClick={() => generateContent('roadmap')}
                          className="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                        >
                          <Target className="w-4 h-4 text-green-400" />
                          <span>Yol Haritası</span>
                        </button>
                        
                        <button
                          onClick={() => generateContent('project_idea')}
                          className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                        >
                          <GraduationCap className="w-4 h-4 text-blue-400" />
                          <span>Proje Fikirleri</span>
                        </button>
                        
                        <button
                          onClick={() => generateContent('interview_prep')}
                          className="flex items-center space-x-2 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 rounded-lg text-white text-sm transition-all duration-200 hover:scale-105"
                        >
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span>Mülakat Hazırlığı</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!showQuickActions && (
                  <div className="mb-3">
                    <button
                      onClick={() => setShowQuickActions(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-all duration-200"
                    >
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Hızlı İşlemleri Göster</span>
                    </button>
                  </div>
                )}


                
                <div className="flex items-end space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Mesajınızı yazın... (Enter ile gönder, Shift+Enter ile yeni satır, / ile komutları görün)"
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                      rows={1}
                      maxLength={1000}
                    />
                    
                    {/* Command Suggestions */}
                    {showCommandSuggestions && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl z-20">
                        <div className="p-2">
                          <div className="text-xs text-gray-400 mb-2 px-2">Komut Önerileri:</div>
                          {commandSuggestions.map((command, index) => (
                            <button
                              key={index}
                              onClick={() => selectCommandSuggestion(command)}
                              className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center space-x-2"
                            >
                              <span className="text-cyan-400 font-mono">{command}</span>
                              <span className="text-gray-500 text-xs">
                                {command === '/help' && 'Yardım menüsü'}
                                {command === '/clear' && 'Sohbeti temizle'}
                                {command === '/roadmap' && 'Kariyer yol haritası'}
                                {command === '/casual' && 'Gündelik sohbet'}
                                {command === '/career' && 'Kariyer danışmanlığı'}
                                {command === '/education' && 'Eğitim & öğrenme'}
                                {command === '/technical' && 'Teknik destek'}
                                {command === '/profile' && 'Profil bilgileri'}
                                {command === '/progress' && 'İlerleme durumu'}
                                {command === '/stats' && 'İstatistikler'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isChatLoading}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:scale-105"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {inputMessage.length}/1000 karakter
                  </span>
                  <span className="text-xs text-gray-400">
                    Shift+Enter: Yeni satır | Enter: Gönder | /: Komutlar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 