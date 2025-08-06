'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Brain, 
  MessageSquare, 
  Target, 
  User, 
  BookOpen,
  Settings,
  FileText,
  Star,
  Clock,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

interface SearchResult {
  id: string;
  type: 'test' | 'chat' | 'career' | 'user' | 'resource' | 'setting';
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  score: number;
  metadata?: {
    date?: string;
    category?: string;
    tags?: string[];
  };
}

interface SearchFilters {
  type: string[];
  dateRange: string;
  category: string[];
}

export default function GlobalSearch() {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    dateRange: 'all',
    category: []
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: filters.type.join(','),
        dateRange: filters.dateRange,
        category: filters.category.join(',')
      });

      const response = await fetch(`/api/search?${params}`);

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        console.error('Search API error:', response.status);
        // Fallback to empty results instead of mock
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to empty results instead of mock
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters]);



  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'test': return 'Test';
      case 'chat': return 'Sohbet';
      case 'career': return 'Kariyer';
      case 'user': return 'Profil';
      case 'resource': return 'Kaynak';
      case 'setting': return 'Ayar';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'test': return 'bg-purple-500/20 text-purple-400';
      case 'chat': return 'bg-blue-500/20 text-blue-400';
      case 'career': return 'bg-green-500/20 text-green-400';
      case 'user': return 'bg-cyan-500/20 text-cyan-400';
      case 'resource': return 'bg-yellow-500/20 text-yellow-400';
      case 'setting': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Ara...</span>
        <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs bg-gray-700 rounded border border-gray-600">
          Ctrl+K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          >
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl mx-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl"
            >
              {/* Search Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Test sonuçları, sohbetler, kariyer önerileri ara..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors ${
                      showFilters ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-700"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Type Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Tür</label>
                          <div className="space-y-2">
                            {['test', 'chat', 'career', 'user', 'resource'].map((type) => (
                              <label key={type} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={filters.type.includes(type)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFilters(prev => ({ ...prev, type: [...prev.type, type] }));
                                    } else {
                                      setFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }));
                                    }
                                  }}
                                  className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                                />
                                <span className="text-sm text-gray-300 capitalize">{getTypeLabel(type)}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Date Range */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Tarih</label>
                          <select
                            value={filters.dateRange}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                          >
                            <option value="all">Tümü</option>
                            <option value="today">Bugün</option>
                            <option value="week">Bu Hafta</option>
                            <option value="month">Bu Ay</option>
                            <option value="year">Bu Yıl</option>
                          </select>
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                          <select
                            value={filters.category[0] || ''}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              category: e.target.value ? [e.target.value] : [] 
                            }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                          >
                            <option value="">Tümü</option>
                            <option value="Test">Test</option>
                            <option value="Sohbet">Sohbet</option>
                            <option value="Kariyer">Kariyer</option>
                            <option value="Ayarlar">Ayarlar</option>
                            <option value="Kaynaklar">Kaynaklar</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Aranıyor...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-white">{result.title}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(result.type)}`}>
                                {getTypeLabel(result.type)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-300">{result.description}</p>
                            {result.metadata && (
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                                {result.metadata.date && (
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {result.metadata.date}
                                  </span>
                                )}
                                {result.metadata.category && (
                                  <span className="flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    {result.metadata.category}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : query ? (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Sonuç bulunamadı</p>
                    <p className="text-sm text-gray-500 mt-1">Farklı anahtar kelimeler deneyin</p>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Arama yapmak için yazmaya başlayın</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center justify-center space-x-1">
                        <Brain className="w-3 h-3" />
                        <span>Test Sonuçları</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>Sohbetler</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>Kariyer</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Kaynaklar</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 