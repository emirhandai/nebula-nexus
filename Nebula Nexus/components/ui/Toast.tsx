import { toast, ToastOptions } from 'react-hot-toast';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#1f2937',
    color: '#f9fafb',
    border: '1px solid #374151',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        icon: null,
        ...options,
      }
    );
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(
      <div className="flex items-center space-x-3">
        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        icon: null,
        duration: 6000,
        ...options,
      }
    );
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        icon: null,
        ...options,
      }
    );
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(
      <div className="flex items-center space-x-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        icon: null,
        ...options,
      }
    );
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        icon: null,
        duration: Infinity,
        ...options,
      }
    );
  },
};

// Özel toast mesajları
export const toastMessages = {
  // Auth
  loginSuccess: 'Başarıyla giriş yapıldı!',
  loginError: 'Giriş yapılırken bir hata oluştu',
  logoutSuccess: 'Başarıyla çıkış yapıldı',
  registerSuccess: 'Hesap başarıyla oluşturuldu!',
  registerError: 'Hesap oluşturulurken bir hata oluştu',

  // Test
  testStarted: 'Test başlatıldı!',
  testCompleted: 'Test başarıyla tamamlandı!',
  testError: 'Test işlenirken bir hata oluştu',
  testSaved: 'Test sonuçları kaydedildi',

  // Chat
  chatStarted: 'Sohbet başlatıldı!',
  messageSent: 'Mesaj gönderildi',
  messageError: 'Mesaj gönderilirken bir hata oluştu',

  // Admin
  userCreated: 'Kullanıcı başarıyla oluşturuldu',
  userUpdated: 'Kullanıcı başarıyla güncellendi',
  userDeleted: 'Kullanıcı başarıyla silindi',
  bulkDeleteSuccess: 'Seçili kullanıcılar silindi',
  dataLoaded: 'Veriler yüklendi',
  dataError: 'Veriler yüklenirken bir hata oluştu',

  // General
  saved: 'Başarıyla kaydedildi',
  updated: 'Başarıyla güncellendi',
  deleted: 'Başarıyla silindi',
  copied: 'Panoya kopyalandı',
  networkError: 'Ağ bağlantısı hatası',
  serverError: 'Sunucu hatası',
  unknownError: 'Bilinmeyen bir hata oluştu',
}; 