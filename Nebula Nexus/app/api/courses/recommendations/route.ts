import { NextRequest, NextResponse } from 'next/server';
import { 
  getRecommendedCourses, 
  getCoursesByField, 
  getCoursesByLevel, 
  getTopRatedCourses,
  getPopularCourses,
  searchCourses,
  getPlatformInfo
} from '@/data/courses-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field');
    const level = searchParams.get('level');
    const platform = searchParams.get('platform');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');

    let courses = [];

    // Search functionality
    if (search) {
      courses = searchCourses(search);
    }
    // Field-based recommendations
    else if (field) {
      courses = getRecommendedCourses(field, level || 'beginner');
    }
    // Level-based filtering
    else if (level) {
      courses = getCoursesByLevel(level);
    }
    // Platform-based filtering
    else if (platform) {
      courses = getCoursesByField(platform);
    }
    // Default: popular courses
    else {
      courses = getPopularCourses(limit);
    }

    // Apply limit
    courses = courses.slice(0, limit);

    // Add platform information
    const coursesWithPlatformInfo = courses.map(course => ({
      ...course,
      platformInfo: getPlatformInfo(course.platform)
    }));

    return NextResponse.json({
      success: true,
      courses: coursesWithPlatformInfo,
      total: courses.length,
      filters: {
        field,
        level,
        platform,
        search
      }
    });

  } catch (error) {
    console.error('Course recommendations error:', error);
    return NextResponse.json(
      { error: 'Kurs önerileri alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, selectedField, userLevel, preferences } = await request.json();

    if (!userId || !selectedField) {
      return NextResponse.json(
        { error: 'Kullanıcı ID ve seçili alan gerekli' },
        { status: 400 }
      );
    }

    // Get personalized recommendations
    let recommendedCourses = getRecommendedCourses(selectedField, userLevel || 'beginner');

    // Apply user preferences
    if (preferences) {
      if (preferences.platform) {
        recommendedCourses = recommendedCourses.filter(course => 
          course.platform === preferences.platform
        );
      }

      if (preferences.maxPrice !== undefined) {
        recommendedCourses = recommendedCourses.filter(course => 
          course.price <= preferences.maxPrice
        );
      }

      if (preferences.language) {
        recommendedCourses = recommendedCourses.filter(course => 
          course.language === preferences.language
        );
      }

      if (preferences.certificate !== undefined) {
        recommendedCourses = recommendedCourses.filter(course => 
          course.certificate === preferences.certificate
        );
      }
    }

    // Add platform information
    const coursesWithPlatformInfo = recommendedCourses.map(course => ({
      ...course,
      platformInfo: getPlatformInfo(course.platform)
    }));

    // Generate learning path
    const learningPath = generateLearningPath(selectedField, userLevel);

    return NextResponse.json({
      success: true,
      recommendations: coursesWithPlatformInfo.slice(0, 10),
      learningPath,
      total: coursesWithPlatformInfo.length
    });

  } catch (error) {
    console.error('Personalized recommendations error:', error);
    return NextResponse.json(
      { error: 'Kişiselleştirilmiş öneriler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

function generateLearningPath(field: string, level: string = 'beginner') {
  const paths = {
    frontend: {
      beginner: [
        { title: 'HTML & CSS Temelleri', duration: '2-3 hafta', priority: 'high' },
        { title: 'JavaScript Temelleri', duration: '4-6 hafta', priority: 'high' },
        { title: 'Responsive Web Design', duration: '2-3 hafta', priority: 'medium' }
      ],
      intermediate: [
        { title: 'React.js Framework', duration: '6-8 hafta', priority: 'high' },
        { title: 'State Management (Redux)', duration: '3-4 hafta', priority: 'medium' },
        { title: 'Modern CSS (SASS, Grid, Flexbox)', duration: '2-3 hafta', priority: 'medium' }
      ],
      advanced: [
        { title: 'Advanced React Patterns', duration: '4-6 hafta', priority: 'high' },
        { title: 'Performance Optimization', duration: '3-4 hafta', priority: 'medium' },
        { title: 'Testing (Jest, React Testing Library)', duration: '3-4 hafta', priority: 'medium' }
      ]
    },
    backend: {
      beginner: [
        { title: 'Python Temelleri', duration: '4-6 hafta', priority: 'high' },
        { title: 'Veritabanı Temelleri', duration: '3-4 hafta', priority: 'high' },
        { title: 'API Geliştirme', duration: '4-6 hafta', priority: 'medium' }
      ],
      intermediate: [
        { title: 'Django/Flask Framework', duration: '6-8 hafta', priority: 'high' },
        { title: 'RESTful API Design', duration: '4-6 hafta', priority: 'high' },
        { title: 'Authentication & Security', duration: '3-4 hafta', priority: 'medium' }
      ],
      advanced: [
        { title: 'Microservices Architecture', duration: '6-8 hafta', priority: 'high' },
        { title: 'Performance & Scaling', duration: '4-6 hafta', priority: 'medium' },
        { title: 'DevOps Integration', duration: '4-6 hafta', priority: 'medium' }
      ]
    },
    ai: {
      beginner: [
        { title: 'Python for Data Science', duration: '4-6 hafta', priority: 'high' },
        { title: 'Mathematics for ML', duration: '6-8 hafta', priority: 'high' },
        { title: 'Statistics Fundamentals', duration: '4-6 hafta', priority: 'medium' }
      ],
      intermediate: [
        { title: 'Machine Learning Algorithms', duration: '8-10 hafta', priority: 'high' },
        { title: 'Deep Learning with TensorFlow', duration: '8-10 hafta', priority: 'high' },
        { title: 'Data Preprocessing & Feature Engineering', duration: '4-6 hafta', priority: 'medium' }
      ],
      advanced: [
        { title: 'Advanced Deep Learning', duration: '10-12 hafta', priority: 'high' },
        { title: 'NLP & Computer Vision', duration: '8-10 hafta', priority: 'medium' },
        { title: 'MLOps & Model Deployment', duration: '6-8 hafta', priority: 'medium' }
      ]
    },
    mobile: {
      beginner: [
        { title: 'Mobile Development Fundamentals', duration: '4-6 hafta', priority: 'high' },
        { title: 'React Native Basics', duration: '6-8 hafta', priority: 'high' },
        { title: 'Mobile UI/UX Design', duration: '3-4 hafta', priority: 'medium' }
      ],
      intermediate: [
        { title: 'Advanced React Native', duration: '6-8 hafta', priority: 'high' },
        { title: 'State Management in Mobile Apps', duration: '4-6 hafta', priority: 'medium' },
        { title: 'Mobile App Testing', duration: '3-4 hafta', priority: 'medium' }
      ],
      advanced: [
        { title: 'Native Module Integration', duration: '4-6 hafta', priority: 'medium' },
        { title: 'Performance Optimization', duration: '4-6 hafta', priority: 'medium' },
        { title: 'App Store Deployment', duration: '2-3 hafta', priority: 'low' }
      ]
    }
  };

  return paths[field as keyof typeof paths]?.[level as keyof typeof paths.frontend] || [];
} 