'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MessageSquare, Star, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Feedback() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    rating: 0,
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by ensuring consistent rendering
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-6"></div>
                <div className="h-12 bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const feedbackCategories = [
    { value: 'general', label: 'Genel Geri Bildirim' },
    { value: 'bug', label: 'Hata Bildirimi' },
    { value: 'feature', label: 'Özellik Önerisi' },
    { value: 'ui', label: 'Arayüz Önerisi' },
    { value: 'performance', label: 'Performans Sorunu' },
    { value: 'other', label: 'Diğer' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        category: '',
        rating: 0,
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="ai-card">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Geri Bildiriminiz Gönderildi!
              </h1>
              <p className="text-gray-400 mb-6">
                Değerli geri bildiriminiz için teşekkür ederiz. En kısa sürede size dönüş yapacağız.
              </p>
              <a href="/feedback" className="btn-primary">
                Yeni Geri Bildirim
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Geri Bildirim
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Deneyiminizi paylaşın, önerilerinizi dinleyelim. Platformumuzu daha iyi hale getirmek için geri bildiriminiz çok değerli.
            </p>
          </div>

          {/* Feedback Form */}
          <div className="max-w-2xl mx-auto">
            <div className="ai-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="E-posta adresiniz"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-white font-medium mb-2">
                    Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  >
                    <option value="">Kategori seçin</option>
                    {feedbackCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Genel Memnuniyet
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className={`p-2 rounded-lg transition-colors ${
                          formData.rating >= star
                            ? 'text-yellow-400 bg-yellow-400/10'
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="w-6 h-6" fill={formData.rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {formData.rating === 0 && 'Puanınızı seçin'}
                    {formData.rating === 1 && 'Çok Kötü'}
                    {formData.rating === 2 && 'Kötü'}
                    {formData.rating === 3 && 'Orta'}
                    {formData.rating === 4 && 'İyi'}
                    {formData.rating === 5 && 'Mükemmel'}
                  </p>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-white font-medium mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Geri bildiriminizin konusu"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    placeholder="Detaylı geri bildiriminizi buraya yazın..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>Geri bildiriminiz gizli tutulacaktır</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-8 py-3 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Gönderiliyor...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Gönder</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="ai-card text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hızlı Yanıt</h3>
              <p className="text-gray-400">
                Geri bildiriminizi 24 saat içinde değerlendirip size dönüş yapıyoruz.
              </p>
            </div>
            <div className="ai-card text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Gizlilik</h3>
              <p className="text-gray-400">
                Tüm geri bildirimleriniz gizli tutulur ve güvenliğiniz sağlanır.
              </p>
            </div>
            <div className="ai-card text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Gelişim</h3>
              <p className="text-gray-400">
                Her geri bildirim platformumuzu daha iyi hale getirmemize yardımcı olur.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 