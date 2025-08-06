'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Target, 
  Users, 
  Star, 
  ArrowRight, 
  Play,
  Sparkles,
  Rocket,
  Code,
  Cpu,
  Network,
  Database,
  Shield,
  Globe,
  Terminal,
  Eye,
  Activity,
  Layers,
  Hexagon,
  BarChart3,
  TrendingUp,
  Award,
  Loader2,
  CheckCircle,
  X,
  Menu,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useScrollObserver } from '@/hooks/useScrollObserver';
import { BackgroundEffects } from '@/components/effects/BackgroundEffects';

// 3D Parallax Mouse Follower
const ParallaxMouseFollower = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ x: cursorX, y: cursorY }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Trailing cursor */}
      <motion.div
        className="fixed w-4 h-4 bg-cyan-400 rounded-full pointer-events-none z-40 opacity-50"
        style={{ 
          x: useTransform(cursorX, (x) => x - 4),
          y: useTransform(cursorY, (y) => y - 4)
        }}
      />
    </>
  );
};

// Liquid Morphing Background
const LiquidMorphingBackground = () => {
  const [morphValue, setMorphValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphValue(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ff0080" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,50 Q 25,${30 + morphValue * 0.4} 50,${40 + morphValue * 0.2} T 100,${60 + morphValue * 0.3} L 100,100 L 0,100 Z`}
          fill="url(#liquidGradient)"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
    </div>
  );
};

// AI Particle System - Geliştirilmiş
const AIParticleSystem = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, size: number, color: string, speed: number}>>([]);

  useEffect(() => {
    const colors = ['#00d4ff', '#ff0080', '#00ff88', '#ff8800', '#8800ff'];
    const newParticles = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 30,
      size: Math.random() * 5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 10 + 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="ai-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="ai-particle"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`
          }}
          animate={{
            y: [-20, -1000],
            x: [0, Math.random() * 100 - 50],
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Neural Network Grid - Geliştirilmiş
const NeuralNetworkGrid = () => {
  return (
    <div className="neural-grid" />
  );
};

// AI Loading Screen Component
const AILoadingScreen = ({ isLoading, onComplete }: { isLoading: boolean, onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(onComplete, 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-8"
        >
          <Loader2 className="w-full h-full text-cyan-400" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-4 ai-text-glow">
          AI Sistemi Başlatılıyor...
        </h2>
        
        <div className="w-80 h-3 bg-gray-800 rounded-full overflow-hidden mx-auto mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <p className="text-gray-400">
          %{Math.round(progress)} Tamamlandı
        </p>
        
        <div className="mt-8 space-y-2">
          {progress > 20 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center text-green-400"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              OCEAN modeli yüklendi
            </motion.div>
          )}
          {progress > 50 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center text-green-400"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              AI modelleri hazırlandı
            </motion.div>
          )}
          {progress > 80 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center text-green-400"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Sistem optimizasyonu tamamlandı
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="ai-panel max-w-2xl w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white ai-text-glow">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalChats: 0
  });

  // Scroll observers for animations
  const heroObserver = useScrollObserver();
  const statsObserver = useScrollObserver();
  const techObserver = useScrollObserver();
  const featuresObserver = useScrollObserver();
  const testimonialsObserver = useScrollObserver();
  const ctaObserver = useScrollObserver();

  const features = [
    {
      title: "OCEAN Kişilik Analizi",
      description: "Beş faktör kişilik modeli ile bilimsel kişilik değerlendirmesi",
      icon: Brain,
      color: "from-cyan-400 to-blue-500",
      tech: ["OCEAN Model", "Psikometrik Test", "Bilimsel Doğruluk"]
    },
    {
      title: "AI Kariyer Rehberi",
      description: "Google Gemini AI ile kişiselleştirilmiş kariyer önerileri",
      icon: Zap,
      color: "from-purple-400 to-pink-500",
      tech: ["Gemini AI", "Doğal Dil İşleme", "Kişiselleştirme"]
    },
    {
      title: "O*NET Entegrasyonu",
      description: "ABD İş ve İstatistik Bürosu'nun güvenilir meslek verileri",
      icon: Database,
      color: "from-green-400 to-emerald-500",
      tech: ["O*NET Database", "Meslek Verileri", "Piyasa Analizi"]
    },
    {
      title: "Proje Dayanışması",
      description: "Kariyer alanınızda proje takımları oluşturun",
      icon: Users,
      color: "from-orange-400 to-red-500",
      tech: ["Takım Çalışması", "Proje Yönetimi", "İşbirliği"]
    }
  ];

  const stats = [
    { number: systemStats.totalUsers.toString(), label: "Kayıtlı Kullanıcı", icon: Brain, color: "from-cyan-400 to-blue-500" },
    { number: systemStats.totalTests.toString(), label: "Tamamlanan Test", icon: Star, color: "from-yellow-400 to-orange-500" },
    { number: systemStats.totalChats.toString(), label: "AI Sohbet", icon: Code, color: "from-green-400 to-emerald-500" },
    { number: "30+", label: "Kariyer Alanı", icon: Target, color: "from-purple-400 to-pink-500" }
  ];

  const systemFeatures = [
    {
      name: "OCEAN Kişilik Testi",
      role: "Bilimsel Analiz",
      content: "Beş faktör kişilik modeli ile kişiliğinizi analiz edin ve kariyer uyumluluğunuzu keşfedin.",
      avatar: "OC",
      company: "Bilimsel Doğruluk"
    },
    {
      name: "AI Kariyer Rehberi",
      role: "Yapay Zeka Destekli",
      content: "Google Gemini AI ile kişiselleştirilmiş kariyer önerileri ve yol haritası alın.",
      avatar: "AI",
      company: "Gemini AI"
    },
    {
      name: "O*NET Entegrasyonu",
      role: "Meslek Veritabanı",
      content: "ABD İş ve İstatistik Bürosu'nun güvenilir meslek verileri ile bilimsel kariyer rehberliği.",
      avatar: "ON",
      company: "O*NET Database"
    },
    {
      name: "Proje Dayanışması",
      role: "İşbirliği Platformu",
      content: "Kariyer alanınızda proje takımları oluşturun ve gerçek dünya deneyimi kazanın.",
      avatar: "PD",
      company: "Takım Çalışması"
    },
    {
      name: "Forum Topluluğu",
      role: "Bilgi Paylaşımı",
      content: "Kariyer alanınızdaki uzmanlarla bağlantı kurun ve deneyimlerinizi paylaşın.",
      avatar: "FT",
      company: "Topluluk"
    },
    {
      name: "Mesajlaşma Sistemi",
      role: "İletişim Platformu",
      content: "Diğer kullanıcılarla doğrudan iletişim kurun ve kariyer fırsatlarını keşfedin.",
      avatar: "MS",
      company: "İletişim"
    }
  ];

  const technologies = [
    { name: "OCEAN Model", icon: Brain, description: "Beş faktör kişilik teorisi" },
    { name: "Gemini AI", icon: Terminal, description: "Google'ın gelişmiş AI modeli" },
    { name: "O*NET Database", icon: Eye, description: "ABD meslek veritabanı" },
    { name: "Next.js", icon: Database, description: "Modern web framework" },
    { name: "Prisma ORM", icon: Cpu, description: "Veritabanı yönetimi" },
    { name: "Tailwind CSS", icon: Globe, description: "Modern UI framework" }
  ];

  const steps = [
    {
      step: "01",
      title: "OCEAN Testi",
      description: "Beş faktör kişilik modeli ile bilimsel kişilik değerlendirmesi yapın",
      icon: Brain,
      color: "from-cyan-400 to-blue-500"
    },
    {
      step: "02",
      title: "AI Analizi",
      description: "Google Gemini AI ile kişiliğinize uygun kariyer alanları analiz edilir",
      icon: Cpu,
      color: "from-purple-400 to-pink-500"
    },
    {
      step: "03",
      title: "O*NET Eşleştirme",
      description: "O*NET veritabanından kişiliğinize en uygun meslekler önerilir",
      icon: Database,
      color: "from-green-400 to-emerald-500"
    },
    {
      step: "04",
      title: "Kariyer Yolu",
      description: "Kişiselleştirilmiş kariyer yol haritası ve öneriler alın",
      icon: Network,
      color: "from-orange-400 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  // Fetch real system statistics
  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        const response = await fetch('/api/admin/analytics?range=30d');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSystemStats({
              totalUsers: data.analytics.totalUsers || 0,
              totalTests: data.analytics.totalTests || 0,
              totalChats: data.analytics.totalChats || 0
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
      }
    };

    fetchSystemStats();
  }, []);

  const handleFeatureClick = (feature: { title: string; description: string; icon: React.ComponentType<{ className?: string }>; tech: string[] }) => {
    setModalContent({
      title: feature.title,
      content: `${feature.description}\n\nTeknolojiler: ${feature.tech.join(', ')}`
    });
    setShowModal(true);
  };

  return (
    <>
      <AILoadingScreen 
        isLoading={isLoading} 
        onComplete={() => setIsLoading(false)} 
      />
      
      <div className="min-h-screen ai-gradient-bg relative overflow-hidden">
        <BackgroundEffects />
        <LiquidMorphingBackground />
        <AIParticleSystem />
        <NeuralNetworkGrid />
        <ParallaxMouseFollower />
        
        <Header />
        
        {/* Hero Section - Geliştirilmiş */}
        <section ref={heroObserver.elementRef} className="relative pt-40 pb-48 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-24"
            >
              <motion.div 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full mb-10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Cpu className="w-6 h-6 text-cyan-400 mr-4" />
                <span className="text-cyan-400 text-lg font-medium">Yeni Nesil AI Kariyer Zekası</span>
                <Sparkles className="w-5 h-5 text-purple-400 ml-4" />
              </motion.div>
              
              <motion.h1 
                className="text-7xl md:text-9xl font-black mb-10"
                animate={{ 
                  textShadow: [
                    '0 0 20px rgba(0, 212, 255, 0.8)',
                    '0 0 30px rgba(255, 0, 128, 0.8)',
                    '0 0 20px rgba(0, 212, 255, 0.8)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="ai-text-glow text-white">NEBULA</span>
                <br />
                <span className="ai-text-glow text-cyan-400">NEXUS</span>
              </motion.h1>
              
              <div className="text-3xl md:text-4xl text-gray-300 mb-10 font-light">
                <motion.span 
                  className="ai-typing"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Gelişmiş AI Destekli Kariyer Rehberlik Sistemi
                </motion.span>
              </div>
              
              <p className="text-2xl text-gray-400 max-w-5xl mx-auto mb-16 leading-relaxed">
                OCEAN kişilik modeli, O*NET veri entegrasyonu ve Google Gemini AI ile 
                bilimsel olarak doğru ve kişiselleştirilmiş kariyer rehberliği.
              </p>
              
              <div className="flex justify-center">
                <Link href="/test">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-ai-primary text-xl px-14 py-6 flex items-center relative overflow-hidden"
                  >
                    <Play className="w-7 h-7 mr-4" />
                    AI Analizini Başlat
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Floating AI Feature Card - Geliştirilmiş */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              <motion.div 
                className="hologram-card p-16 relative overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleFeatureClick(features[currentFeature])}
              >
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-center justify-center mb-10">
                    <motion.div 
                      className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${features[currentFeature].color} flex items-center justify-center mr-8 ai-glow mb-6 lg:mb-0`}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      {React.createElement(features[currentFeature].icon, { className: "w-12 h-12 text-white" })}
                    </motion.div>
                    <div className="text-center lg:text-left">
                      <h3 className="text-4xl font-bold text-white mb-4">{features[currentFeature].title}</h3>
                      <p className="text-gray-300 text-xl mb-6">{features[currentFeature].description}</p>
                      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        {features[currentFeature].tech.map((tech, index) => (
                          <motion.span 
                            key={index} 
                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AI Stats Section - Geliştirilmiş */}
        <section ref={statsObserver.elementRef} className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="ai-card text-center floating-3d glass-morphism card-3d magnetic-card ripple"
              whileHover={{ y: -10, scale: 1.05 }}
                >
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-8 ai-glow`}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <stat.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.div 
                    className="text-6xl font-black text-white mb-4 ai-text-glow"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-400 text-lg uppercase tracking-wider font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Technology Stack - Geliştirilmiş */}
        <section ref={techObserver.elementRef} className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-6xl md:text-7xl font-black mb-8">
                <span className="ai-text-glow text-white">Kullanılan</span>
                <br />
                <span className="ai-text-glow text-cyan-400">Teknolojiler</span>
              </h2>
              <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
                Modern web teknolojileri ve güvenilir AI sistemleri ile geliştirildi
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="ai-card group data-flow"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mb-8 ai-glow"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <tech.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-6">{tech.name}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Features Section - Geliştirilmiş */}
        <section ref={featuresObserver.elementRef} className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-6xl md:text-7xl font-black mb-8">
                <span className="ai-text-glow text-white">Gelişmiş AI</span>
                <br />
                <span className="ai-text-glow text-cyan-400">Yetenekleri</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="ai-panel p-12 relative"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <motion.div 
                    className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-black font-black text-2xl ai-glow"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    {step.step}
                  </motion.div>
                  <motion.div 
                    className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-4xl flex items-center justify-center mb-10 ai-glow`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <step.icon className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-4xl font-bold text-white mb-8">{step.title}</h3>
                  <p className="text-gray-300 text-xl leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Testimonials - Geliştirilmiş */}
        <section ref={testimonialsObserver.elementRef} className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-6xl md:text-7xl font-black mb-8">
                <span className="ai-text-glow text-white">Sistem</span>
                <br />
                <span className="ai-text-glow text-cyan-400">Özellikleri</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {systemFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="ai-card relative"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="absolute -top-6 -left-6 text-8xl text-cyan-500/30 font-black">"</div>
                  <p className="text-gray-300 mb-10 leading-relaxed text-xl relative z-10">{feature.content}</p>
                  <div className="flex items-center">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-8 ai-glow"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.avatar}
                    </motion.div>
                    <div>
                      <h4 className="text-white font-bold text-2xl">{feature.name}</h4>
                      <p className="text-cyan-400 font-medium text-lg">{feature.role}</p>
                      <p className="text-gray-500">{feature.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI CTA Section - Geliştirilmiş */}
        <section ref={ctaObserver.elementRef} className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hologram-card text-center p-20 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative z-10">
                <h2 className="text-6xl md:text-7xl font-black mb-10">
                  <span className="ai-text-glow text-white">Nebula Nexus</span>
                  <br />
                  <span className="ai-text-glow text-cyan-400">Kariyer Platformu</span>
                  <br />
                  <span className="ai-text-glow text-white">Sizi Bekliyor</span>
                </h2>
                <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto">
                  OCEAN kişilik testi, AI destekli kariyer rehberliği ve O*NET veritabanı ile bilimsel kariyer yolculuğunuza başlayın
                </p>
                <Link href="/test">
                  <motion.button
                    whileHover={{ 
                      scale: 1.08, 
                      y: -5
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-ai-primary text-2xl px-16 py-8 flex items-center mx-auto relative overflow-hidden"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(0, 212, 255, 0.5)",
                        "0 0 40px rgba(255, 0, 128, 0.5)",
                        "0 0 20px rgba(0, 212, 255, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="w-8 h-8 mr-5" />
                    AI Analizini Başlat
                    <Sparkles className="w-8 h-8 ml-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
      >
        <div className="text-gray-300 leading-relaxed">
          {modalContent.content.split('\n').map((line, index) => (
            <p key={index} className="mb-4">{line}</p>
          ))}
        </div>
      </Modal>
    </>
  );
} 