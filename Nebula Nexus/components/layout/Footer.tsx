import React from 'react';
import Link from 'next/link';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart,
  Sparkles,
  Brain,
  MessageSquare,
  BookOpen,
  Users,
  Shield
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'OCEAN Testi', href: '/test', icon: Brain },
      { name: 'AI Sohbet', href: '/chat', icon: MessageSquare },
      { name: 'Kaynaklar', href: '/resources', icon: BookOpen },
    ],
    company: [
      { name: 'Hakkımızda', href: '/about', icon: Users },
      { name: 'Blog', href: '/blog' },
      { name: 'SSS', href: '/faq' },
      { name: 'İletişim', href: '/contact' },
    ],
    support: [
      { name: 'Yardım Merkezi', href: '/help' },
      { name: 'Topluluk', href: '/community' },
      { name: 'Geri Bildirim', href: '/feedback' },
      { name: 'Durum', href: '/status' },
    ],
    legal: [
      { name: 'Gizlilik Politikası', href: '/privacy' },
      { name: 'Kullanım Şartları', href: '/terms' },
      { name: 'Çerez Politikası', href: '/cookies' },
      { name: 'KVKK', href: '/kvkk' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Email', href: 'mailto:info@nebula-nexus.com', icon: Mail },
  ];

  return (
    <footer className="footer-gradient border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">Nebula Nexus</span>
                <div className="text-xs text-gray-400 -mt-1">AI Career Guide</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Yapay zeka destekli yazılım kariyer yönlendirme sistemi. 
              OCEAN testi, O*NET veri analizi ve Google Gemini AI ile 
              kariyer yolculuğunuzu şekillendirin.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ürün</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Şirket</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Destek</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Yasal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-2">Güncel Kalın</h3>
            <p className="text-gray-400 mb-4">
              En son güncellemeler ve kariyer ipuçları için abone olun.
            </p>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <button className="btn-primary px-6 py-3">
                Abone Ol
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>&copy; {currentYear} Nebula Nexus. Tüm hakları saklıdır.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Yapay zeka ile güçlendirilmiş kariyer rehberliği</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <Link href="/auth/admin" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Admin</span>
              </Link>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center space-x-2">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>in Türkiye</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 