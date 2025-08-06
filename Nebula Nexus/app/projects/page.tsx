'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star,
  MessageSquare,
  Calendar,
  Tag,
  UserPlus,
  Briefcase,
  Code,
  Palette,
  Database,
  Shield,
  Smartphone,
  Globe,
  Zap,
  Heart,
  Eye,
  Share2,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  teamSize: number;
  currentMembers: number;
  lookingFor: string; // JSON string
  tags: string; // JSON string
  location: string;
  duration: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
    level: string;
  };
  views: number;
  likes: number;
  isActive: boolean;
}

interface JobPosting {
  id: string;
  projectId: string;
  projectTitle: string;
  role: string;
  description: string;
  requirements: string; // JSON string
  skills: string; // JSON string
  commitment: 'part-time' | 'full-time' | 'flexible';
  duration: string;
  postedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  postedAt: string;
  applications: number;
  isActive: boolean;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'jobs'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'web',
    difficulty: 'beginner',
    teamSize: 5,
    duration: '',
    location: '',
    tags: '',
    lookingFor: ''
  });
  const [jobForm, setJobForm] = useState({
    role: 'Frontend Developer',
    description: '',
    commitment: 'flexible',
    duration: '',
    requirements: '',
    skills: ''
  });

  const categories = [
    { id: 'all', name: 'Tümü', icon: Globe },
    { id: 'web', name: 'Web Geliştirme', icon: Code },
    { id: 'mobile', name: 'Mobil Uygulama', icon: Smartphone },
    { id: 'ai', name: 'Yapay Zeka', icon: Zap },
    { id: 'design', name: 'UI/UX Tasarım', icon: Palette },
    { id: 'data', name: 'Veri Bilimi', icon: Database },
    { id: 'security', name: 'Siber Güvenlik', icon: Shield },
    { id: 'game', name: 'Oyun Geliştirme', icon: Heart }
  ];

  const difficulties = [
    { id: 'all', name: 'Tüm Seviyeler' },
    { id: 'beginner', name: 'Başlangıç' },
    { id: 'intermediate', name: 'Orta' },
    { id: 'advanced', name: 'İleri' }
  ];

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'UI/UX Designer',
    'Data Scientist',
    'DevOps Engineer',
    'QA Engineer',
    'Product Manager',
    'AI/ML Engineer',
    'Game Developer',
    'Security Engineer'
  ];

  useEffect(() => {
    loadProjects();
    loadJobPostings();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadJobPostings = async () => {
    try {
      const response = await fetch('/api/projects/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobPostings(data);
      }
    } catch (error) {
      console.error('Error loading job postings:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createForm,
          createdBy: user.id,
          tags: JSON.stringify(createForm.tags.split(',').map(tag => tag.trim())),
          lookingFor: JSON.stringify(createForm.lookingFor.split(',').map(role => role.trim()))
        })
      });

      if (response.ok) {
        toast.success('Proje başarıyla oluşturuldu!');
        setShowCreateModal(false);
        setCreateForm({
          title: '',
          description: '',
          category: 'web',
          difficulty: 'beginner',
          teamSize: 5,
          duration: '',
          location: '',
          tags: '',
          lookingFor: ''
        });
        loadProjects();
      } else {
        toast.error('Proje oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Proje oluşturulurken hata oluştu');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/projects/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobForm,
          postedBy: user.id,
          requirements: JSON.stringify(jobForm.requirements.split(',').map(req => req.trim())),
          skills: JSON.stringify(jobForm.skills.split(',').map(skill => skill.trim()))
        })
      });

      if (response.ok) {
        toast.success('İş ilanı başarıyla oluşturuldu!');
        setShowJobModal(false);
        setJobForm({
          role: 'Frontend Developer',
          description: '',
          commitment: 'flexible',
          duration: '',
          requirements: '',
          skills: ''
        });
        loadJobPostings();
      } else {
        toast.error('İş ilanı oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Error creating job posting:', error);
      toast.error('İş ilanı oluşturulurken hata oluştu');
    }
  };

  const filteredProjects = projects.filter(project => {
    const projectTags = project.tags ? JSON.parse(project.tags) : [];
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projectTags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredJobs = jobPostings.filter(job => {
    const jobSkills = job.skills ? JSON.parse(job.skills) : [];
    const matchesSearch = job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobSkills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Globe;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Proje Dayanışması</h2>
          <p className="text-purple-200 mb-8">Proje ekiplerine katılmak ve iş ilanlarını görmek için lütfen giriş yapın.</p>
          <Link href="/auth/signin" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mr-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                    Proje Dayanışması
                  </h1>
                  <div className="flex items-center space-x-4 text-purple-200">
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm border border-purple-500/30">
                      🚀 Aktif Projeler
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm border border-blue-500/30">
                      💼 İş İlanları
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm border border-green-500/30">
                      🤝 Dayanışma
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                Kullanıcılar birbirine yardım eder, proje ekipleri oluşturur ve ihtiyaç duydukları rolleri ilan eder.
                <span className="text-white font-semibold"> Birlikte daha güçlüyüz!</span>
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{projects.length}</div>
                  <div className="text-purple-200 text-sm">Aktif Proje</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{jobPostings.length}</div>
                  <div className="text-purple-200 text-sm">İş İlanı</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">∞</div>
                  <div className="text-purple-200 text-sm">Fırsat</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-2 shadow-xl">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              <span className="mr-2">Proje Ekipleri</span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {projects.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-5 h-5 mr-3" />
              <span className="mr-2">İş İlanları</span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {jobPostings.length}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    placeholder={activeTab === 'projects' ? '🔍 Proje ara...' : '🔍 İş ilanı ara...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 text-lg"
                  />
                </div>
              </div>

              {/* Filters */}
              {activeTab === 'projects' && (
                <div className="flex gap-4">
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 appearance-none pr-10"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id} className="bg-gray-800">
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 appearance-none pr-10"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty.id} value={difficulty.id} className="bg-gray-800">
                          {difficulty.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Buttons */}
              <div className="flex gap-3">
                {activeTab === 'projects' ? (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    <span>Proje Oluştur</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowJobModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    <span>İlan Ver</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'projects' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:border-purple-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl group"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {React.createElement(getCategoryIcon(project.category), { className: "w-7 h-7 text-white" })}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{project.title}</h3>
                        <p className="text-purple-300 text-sm capitalize">{project.category}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-2 rounded-xl text-sm font-semibold border ${getDifficultyBg(project.difficulty)} ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-300 text-base mb-6 line-clamp-3 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(() => {
                      const projectTags = project.tags ? JSON.parse(project.tags) : [];
                      return (
                        <>
                          {projectTags.slice(0, 3).map((tag: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-xl text-sm border border-purple-500/30">
                              #{tag}
                            </span>
                          ))}
                          {projectTags.length > 3 && (
                            <span className="px-3 py-1 bg-gray-600/30 text-gray-400 rounded-xl text-sm">
                              +{projectTags.length - 3}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">{project.currentMembers}/{project.teamSize} Üye</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-sm font-medium">{project.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-yellow-400" />
                      </div>
                      <span className="text-sm font-medium">{project.views} görüntüleme</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm text-white font-semibold">
                        {project.createdBy.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{project.createdBy.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                        {project.likes} beğeni
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:border-blue-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl group"
                  onClick={() => router.push(`/projects/${job.projectId}`)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{job.role}</h3>
                        <p className="text-blue-300 text-sm">{job.projectTitle}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-2 rounded-xl text-sm font-semibold border ${
                      job.commitment === 'full-time' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                      job.commitment === 'part-time' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                      'bg-green-500/20 border-green-500/30 text-green-400'
                    }`}>
                      {job.commitment}
                    </span>
                  </div>

                  <p className="text-gray-300 text-base mb-6 line-clamp-3 leading-relaxed">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(() => {
                      const jobSkills = job.skills ? JSON.parse(job.skills) : [];
                      return (
                        <>
                          {jobSkills.slice(0, 3).map((skill: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-sm border border-blue-500/30">
                              {skill}
                            </span>
                          ))}
                          {jobSkills.length > 3 && (
                            <span className="px-3 py-1 bg-gray-600/30 text-gray-400 rounded-xl text-sm">
                              +{jobSkills.length - 3}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-sm font-medium">{job.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">{job.applications} başvuru</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-sm text-white font-semibold">
                        {job.postedBy.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{job.postedBy.name}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/projects/${job.projectId}`);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Detayları Gör
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {!isLoading && (
          activeTab === 'projects' ? 
            (filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Henüz Proje Yok</h3>
                <p className="text-purple-200 mb-6">İlk projeyi oluşturarak başlayın!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Proje Oluştur
                </button>
              </motion.div>
            )) :
            (filteredJobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Briefcase className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Henüz İş İlanı Yok</h3>
                <p className="text-blue-200 mb-6">İlk iş ilanını vererek başlayın!</p>
                <button
                  onClick={() => setShowJobModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  İlan Ver
                </button>
              </motion.div>
            ))
                 )}

         {/* Create Project Modal */}
         {showCreateModal && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
             >
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-white">Yeni Proje Oluştur</h2>
                 <button
                   onClick={() => setShowCreateModal(false)}
                   className="text-gray-400 hover:text-white transition-colors"
                 >
                   <XCircle className="w-6 h-6" />
                 </button>
               </div>

               <form onSubmit={handleCreateProject} className="space-y-6">
                 <div>
                   <label className="block text-white font-semibold mb-2">Proje Adı</label>
                   <input
                     type="text"
                     placeholder="Proje adını girin..."
                     value={createForm.title}
                     onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-white font-semibold mb-2">Açıklama</label>
                   <textarea
                     placeholder="Proje açıklamasını girin..."
                     rows={4}
                     value={createForm.description}
                     onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-white font-semibold mb-2">Kategori</label>
                     <select 
                       value={createForm.category}
                       onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                       className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 transition-all duration-300"
                       required
                     >
                       {categories.slice(1).map(category => (
                         <option key={category.id} value={category.id} className="bg-gray-800">
                           {category.name}
                         </option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-white font-semibold mb-2">Zorluk</label>
                     <select 
                       value={createForm.difficulty}
                       onChange={(e) => setCreateForm({ ...createForm, difficulty: e.target.value })}
                       className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 transition-all duration-300"
                       required
                     >
                       {difficulties.slice(1).map(difficulty => (
                         <option key={difficulty.id} value={difficulty.id} className="bg-gray-800">
                           {difficulty.name}
                         </option>
                       ))}
                     </select>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-white font-semibold mb-2">Ekip Büyüklüğü</label>
                     <input
                       type="number"
                       min="2"
                       max="20"
                       placeholder="5"
                       value={createForm.teamSize}
                       onChange={(e) => setCreateForm({ ...createForm, teamSize: parseInt(e.target.value) })}
                       className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-white font-semibold mb-2">Süre</label>
                     <input
                       type="text"
                       placeholder="3-6 ay"
                       value={createForm.duration}
                       onChange={(e) => setCreateForm({ ...createForm, duration: e.target.value })}
                       className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                       required
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-white font-semibold mb-2">Konum</label>
                   <input
                     type="text"
                     placeholder="İstanbul, Türkiye"
                     value={createForm.location}
                     onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-white font-semibold mb-2">Etiketler (virgülle ayırın)</label>
                   <input
                     type="text"
                     placeholder="React, Node.js, MongoDB"
                     value={createForm.tags}
                     onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-white font-semibold mb-2">Aranan Roller (virgülle ayırın)</label>
                   <input
                     type="text"
                     placeholder="Frontend Developer, Backend Developer"
                     value={createForm.lookingFor}
                     onChange={(e) => setCreateForm({ ...createForm, lookingFor: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   />
                 </div>

                 <div className="flex space-x-4 pt-4">
                   <button
                     type="button"
                     onClick={() => setShowCreateModal(false)}
                     className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                   >
                     İptal
                   </button>
                   <button
                     type="submit"
                     className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                   >
                     Proje Oluştur
                   </button>
                 </div>
               </form>
             </motion.div>
           </div>
         )}

         {/* Create Job Modal */}
         {showJobModal && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
             >
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-white">İş İlanı Ver</h2>
                 <button
                   onClick={() => setShowJobModal(false)}
                   className="text-gray-400 hover:text-white transition-colors"
                 >
                   <XCircle className="w-6 h-6" />
                 </button>
               </div>

               <form onSubmit={handleCreateJob} className="space-y-6">
                 <div>
                   <label className="block text-white font-semibold mb-2">Pozisyon</label>
                   <select 
                     value={jobForm.role}
                     onChange={(e) => setJobForm({ ...jobForm, role: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   >
                     {roles.map(role => (
                       <option key={role} value={role} className="bg-gray-800">
                         {role}
                       </option>
                     ))}
                   </select>
                 </div>

                 <div>
                   <label className="block text-white font-semibold mb-2">Açıklama</label>
                   <textarea
                     placeholder="Pozisyon açıklamasını girin..."
                     rows={4}
                     value={jobForm.description}
                     onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-white font-semibold mb-2">Çalışma Şekli</label>
                     <select 
                       value={jobForm.commitment}
                       onChange={(e) => setJobForm({ ...jobForm, commitment: e.target.value })}
                       className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400 transition-all duration-300"
                       required
                     >
                       <option value="full-time" className="bg-gray-800">Tam Zamanlı</option>
                       <option value="part-time" className="bg-gray-800">Yarı Zamanlı</option>
                       <option value="flexible" className="bg-gray-800">Esnek</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-white font-semibold mb-2">Süre</label>
                     <input
                       type="text"
                       placeholder="3-6 ay"
                       value={jobForm.duration}
                       onChange={(e) => setJobForm({ ...jobForm, duration: e.target.value })}
                       className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                       required
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-white font-semibold mb-2">Gereksinimler (virgülle ayırın)</label>
                   <input
                     type="text"
                     placeholder="React deneyimi, Node.js bilgisi"
                     value={jobForm.requirements}
                     onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-white font-semibold mb-2">Yetenekler (virgülle ayırın)</label>
                   <input
                     type="text"
                     placeholder="JavaScript, TypeScript, React"
                     value={jobForm.skills}
                     onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                     className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                     required
                   />
                 </div>

                 <div className="flex space-x-4 pt-4">
                   <button
                     type="button"
                     onClick={() => setShowJobModal(false)}
                     className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                   >
                     İptal
                   </button>
                   <button
                     type="submit"
                     className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                   >
                     İlan Ver
                   </button>
                 </div>
               </form>
             </motion.div>
           </div>
         )}
       </div>
     </div>
   );
 } 