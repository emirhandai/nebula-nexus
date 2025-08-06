'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Clock, 
  Tag, 
  Star,
  MessageSquare,
  Calendar,
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
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Mail,
  Phone,
  Github,
  Linkedin,
  Globe as GlobeIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

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
    image?: string;
  };
  views: number;
  likes: number;
  isActive: boolean;
  members: {
    id: string;
    role: string;
    joinedAt: string;
    user: {
      id: string;
      name: string;
      image?: string;
    };
  }[];
  jobPostings: JobPosting[];
}

interface JobPosting {
  id: string;
  role: string;
  description: string;
  requirements: string; // JSON string
  skills: string; // JSON string
  commitment: 'part-time' | 'full-time' | 'flexible';
  duration: string;
  postedBy: {
    id: string;
    name: string;
    image?: string;
  };
  postedAt: string;
  applications: number;
  isActive: boolean;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    portfolio: '',
    experience: ''
  });
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  });

  const projectId = params.id as string;

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        toast.error('Proje bulunamadı');
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Proje yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (job: JobPosting) => {
    if (!isAuthenticated) {
      toast.error('Başvuru yapmak için giriş yapmalısınız');
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    if (!selectedJob || !user) return;

    try {
      const response = await fetch('/api/projects/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobPostingId: selectedJob.id,
          applicantId: user.id,
          coverLetter: applicationForm.coverLetter,
          portfolio: applicationForm.portfolio,
          experience: applicationForm.experience
        })
      });

      if (response.ok) {
        toast.success('Başvurunuz başarıyla gönderildi!');
        setShowApplicationModal(false);
        setApplicationForm({ coverLetter: '', portfolio: '', experience: '' });
        loadProject(); // Refresh to update application count
      } else {
        toast.error('Başvuru gönderilirken hata oluştu');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Başvuru gönderilirken hata oluştu');
    }
  };

  const handleMessageOwner = () => {
    if (!isAuthenticated) {
      toast.error('Mesaj göndermek için giriş yapmalısınız');
      return;
    }
    setShowMessageModal(true);
  };

  const submitMessage = async () => {
    if (!project || !user) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: project.createdBy.id,
          subject: messageForm.subject,
          content: messageForm.message,
          projectId: project.id
        })
      });

      if (response.ok) {
        toast.success('Mesajınız başarıyla gönderildi!');
        setShowMessageModal(false);
        setMessageForm({ subject: '', message: '' });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Mesaj gönderilirken hata oluştu');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj gönderilirken hata oluştu');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return Code;
      case 'mobile': return Smartphone;
      case 'ai': return Zap;
      case 'design': return Palette;
      case 'data': return Database;
      case 'security': return Shield;
      case 'game': return Heart;
      default: return Globe;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCommitmentColor = (commitment: string) => {
    switch (commitment) {
      case 'full-time': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'part-time': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'flexible': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Proje Bulunamadı</h2>
          <p className="text-purple-200 mb-6">Aradığınız proje mevcut değil veya kaldırılmış olabilir.</p>
          <button
            onClick={() => router.push('/projects')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Projelere Dön
          </button>
        </div>
      </div>
    );
  }

  const projectTags = project.tags ? JSON.parse(project.tags) : [];
  const lookingFor = project.lookingFor ? JSON.parse(project.lookingFor) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center text-purple-300 hover:text-white transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Projelere Dön
          </button>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    {React.createElement(getCategoryIcon(project.category), { className: "w-8 h-8 text-white" })}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h1>
                    <div className="flex items-center space-x-4 text-purple-200">
                      <span className="capitalize">{project.category}</span>
                      <span>•</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed mb-6">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {projectTags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Users className="w-5 h-5" />
                    <span>{project.currentMembers}/{project.teamSize} Üye</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="w-5 h-5" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Clock className="w-5 h-5" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Eye className="w-5 h-5" />
                    <span>{project.views} görüntüleme</span>
                  </div>
                </div>
              </div>

              <div className="lg:ml-8 mt-6 lg:mt-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Proje Sahibi</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {project.createdBy.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{project.createdBy.name}</p>
                      <p className="text-purple-200 text-sm">Proje Sahibi</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleMessageOwner}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Mesaj Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Ekip Üyeleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.members.map((member) => (
                <div key={member.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {member.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{member.user.name}</p>
                      <p className="text-purple-200 text-sm">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Looking For */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Aranan Roller</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lookingFor.map((role: string, index: number) => (
                <div key={index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center space-x-3">
                    <UserPlus className="w-6 h-6 text-purple-400" />
                    <span className="text-white font-semibold">{role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Job Postings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Açık Pozisyonlar</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {project.jobPostings.map((job) => (
                <div key={job.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{job.role}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCommitmentColor(job.commitment)}`}>
                        {job.commitment}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-200 text-sm">{job.duration}</p>
                      <p className="text-gray-400 text-sm">{job.applications} başvuru</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(() => {
                      const jobSkills = job.skills ? JSON.parse(job.skills) : [];
                      return jobSkills.slice(0, 3).map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs border border-blue-500/30">
                          {skill}
                        </span>
                      ));
                    })()}
                    {(() => {
                      const jobSkills = job.skills ? JSON.parse(job.skills) : [];
                      return jobSkills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-600/30 text-gray-400 rounded-lg text-xs">
                          +{jobSkills.length - 3}
                        </span>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => handleApply(job)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Başvur
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">İş Başvurusu</h2>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedJob.role}</h3>
              <p className="text-purple-200">{project?.title}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white font-semibold mb-2">Ön Yazı</label>
                <textarea
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  placeholder="Kendinizi tanıtın ve neden bu pozisyona başvurduğunuzu açıklayın..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Portfolio/GitHub Linki</label>
                <input
                  type="url"
                  value={applicationForm.portfolio}
                  onChange={(e) => setApplicationForm({ ...applicationForm, portfolio: e.target.value })}
                  placeholder="https://github.com/username veya portfolio linkiniz"
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Deneyim</label>
                <textarea
                  value={applicationForm.experience}
                  onChange={(e) => setApplicationForm({ ...applicationForm, experience: e.target.value })}
                  placeholder="Bu pozisyonla ilgili deneyimlerinizi kısaca açıklayın..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
              >
                İptal
              </button>
              <button
                onClick={submitApplication}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Başvuruyu Gönder
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && project && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Proje Sahibine Mesaj</h2>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{project.createdBy.name}</h3>
              <p className="text-purple-200">{project.title} - Proje Sahibi</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white font-semibold mb-2">Konu</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  placeholder="Mesajınızın konusu..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Mesaj</label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  placeholder="Proje sahibine göndermek istediğiniz mesaj..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300"
                  rows={6}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
              >
                İptal
              </button>
              <button
                onClick={submitMessage}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Mesajı Gönder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 