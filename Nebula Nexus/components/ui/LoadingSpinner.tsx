import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain, Zap, Target } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'default' | 'ai' | 'test' | 'chat';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  type = 'default', 
  text = 'Yükleniyor...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const icons = {
    default: Loader2,
    ai: Brain,
    test: Target,
    chat: Zap
  };

  const Icon = icons[type];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} text-cyan-400`}
      >
        <Icon className="w-full h-full" />
      </motion.div>
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-gray-400 text-sm font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Sayfa loading component'i
export function PageLoading({ text = 'Sayfa yükleniyor...' }: { text?: string }) {
  return (
    <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
      <LoadingSpinner size="lg" type="ai" text={text} />
    </div>
  );
}

// Button loading component'i
export function ButtonLoading({ text = 'İşleniyor...' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="sm" type="default" />
      <span>{text}</span>
    </div>
  );
} 