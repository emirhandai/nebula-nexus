// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// OCEAN Test Types
export interface OceanScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface OceanResult {
  id: string;
  userId: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  testDate: Date;
  testDuration: number;
  questionsAnswered: number;
  recommendedFields: string[];
}

// OCEAN Test Question
export interface OceanQuestion {
  id: string;
  text: string;
  category: keyof OceanScores;
  reverse: boolean;
}

// Chat Types
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelUsed?: string;
  tokensUsed?: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

// Career Recommendation Types
export interface CareerRecommendation {
  id: string;
  userId: string;
  field: string;
  confidence: number;
  reasoning: string;
  createdAt: Date;
  resources: Resource[];
}

export interface Resource {
  id: string;
  recommendationId: string;
  title: string;
  description?: string;
  url?: string;
  type: 'course' | 'book' | 'video' | 'article' | 'tool';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
}

// Software Field Types
export interface SoftwareField {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredSkills: string[];
  personalityTraits: string[];
  averageSalary?: number;
  jobGrowth?: number;
  demandLevel?: 'high' | 'medium' | 'low';
  learningPath: string[];
  createdAt: Date;
  updatedAt: Date;
}

// User Preferences
export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'tr' | 'en';
  emailNotifications: boolean;
  pushNotifications: boolean;
  shareResults: boolean;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface OceanTestForm {
  answers: Record<string, number>;
}

export interface ChatForm {
  message: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalTests: number;
  averageScore: number;
  recommendedFields: string[];
  recentActivity: {
    type: 'test' | 'chat' | 'recommendation';
    title: string;
    date: Date;
  }[];
} 