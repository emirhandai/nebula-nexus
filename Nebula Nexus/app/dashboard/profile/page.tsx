'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Key,
  Bell,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Target,
  BarChart3,
  MessageSquare,
  Clock,
  TrendingUp,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Share2,
  Lock,
  Unlock,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { PageLoading } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorBoundary';
import { showToast, toastMessages } from '@/components/ui/Toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  interests?: string[];
  joinDate: string;
  lastActive: string;
  isPublic: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showStats: boolean;
  };
}

interface ProfileStats {
  testsCompleted: number;
  totalChats: number;
  averageScore: number;
  completionRate: number;
  activeDays: number;
  totalTime: string;
  achievements: number;
  recommendations: number;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    testsCompleted: 0,
    totalChats: 0,
    averageScore: 0,
    completionRate: 0,
    activeDays: 0,
    totalTime: '0 saat',
    achievements: 0,
    recommendations: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: '',
    instagram: '',
    education: '',
    experience: '',
    skills: [] as string[],
    interests: [] as string[]
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfileData();
    }
  }, [isAuthenticated, user]);

  const loadProfileData = async () => {
    try {
      setIsLoadingData(true);
      setError(null);

      const [profileResponse, statsResponse] = await Promise.all([
        fetch(`/api/user/profile?userId=${user?.id}`),
        fetch(`/api/user/profile-stats?userId=${user?.id}`)
      ]);

      if (!profileResponse.ok || !statsResponse.ok) {
        throw new Error('Profil verileri yüklenirken hata oluştu');
      }

      const [profileData, statsData] = await Promise.all([
        profileResponse.json(),
        statsResponse.json()
      ]);

      console.log('Profile data loaded:', profileData);
      setProfile(profileData);
      setStats(statsData.stats || {
        testsCompleted: 0,
        totalChats: 0,
        averageScore: 0,
        completionRate: 0,
        activeDays: 0,
        totalTime: '0 saat',
        achievements: 0,
        recommendations: 0
      });
      
      // Form data'yı doldur
      setFormData({
        name: profileData?.name || '',
        email: profileData?.email || '',
        phone: profileData?.phone || '',
        location: profileData?.location || '',
        bio: profileData?.bio || '',
        website: profileData?.website || '',
        linkedin: profileData?.linkedin || '',
        github: profileData?.github || '',
        twitter: profileData?.twitter || '',
        instagram: profileData?.instagram || '',
        education: profileData?.education || '',
        experience: profileData?.experience || '',
        skills: profileData?.skills || [],
        interests: profileData?.interests || []
      });
    } catch (error) {
      console.error('Profile data error:', error);
      setError('Profil verileri yüklenirken bir hata oluştu');
      showToast.error('Profil verileri yüklenemedi');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Profil güncellenirken hata oluştu');
      }

      const data = await response.json();
      setProfile(data.profile);
      setIsEditing(false);
      showToast.success('Profil başarıyla güncellendi');
    } catch (error) {
      console.error('Save profile error:', error);
      showToast.error('Profil güncellenirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Form data'yı orijinal değerlere geri döndür
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        twitter: profile.twitter || '',
        instagram: profile.instagram || '',
        education: profile.education || '',
        experience: profile.experience || '',
        skills: profile.skills || [],
        interests: profile.interests || []
      });
    }
  };

  const addSkill = () => {
    const skill = prompt('Yeni beceri ekle:');
    if (skill && skill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addInterest = () => {
    const interest = prompt('Yeni ilgi alanı ekle:');
    if (interest && interest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const togglePrivacy = async (field: keyof UserProfile['privacy']) => {
    if (!profile) return;

    console.log('Toggle privacy called:', field);
    console.log('Current profile:', profile);

    try {
      const updatedPrivacy = {
        ...profile.privacy,
        [field]: !profile.privacy[field]
      };

      console.log('Updated privacy:', updatedPrivacy);

      const response = await fetch('/api/user/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacy: {
            ...updatedPrivacy,
            emailNotifications: profile.notifications.email,
            pushNotifications: profile.notifications.push,
            smsNotifications: profile.notifications.sms
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        setProfile(prev => prev ? {
          ...prev,
          privacy: data.privacy
        } : null);
        showToast.success('Gizlilik ayarları güncellendi');
      } else {
        throw new Error('Gizlilik ayarları güncellenemedi');
      }
    } catch (error) {
      console.error('Privacy update error:', error);
      showToast.error('Gizlilik ayarları güncellenirken hata oluştu');
    }
  };

  const toggleNotification = async (field: keyof UserProfile['notifications']) => {
    if (!profile) return;

    console.log('Toggle notification called:', field);
    console.log('Current notifications:', profile.notifications);

    try {
      const updatedNotifications = {
        ...profile.notifications,
        [field]: !profile.notifications[field]
      };

      console.log('Updated notifications:', updatedNotifications);

      const response = await fetch('/api/user/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacy: {
            ...profile.privacy,
            emailNotifications: updatedNotifications.email,
            pushNotifications: updatedNotifications.push,
            smsNotifications: updatedNotifications.sms
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        setProfile(prev => prev ? {
          ...prev,
          notifications: updatedNotifications
        } : null);
        showToast.success('Bildirim ayarları güncellendi');
      } else {
        throw new Error('Bildirim ayarları güncellenemedi');
      }
    } catch (error) {
      console.error('Notification update error:', error);
      showToast.error('Bildirim ayarları güncellenirken hata oluştu');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error('Yeni şifreler eşleşmiyor');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        showToast.success('Şifre başarıyla değiştirildi');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Şifre değiştirilemedi');
      }
    } catch (error) {
      console.error('Password change error:', error);
      showToast.error('Şifre değiştirilirken hata oluştu');
    }
  };

  const handleEnable2FA = () => {
    showToast.info('2FA özelliği yakında eklenecek');
    setShow2FAModal(false);
  };

  const handleDeleteAccount = () => {
    if (confirm('Bu işlem geri alınamaz. Hesabınızı silmek istediğinizden emin misiniz?')) {
      showToast.info('Hesap silme özelliği yakında eklenecek');
    }
  };

  if (isLoading) {
    return <PageLoading text="Kullanıcı bilgileri yükleniyor..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-white mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-400">Profilinizi görüntülemek için lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Profil</h1>
            <p className="text-gray-400">Kişisel bilgilerinizi ve ayarlarınızı yönetin</p>
          </div>
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="ai-button-secondary"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="ai-button-primary"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="ai-button-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </button>
            )}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            title="Hata" 
            message={error} 
            onRetry={loadProfileData}
          />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="ai-card"
            >
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    {profile?.image ? (
                      <img 
                        src={profile.image} 
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                
                                 <h3 className="text-xl font-bold text-white mb-2">
                   {isEditing ? (
                     <input
                       type="text"
                       id="profile-name"
                       name="name"
                       value={formData.name}
                       onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                       className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-center w-full"
                     />
                   ) : (
                     profile?.name
                   )}
                 </h3>
                
                                 <p className="text-gray-400 mb-4">
                   {isEditing ? (
                     <input
                       type="email"
                       id="profile-email"
                       name="email"
                       value={formData.email}
                       onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                       className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 text-center w-full"
                     />
                   ) : (
                     profile?.email
                   )}
                 </p>

                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Üye: {profile?.joinDate}</span>
                  </div>
                </div>

                {profile?.bio && (
                  <p className="text-gray-300 text-sm mb-4">{profile.bio}</p>
                )}

                                 {isEditing && (
                   <textarea
                     id="profile-bio"
                     name="bio"
                     value={formData.bio}
                     onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                     placeholder="Kendiniz hakkında kısa bir açıklama..."
                     className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm w-full h-20 resize-none"
                   />
                 )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="ai-card"
              >
                <h3 className="text-lg font-bold text-white mb-4">Hızlı İstatistikler</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tamamlanan Test</span>
                    <span className="text-white font-medium">{stats.testsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Toplam Sohbet</span>
                    <span className="text-white font-medium">{stats.totalChats}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Ortalama Skor</span>
                    <span className="text-white font-medium">{stats.averageScore.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tamamlanma Oranı</span>
                    <span className="text-white font-medium">{stats.completionRate}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="ai-card"
            >
              <div className="flex space-x-1">
                {[
                  { id: 'profile', label: 'Profil Bilgileri', icon: User },
                  { id: 'privacy', label: 'Gizlilik', icon: Shield },
                  { id: 'notifications', label: 'Bildirimler', icon: Bell },
                  { id: 'security', label: 'Güvenlik', icon: Lock }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="ai-card"
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Profil Bilgileri</h3>
                  
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         <div>
                       <label htmlFor="profile-phone" className="block text-gray-400 text-sm mb-2">Telefon</label>
                       {isEditing ? (
                         <input
                           type="tel"
                           id="profile-phone"
                           name="phone"
                           value={formData.phone}
                           onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                           className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                           placeholder="+90 555 123 4567"
                         />
                       ) : (
                         <p className="text-white">{profile?.phone || 'Belirtilmemiş'}</p>
                       )}
                     </div>
                    
                                         <div>
                       <label htmlFor="profile-location" className="block text-gray-400 text-sm mb-2">Konum</label>
                       {isEditing ? (
                         <input
                           type="text"
                           id="profile-location"
                           name="location"
                           value={formData.location}
                           onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                           className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                           placeholder="İstanbul, Türkiye"
                         />
                       ) : (
                         <p className="text-white">{profile?.location || 'Belirtilmemiş'}</p>
                       )}
                     </div>
                    
                                         <div>
                       <label htmlFor="profile-education" className="block text-gray-400 text-sm mb-2">Eğitim</label>
                       {isEditing ? (
                         <input
                           type="text"
                           id="profile-education"
                           name="education"
                           value={formData.education}
                           onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                           className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                           placeholder="Üniversite, Bölüm"
                         />
                       ) : (
                         <p className="text-white">{profile?.education || 'Belirtilmemiş'}</p>
                       )}
                     </div>
                    
                                         <div>
                       <label htmlFor="profile-experience" className="block text-gray-400 text-sm mb-2">Deneyim</label>
                       {isEditing ? (
                         <input
                           type="text"
                           id="profile-experience"
                           name="experience"
                           value={formData.experience}
                           onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                           className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                           placeholder="5 yıl yazılım geliştirme"
                         />
                       ) : (
                         <p className="text-white">{profile?.experience || 'Belirtilmemiş'}</p>
                       )}
                     </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Sosyal Medya</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {[
                         { key: 'website', label: 'Website', icon: Globe },
                         { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                         { key: 'github', label: 'GitHub', icon: Github },
                         { key: 'twitter', label: 'Twitter', icon: Twitter }
                       ].map((social) => (
                         <div key={social.key}>
                           <label htmlFor={`profile-${social.key}`} className="block text-gray-400 text-sm mb-2">{social.label}</label>
                           {isEditing ? (
                             <input
                               type="url"
                               id={`profile-${social.key}`}
                               name={social.key}
                               value={formData[social.key as keyof typeof formData] as string}
                               onChange={(e) => setFormData(prev => ({ ...prev, [social.key]: e.target.value }))}
                               className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                               placeholder={`${social.label} URL'si`}
                             />
                           ) : (
                                                          <p className="text-white">{String(profile?.[social.key as keyof UserProfile] || 'Belirtilmemiş')}</p>
                           )}
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Beceriler</h4>
                      {isEditing && (
                        <button
                          onClick={addSkill}
                          className="ai-button-secondary"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Ekle
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? formData.skills : profile?.skills || []).map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full"
                        >
                          <span className="text-sm">{skill}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-cyan-400 hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">İlgi Alanları</h4>
                      {isEditing && (
                        <button
                          onClick={addInterest}
                          className="ai-button-secondary"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Ekle
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? formData.interests : profile?.interests || []).map((interest, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full"
                        >
                          <span className="text-sm">{interest}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeInterest(index)}
                              className="text-purple-400 hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Gizlilik Ayarları</h3>
                  
                  <div className="space-y-4">
                                         {[
                       { key: 'showEmail', label: 'E-posta adresimi göster', description: 'Diğer kullanıcılar e-posta adresinizi görebilir' },
                       { key: 'showPhone', label: 'Telefon numaramı göster', description: 'Diğer kullanıcılar telefon numaranızı görebilir' },
                       { key: 'showLocation', label: 'Konumumu göster', description: 'Diğer kullanıcılar konumunuzu görebilir' },
                       { key: 'showStats', label: 'İstatistiklerimi göster', description: 'Diğer kullanıcılar test sonuçlarınızı görebilir' }
                     ].map((setting) => (
                       <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                         <div>
                           <h4 className="text-white font-medium">{setting.label}</h4>
                           <p className="text-gray-400 text-sm">{setting.description}</p>
                         </div>
                         <button
                           onClick={() => togglePrivacy(setting.key as keyof UserProfile['privacy'])}
                           className={`w-12 h-6 rounded-full transition-colors ${
                             profile?.privacy?.[setting.key as keyof UserProfile['privacy']]
                               ? 'bg-cyan-500'
                               : 'bg-gray-600'
                           }`}
                         >
                           <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                             profile?.privacy?.[setting.key as keyof UserProfile['privacy']]
                               ? 'transform translate-x-6'
                               : 'transform translate-x-1'
                           }`} />
                         </button>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Bildirim Ayarları</h3>
                  
                  <div className="space-y-4">
                                         {[
                       { key: 'email', label: 'E-posta Bildirimleri', description: 'Önemli güncellemeler için e-posta al' },
                       { key: 'push', label: 'Push Bildirimleri', description: 'Tarayıcı push bildirimleri al' },
                       { key: 'sms', label: 'SMS Bildirimleri', description: 'Önemli güncellemeler için SMS al' }
                     ].map((notification) => (
                       <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                         <div>
                           <h4 className="text-white font-medium">{notification.label}</h4>
                           <p className="text-gray-400 text-sm">{notification.description}</p>
                         </div>
                         <button
                           onClick={() => toggleNotification(notification.key as keyof UserProfile['notifications'])}
                           className={`w-12 h-6 rounded-full transition-colors ${
                             profile?.notifications?.[notification.key as keyof UserProfile['notifications']]
                               ? 'bg-cyan-500'
                               : 'bg-gray-600'
                           }`}
                         >
                           <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                             profile?.notifications?.[notification.key as keyof UserProfile['notifications']]
                               ? 'transform translate-x-6'
                               : 'transform translate-x-1'
                           }`} />
                         </button>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Güvenlik Ayarları</h3>
                  
                  <div className="space-y-4">
                                         <div className="p-4 bg-gray-800/50 rounded-lg">
                       <h4 className="text-white font-medium mb-2">Şifre Değiştir</h4>
                       <p className="text-gray-400 text-sm mb-4">Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin</p>
                       <button 
                         onClick={() => setShowPasswordModal(true)}
                         className="ai-button-secondary"
                       >
                         <Key className="w-4 h-4 mr-2" />
                         Şifre Değiştir
                       </button>
                     </div>
                    
                                         <div className="p-4 bg-gray-800/50 rounded-lg">
                       <h4 className="text-white font-medium mb-2">İki Faktörlü Doğrulama</h4>
                       <p className="text-gray-400 text-sm mb-4">Hesabınızı daha güvenli hale getirmek için 2FA'yı etkinleştirin</p>
                       <button 
                         onClick={() => setShow2FAModal(true)}
                         className="ai-button-secondary"
                       >
                         <Shield className="w-4 h-4 mr-2" />
                         2FA Etkinleştir
                       </button>
                     </div>
                    
                                         <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                       <h4 className="text-red-400 font-medium mb-2">Hesabı Sil</h4>
                       <p className="text-gray-400 text-sm mb-4">Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.</p>
                       <button 
                         onClick={handleDeleteAccount}
                         className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                       >
                         <Trash2 className="w-4 h-4 mr-2" />
                         Hesabı Sil
                       </button>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
                     </div>
         </div>
       </div>

       {/* Password Change Modal */}
       {showPasswordModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
             <h3 className="text-xl font-bold text-white mb-4">Şifre Değiştir</h3>
             <div className="space-y-4">
               <div>
                 <label htmlFor="current-password" className="block text-gray-400 text-sm mb-2">Mevcut Şifre</label>
                 <input
                   type="password"
                   id="current-password"
                   name="currentPassword"
                   value={passwordData.currentPassword}
                   onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                   placeholder="Mevcut şifrenizi girin"
                 />
               </div>
               <div>
                 <label htmlFor="new-password" className="block text-gray-400 text-sm mb-2">Yeni Şifre</label>
                 <input
                   type="password"
                   id="new-password"
                   name="newPassword"
                   value={passwordData.newPassword}
                   onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                   placeholder="Yeni şifrenizi girin"
                 />
               </div>
               <div>
                 <label htmlFor="confirm-password" className="block text-gray-400 text-sm mb-2">Yeni Şifre (Tekrar)</label>
                 <input
                   type="password"
                   id="confirm-password"
                   name="confirmPassword"
                   value={passwordData.confirmPassword}
                   onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                   placeholder="Yeni şifrenizi tekrar girin"
                 />
               </div>
             </div>
             <div className="flex space-x-3 mt-6">
               <button
                 onClick={() => {
                   setShowPasswordModal(false);
                   setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                 }}
                 className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
               >
                 İptal
               </button>
               <button
                 onClick={handleChangePassword}
                 className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
               >
                 Değiştir
               </button>
             </div>
           </div>
         </div>
       )}

       {/* 2FA Modal */}
       {show2FAModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
             <h3 className="text-xl font-bold text-white mb-4">İki Faktörlü Doğrulama</h3>
             <p className="text-gray-400 text-sm mb-6">
               Bu özellik yakında eklenecektir. Hesabınızı daha güvenli hale getirmek için SMS veya e-posta doğrulaması kullanabilirsiniz.
             </p>
             <div className="flex space-x-3">
               <button
                 onClick={() => setShow2FAModal(false)}
                 className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
               >
                 Kapat
               </button>
               <button
                 onClick={handleEnable2FA}
                 className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
               >
                 Anladım
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 } 