'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Home, 
  Brain, 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  Users, 
  HelpCircle, 
  FileText,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Target,
  Mail,
  ChevronDown,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import GlobalSearch from '@/components/ui/GlobalSearch';

// NavLink bileşeni - En üstte tanımlanmalı
const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(window.location.pathname === href);
  }, [href]);

  return (
    <Link href={href}>
      <motion.div
        className={`relative px-6 py-4 rounded-xl transition-all duration-300 group ${
          isActive 
            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 shadow-lg' 
            : 'hover:bg-gray-800/50 hover:shadow-lg'
        }`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className={`w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-md`}
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-4 h-4 text-white" />
          </motion.div>
          <span className={`font-bold text-base transition-colors ${
            isActive ? 'text-cyan-400' : 'text-gray-300 group-hover:text-white'
          }`}>
            {label}
          </span>
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-cyan-400 rounded-full shadow-lg"
            layoutId="activeTab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
        />
      </motion.div>
    </Link>
  );
};

export default function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigation = [
    { name: 'Ana Sayfa', href: '/', icon: Home, color: 'from-cyan-400 to-blue-500' },
    { name: 'AI Analiz', href: '/test', icon: Brain, color: 'from-purple-400 to-pink-500' },
    { name: 'AI Sohbet', href: '/chat', icon: MessageSquare, color: 'from-green-400 to-emerald-500' },
    { name: 'Kaynaklar', href: '/resources', icon: BookOpen, color: 'from-yellow-400 to-orange-500' },
    { name: 'Proje Dayanışması', href: '/projects', icon: Users, color: 'from-purple-400 to-pink-500' },
    { name: 'Mesajlar', href: '/messages', icon: Mail, color: 'from-blue-400 to-cyan-500' },
    { name: 'Hakkımızda', href: '/about', icon: Users, color: 'from-indigo-400 to-purple-500' },
    { name: 'SSS', href: '/faq', icon: HelpCircle, color: 'from-pink-400 to-rose-500' },
    { name: 'Blog', href: '/blog', icon: FileText, color: 'from-teal-400 to-cyan-500' },
  ];

     const userMenuItems = [
     { name: 'Panel', href: '/dashboard', icon: BarChart3, color: 'from-cyan-400 to-blue-500' },
     { name: 'Mesajlar', href: '/messages', icon: Mail, color: 'from-blue-400 to-cyan-500' },
     { name: 'Profil', href: '/dashboard/profile', icon: User, color: 'from-purple-400 to-pink-500' },
     { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings, color: 'from-green-400 to-emerald-500' },
   ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const currentTab = navigation.find(item => item.href === path)?.name || 'home';
    setActiveTab(currentTab);
  }, [navigation]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Updated dropdown components with global state
  const AIDropdown = () => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      const path = window.location.pathname;
      setIsActive(['/test', '/chat', '/career-roadmap'].includes(path));
    }, []);

    const aiFeatures = [
      { name: 'AI Analiz', href: '/test', icon: Brain, description: 'Kişilik ve yetenek analizi' },
      { name: 'AI Chat', href: '/chat', icon: MessageSquare, description: 'AI mentor ile sohbet' },
      { name: 'Kariyer Yolu', href: '/career-roadmap', icon: Target, description: 'Kişiselleştirilmiş kariyer planı' },
    ];

    const isOpen = openDropdown === 'ai';

    return (
      <div className="relative group dropdown-container">
        <motion.button
          className={`relative px-6 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
            isActive 
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 shadow-lg' 
              : 'hover:bg-gray-800/50 hover:shadow-lg'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpenDropdown(isOpen ? null : 'ai')}
        >
          <motion.div 
            className={`w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-md`}
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="w-4 h-4 text-white" />
          </motion.div>
          <span className={`font-bold text-base transition-colors ${
            isActive ? 'text-cyan-400' : 'text-gray-300 group-hover:text-white'
          }`}>
            Nebula AI
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-white font-bold text-lg mb-1">AI Özellikleri</h3>
                  <p className="text-gray-400 text-sm">Yapay zeka destekli kariyer rehberliği</p>
                </div>
                
                <div className="space-y-2">
                  {aiFeatures.map((feature, index) => (
                    <Link key={feature.name} href={feature.href} onClick={() => setOpenDropdown(null)}>
                      <motion.div
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-md">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                            {feature.name}
                          </p>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ResourcesDropdown = () => {
    const [isActive, setIsActive] = useState(false);

         useEffect(() => {
       const path = window.location.pathname;
       setIsActive(['/resources', '/blog', '/forum', '/projects'].includes(path));
     }, []);

         const resourcesFeatures = [
       { name: 'Eğitim Kaynakları', href: '/resources', icon: BookOpen, description: 'Kişiselleştirilmiş eğitim önerileri' },
       { name: 'Proje Dayanışması', href: '/projects', icon: Users, description: 'Ekip kur, iş ilanı ver' },
       { name: 'Blog', href: '/blog', icon: FileText, description: 'Platform özellikleri ve rehberler' },
       { name: 'Topluluk', href: '/forum', icon: Users, description: 'Forum, soru-cevap ve deneyim paylaşımı' },
     ];

    const isOpen = openDropdown === 'resources';

    return (
      <div className="relative group dropdown-container">
        <motion.button
          className={`relative px-6 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
            isActive 
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 shadow-lg' 
              : 'hover:bg-gray-800/50 hover:shadow-lg'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpenDropdown(isOpen ? null : 'resources')}
        >
          <motion.div 
            className={`w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-md`}
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <BookOpen className="w-4 h-4 text-white" />
          </motion.div>
          <span className={`font-bold text-base transition-colors ${
            isActive ? 'text-cyan-400' : 'text-gray-300 group-hover:text-white'
          }`}>
            Kaynaklar
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-white font-bold text-lg mb-1">Eğitim & İçerik</h3>
                  <p className="text-gray-400 text-sm">Kariyer gelişimi için kaynaklar</p>
                </div>
                
                <div className="space-y-2">
                  {resourcesFeatures.map((feature, index) => (
                    <Link key={feature.name} href={feature.href} onClick={() => setOpenDropdown(null)}>
                      <motion.div
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-md">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                            {feature.name}
                          </p>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const SupportDropdown = () => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      const path = window.location.pathname;
      setIsActive(['/faq', '/contact'].includes(path));
    }, []);

    const supportFeatures = [
      { name: 'SSS', href: '/faq', icon: HelpCircle, description: 'Sık sorulan sorular' },
      { name: 'İletişim', href: '/contact', icon: Mail, description: 'Bizimle iletişime geçin' },
    ];

    const isOpen = openDropdown === 'support';

    return (
      <div className="relative group dropdown-container">
        <motion.button
          className={`relative px-6 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
            isActive 
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 shadow-lg' 
              : 'hover:bg-gray-800/50 hover:shadow-lg'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpenDropdown(isOpen ? null : 'support')}
        >
          <motion.div 
            className={`w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-md`}
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <HelpCircle className="w-4 h-4 text-white" />
          </motion.div>
          <span className={`font-bold text-base transition-colors ${
            isActive ? 'text-cyan-400' : 'text-gray-300 group-hover:text-white'
          }`}>
            Destek
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-white font-bold text-lg mb-1">Yardım & Destek</h3>
                  <p className="text-gray-400 text-sm">Size nasıl yardımcı olabiliriz?</p>
                </div>
                
                <div className="space-y-2">
                  {supportFeatures.map((feature, index) => (
                    <Link key={feature.name} href={feature.href} onClick={() => setOpenDropdown(null)}>
                      <motion.div
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-md">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                            {feature.name}
                          </p>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center w-full">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <Link href="/">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center ai-glow"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Brain className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <motion.h1 
                      className="text-2xl font-black text-white ai-text-glow"
                      animate={{ opacity: [1, 0.8, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      NEBULA NEXUS
                    </motion.h1>
                    <p className="text-xs text-cyan-400 font-medium">AI Kariyer Zekası</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

                     {/* Navigation - Center, fills available space */}
           <nav className="flex-1 flex justify-center items-center space-x-3">
             <NavLink href="/" icon={Home} label="Ana Sayfa" />
             <AIDropdown />
             <ResourcesDropdown />
             <SupportDropdown />
           </nav>

          {/* User Menu - Right */}
          <div className="flex-shrink-0 flex items-center space-x-4">
            <GlobalSearch />
            {user ? (
              <div className="relative dropdown-container">
                <motion.button
                  className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
                >
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center ai-glow"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="text-white font-medium">{user.name}</span>
                  <motion.div
                    animate={{ rotate: openDropdown === 'user' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </motion.button>
                
                {/* Enhanced Dropdown Menu */}
                <AnimatePresence>
                  {openDropdown === 'user' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-64 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        {userMenuItems.map((item, index) => (
                          <Link key={item.name} href={item.href} onClick={() => setOpenDropdown(null)}>
                            <motion.div
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-300"
                              whileHover={{ x: 5 }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                                <item.icon className="w-3 h-3 text-white" />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </motion.div>
                          </Link>
                        ))}
                        
                        <div className="border-t border-gray-700 my-2" />
                        
                        <motion.button
                          onClick={() => {
                            logout();
                            setOpenDropdown(null);
                          }}
                          className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-all duration-300"
                          whileHover={{ x: 5 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
                            <LogOut className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium">Çıkış Yap</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Link href="/auth/signin">
                  <motion.button
                    className="btn-ai-secondary px-6 py-3 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Giriş Yap</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent"
                      initial={{ x: -100 }}
                      whileHover={{ x: 100 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>
                </Link>
                <Link href="/auth/signup">
                  <motion.button
                    className="btn-ai-primary px-6 py-3 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Kayıt Ol</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: -100 }}
                      whileHover={{ x: 100 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 hover:from-gray-800/80 hover:to-gray-700/80 border border-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-cyan-500/30 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === item.name 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' 
                        : 'hover:bg-gray-800/50'
                    }`}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className={`font-medium ${
                        activeTab === item.name ? 'text-cyan-400' : 'text-gray-300'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {!user && (
                <div className="pt-4 space-y-3">
                  <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full btn-ai-secondary">
                      Giriş Yap
                    </button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full btn-ai-primary">
                      Kayıt Ol
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
} 