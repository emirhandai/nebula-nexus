import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field');
    const platform = searchParams.get('platform');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    // Generate courses based on field
    const courses = generateCoursesForField(field || 'Yapay Zeka & Makine Öğrenmesi');

    // Filter courses based on parameters
    let filteredCourses = courses;

    if (platform) {
      filteredCourses = filteredCourses.filter(course => 
        course.platform.toLowerCase().includes(platform.toLowerCase())
      );
    }

    if (level) {
      filteredCourses = filteredCourses.filter(course => 
        course.level.toLowerCase() === level.toLowerCase()
      );
    }

    if (search) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(filteredCourses);

  } catch (error) {
    console.error('Courses API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, action } = body;

    if (!userId || !courseId || !action) {
      return NextResponse.json(
        { error: 'User ID, course ID, and action are required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'complete_course':
        // Course completion logic - simplified since courseProgress model is removed
        // Activity log oluştur
        try {
          await prisma.activityLog.create({
            data: {
              userId,
              type: 'course_completed',
              action: 'Kurs tamamlandı',
              description: `${courseId} kursunu başarıyla tamamladınız.`,
              data: JSON.stringify({
                courseId,
                progress: 100,
                completedAt: new Date()
              })
            }
          });
        } catch (activityError) {
          console.error('Error creating activity log for course completion:', activityError);
        }

        return NextResponse.json({ success: true, message: 'Course completed successfully' });

      case 'update_progress':
        // Update course progress - simplified since courseProgress model is removed
        return NextResponse.json({ success: true, message: 'Progress updated successfully' });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Course Action API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCoursesForField(field: string) {
  const courseTemplates = {
    'Yapay Zeka & Makine Öğrenmesi': [
      {
        id: 'ai_ml_1',
        title: 'Python ile Makine Öğrenmesi',
        description: 'Python kullanarak makine öğrenmesi temellerini öğrenin',
        platform: 'BTK Akademi',
        level: 'Başlangıç',
        duration: '40 saat',
        price: 'Ücretsiz',
        rating: 4.8,
        url: 'https://www.btkakademi.gov.tr/portal/course/python-ile-makine-ogrenmesi-10569',
        image: '/images/courses/python-ml.jpg',
        instructor: 'Dr. Ahmet Yılmaz',
        language: 'Türkçe',
        certificate: true
      },
      {
        id: 'ai_ml_2',
        title: 'Deep Learning Fundamentals',
        description: 'Derin öğrenme algoritmaları ve uygulamaları',
        platform: 'Coursera',
        level: 'Orta',
        duration: '60 saat',
        price: '₺299',
        rating: 4.9,
        url: 'https://www.coursera.org/learn/deep-learning',
        image: '/images/courses/deep-learning.jpg',
        instructor: 'Andrew Ng',
        language: 'İngilizce',
        certificate: true
      },
      {
        id: 'ai_ml_3',
        title: 'TensorFlow ile AI Geliştirme',
        description: 'Google TensorFlow kullanarak AI uygulamaları geliştirin',
        platform: 'Udemy',
        level: 'İleri',
        duration: '35 saat',
        price: '₺199',
        rating: 4.7,
        url: 'https://www.udemy.com/course/tensorflow-ai-development',
        image: '/images/courses/tensorflow.jpg',
        instructor: 'Mehmet Demir',
        language: 'Türkçe',
        certificate: true
      }
    ],
    'Web Geliştirme': [
      {
        id: 'web_1',
        title: 'HTML, CSS ve JavaScript Temelleri',
        description: 'Web geliştirmenin temel yapı taşlarını öğrenin',
        platform: 'BTK Akademi',
        level: 'Başlangıç',
        duration: '30 saat',
        price: 'Ücretsiz',
        rating: 4.6,
        url: 'https://www.btkakademi.gov.tr/portal/course/web-temelleri',
        image: '/images/courses/web-basics.jpg',
        instructor: 'Ayşe Kaya',
        language: 'Türkçe',
        certificate: true
      },
      {
        id: 'web_2',
        title: 'React.js ile Modern Web Uygulamaları',
        description: 'React kullanarak dinamik web uygulamaları geliştirin',
        platform: 'Udemy',
        level: 'Orta',
        duration: '45 saat',
        price: '₺249',
        rating: 4.8,
        url: 'https://www.udemy.com/course/react-modern-web',
        image: '/images/courses/react.jpg',
        instructor: 'Can Özkan',
        language: 'Türkçe',
        certificate: true
      },
      {
        id: 'web_3',
        title: 'Node.js Backend Geliştirme',
        description: 'Node.js ile güçlü backend sistemleri oluşturun',
        platform: 'Coursera',
        level: 'İleri',
        duration: '50 saat',
        price: '₺399',
        rating: 4.7,
        url: 'https://www.coursera.org/learn/nodejs-backend',
        image: '/images/courses/nodejs.jpg',
        instructor: 'Sarah Johnson',
        language: 'İngilizce',
        certificate: true
      }
    ],
    'Siber Güvenlik': [
      {
        id: 'cyber_1',
        title: 'Siber Güvenlik Temelleri',
        description: 'Siber güvenlik dünyasına giriş yapın',
        platform: 'BTK Akademi',
        level: 'Başlangıç',
        duration: '35 saat',
        price: 'Ücretsiz',
        rating: 4.5,
        url: 'https://www.btkakademi.gov.tr/portal/course/siber-guvenlik',
        image: '/images/courses/cybersecurity.jpg',
        instructor: 'Emre Güven',
        language: 'Türkçe',
        certificate: true
      },
      {
        id: 'cyber_2',
        title: 'Ethical Hacking',
        description: 'Etik hackleme tekniklerini öğrenin',
        platform: 'Udemy',
        level: 'Orta',
        duration: '55 saat',
        price: '₺299',
        rating: 4.9,
        url: 'https://www.udemy.com/course/ethical-hacking',
        image: '/images/courses/ethical-hacking.jpg',
        instructor: 'Zeynep Arslan',
        language: 'Türkçe',
        certificate: true
      },
      {
        id: 'cyber_3',
        title: 'Network Security',
        description: 'Ağ güvenliği ve koruma yöntemleri',
        platform: 'Coursera',
        level: 'İleri',
        duration: '40 saat',
        price: '₺349',
        rating: 4.6,
        url: 'https://www.coursera.org/learn/network-security',
        image: '/images/courses/network-security.jpg',
        instructor: 'Michael Chen',
        language: 'İngilizce',
        certificate: true
      }
    ],
    'Veri Bilimi': [
      {
        id: 'data_1',
        title: 'Veri Analizi ve Görselleştirme',
        description: 'Veri analizi temellerini ve görselleştirme tekniklerini öğrenin',
        platform: 'BTK Akademi',
        level: 'Başlangıç',
        duration: '25 saat',
        price: 'Ücretsiz',
        rating: 4.7,
        url: 'https://www.btkakademi.gov.tr/portal/course/veri-analizi',
        image: '/images/courses/data-analysis.jpg',
        instructor: 'Fatma Demir',
        language: 'Türkçe',
        certificate: true
      },
      {
        id: 'data_2',
        title: 'SQL ve Veritabanı Yönetimi',
        description: 'SQL sorguları ve veritabanı tasarımı',
        platform: 'Udemy',
        level: 'Orta',
        duration: '30 saat',
        price: '₺179',
        rating: 4.8,
        url: 'https://www.udemy.com/course/sql-veritabani',
        image: '/images/courses/sql.jpg',
        instructor: 'Burak Yıldız',
        language: 'Türkçe',
        certificate: true
      },
      {
        id: 'data_3',
        title: 'Big Data Analytics',
        description: 'Büyük veri analizi ve işleme teknikleri',
        platform: 'Coursera',
        level: 'İleri',
        duration: '65 saat',
        price: '₺449',
        rating: 4.6,
        url: 'https://www.coursera.org/learn/big-data-analytics',
        image: '/images/courses/big-data.jpg',
        instructor: 'David Wilson',
        language: 'İngilizce',
        certificate: true
      }
    ]
  };

  return courseTemplates[field as keyof typeof courseTemplates] || courseTemplates['Yapay Zeka & Makine Öğrenmesi'];
} 