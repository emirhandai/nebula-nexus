const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleProjects() {
  try {
    console.log('🚀 Adding sample projects and job postings...');

    // First, get a user to create projects for
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No user found. Please create a user first.');
      return;
    }

    console.log(`👤 Using user: ${user.name} (${user.email})`);

    // Sample projects
    const sampleProjects = [
      {
        title: 'AI Destekli Eğitim Platformu',
        description: 'Yapay zeka kullanarak kişiselleştirilmiş öğrenme deneyimi sunan bir web platformu geliştiriyoruz. Öğrencilerin seviyelerine göre içerik öneren, soru-cevap yapan ve ilerleme takibi yapan bir sistem.',
        category: 'ai',
        difficulty: 'advanced',
        teamSize: 5,
        lookingFor: JSON.stringify(['Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 'UI/UX Designer']),
        tags: JSON.stringify(['React', 'Node.js', 'Python', 'Machine Learning', 'Education']),
        location: 'Remote',
        duration: '6-8 ay'
      },
      {
        title: 'Mobil Fitness Uygulaması',
        description: 'Kullanıcıların egzersiz rutinlerini takip edebileceği, beslenme planları oluşturabileceği ve sosyal özelliklerle motivasyonlarını artırabileceği bir mobil uygulama.',
        category: 'mobile',
        difficulty: 'intermediate',
        teamSize: 4,
        lookingFor: JSON.stringify(['Mobile Developer', 'Backend Developer', 'UI/UX Designer']),
        tags: JSON.stringify(['React Native', 'Firebase', 'Health', 'Social']),
        location: 'İstanbul',
        duration: '4-6 ay'
      },
      {
        title: 'E-Ticaret Güvenlik Sistemi',
        description: 'E-ticaret sitelerinde dolandırıcılığı önlemek için yapay zeka tabanlı bir güvenlik sistemi. Şüpheli işlemleri tespit eden ve otomatik olarak engelleyen bir çözüm.',
        category: 'security',
        difficulty: 'advanced',
        teamSize: 3,
        lookingFor: JSON.stringify(['Security Engineer', 'AI/ML Engineer', 'Backend Developer']),
        tags: JSON.stringify(['Cybersecurity', 'Python', 'Machine Learning', 'Fraud Detection']),
        location: 'Remote',
        duration: '3-5 ay'
      },
      {
        title: 'Veri Görselleştirme Dashboard',
        description: 'Büyük veri setlerini interaktif grafikler ve haritalarla görselleştiren bir web dashboard. Kullanıcıların verilerini yükleyip analiz edebileceği bir platform.',
        category: 'data',
        difficulty: 'intermediate',
        teamSize: 3,
        lookingFor: JSON.stringify(['Frontend Developer', 'Data Scientist', 'UI/UX Designer']),
        tags: JSON.stringify(['D3.js', 'Python', 'Data Visualization', 'Analytics']),
        location: 'Remote',
        duration: '2-4 ay'
      },
      {
        title: 'Oyun Geliştirme Stüdyosu',
        description: '2D platform oyunu geliştiren bir ekip. Pixel art grafikleri, fizik motoru ve çok oyunculu özellikler içeren bir oyun projesi.',
        category: 'game',
        difficulty: 'beginner',
        teamSize: 6,
        lookingFor: JSON.stringify(['Game Developer', 'Game Artist', 'Sound Designer', 'UI Designer']),
        tags: JSON.stringify(['Unity', 'C#', '2D', 'Pixel Art', 'Multiplayer']),
        location: 'Ankara',
        duration: '8-12 ay'
      }
    ];

    // Create projects
    for (const projectData of sampleProjects) {
      const project = await prisma.project.create({
        data: {
          ...projectData,
          createdById: user.id,
          currentMembers: 1
        }
      });

      console.log(`✅ Created project: ${project.title}`);

      // Add project member (creator)
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: user.id,
          role: 'Creator'
        }
      });

      // Create sample job postings for each project
      const jobPostings = [
        {
          role: 'Frontend Developer',
          description: 'React ve modern web teknolojileri ile kullanıcı arayüzü geliştirme. Responsive tasarım ve performans optimizasyonu konularında deneyimli.',
          requirements: JSON.stringify(['React', 'TypeScript', 'CSS3', 'Git']),
          skills: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Redux']),
          commitment: 'part-time',
          duration: '3-6 ay'
        },
        {
          role: 'Backend Developer',
          description: 'Node.js ve veritabanı teknolojileri ile API geliştirme. Güvenlik ve performans odaklı backend sistemleri kurma.',
          requirements: JSON.stringify(['Node.js', 'Express', 'PostgreSQL', 'REST API']),
          skills: JSON.stringify(['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Redis']),
          commitment: 'full-time',
          duration: '6-12 ay'
        },
        {
          role: 'UI/UX Designer',
          description: 'Kullanıcı deneyimi tasarımı ve kullanıcı arayüzü geliştirme. Figma ile prototip oluşturma ve tasarım sistemleri kurma.',
          requirements: JSON.stringify(['Figma', 'Adobe Creative Suite', 'User Research']),
          skills: JSON.stringify(['Figma', 'Adobe XD', 'Sketch', 'Prototyping']),
          commitment: 'flexible',
          duration: 'Proje süresi'
        }
      ];

      for (const jobData of jobPostings) {
        await prisma.jobPosting.create({
          data: {
            ...jobData,
            projectId: project.id,
            postedById: user.id
          }
        });
      }

      console.log(`✅ Added job postings for: ${project.title}`);
    }

    console.log('🎉 Sample projects and job postings added successfully!');

  } catch (error) {
    console.error('❌ Error adding sample projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleProjects(); 