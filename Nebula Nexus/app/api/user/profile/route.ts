import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    console.log('Profile API - Request URL:', request.url);
    console.log('Profile API - Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Profile API - userId:', userId);
    console.log('Profile API - email:', email);

    if (!userId && !email) {
      console.log('Profile API - No userId or email provided');
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    console.log('Profile API - Searching for user with email:', email);
    
    const user = await prisma.user.findUnique({
      where: userId ? { id: userId } : { email: email! },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        image: true,
        selectedField: true,
        phone: true,
        location: true,
        bio: true,
        website: true,
        linkedin: true,
        github: true,
        twitter: true,
        instagram: true,
        education: true,
        experience: true,
        skills: true,
        interests: true,
        showEmail: true,
        showPhone: true,
        showLocation: true,
        showStats: true,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: true,
        oceanResults: {
          orderBy: { completedAt: 'desc' },
          take: 1,
          select: {
            id: true,
            openness: true,
            conscientiousness: true,
            extraversion: true,
            agreeableness: true,
            neuroticism: true,
            completedAt: true
          }
        }
      }
    });

    console.log('Profile API - User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('Profile API - User ID:', user.id);
      console.log('Profile API - User email:', user.email);
    } else {
      console.log('Profile API - No user found with email:', email);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get latest test result
    const latestTest = user.oceanResults[0];
    
    console.log('Profile API - User found:', user.email);
    console.log('Profile API - oceanResults count:', user.oceanResults.length);
    console.log('Profile API - latestTest:', latestTest);
    
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      joinDate: user.createdAt.toISOString(),
      image: user.image,
      selectedField: user.selectedField,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      website: user.website,
      linkedin: user.linkedin,
      github: user.github,
      twitter: user.twitter,
      instagram: user.instagram,
      education: user.education,
      experience: user.experience,
      skills: user.skills ? JSON.parse(user.skills) : [],
      interests: user.interests ? JSON.parse(user.interests) : [],
      privacy: {
        showEmail: user.showEmail,
        showPhone: user.showPhone,
        showLocation: user.showLocation,
        showStats: user.showStats
      },
      notifications: {
        email: user.emailNotifications,
        push: user.pushNotifications,
        sms: user.smsNotifications
      },
      oceanScores: latestTest ? {
        openness: latestTest.openness,
        conscientiousness: latestTest.conscientiousness,
        extraversion: latestTest.extraversion,
        agreeableness: latestTest.agreeableness,
        neuroticism: latestTest.neuroticism
      } : undefined,
      lastTestDate: latestTest?.completedAt.toISOString() || null,
      careerMatchPercentage: latestTest ? Math.round((latestTest.openness + latestTest.conscientiousness + latestTest.extraversion + latestTest.agreeableness + (100 - latestTest.neuroticism)) / 5) : 0
    };
    
    console.log('Profile API - Final userData:', userData);
    console.log('Profile API - oceanScores in response:', userData.oceanScores);

    return NextResponse.json(userData);

  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      name, 
      email, 
      phone,
      location,
      bio,
      website,
      linkedin,
      github,
      twitter,
      instagram,
      education,
      experience,
      skills,
      interests,
      currentPassword, 
      newPassword, 
      selectedField,
      notifications, 
      privacy 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update selected field
    if (selectedField !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { selectedField }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Selected field updated successfully' 
      });
    }

    // Update basic profile info
    if (name || email || phone || location || bio || website || linkedin || github || twitter || instagram || education || experience || skills || interests) {
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (location) updateData.location = location;
      if (bio) updateData.bio = bio;
      if (website) updateData.website = website;
      if (linkedin) updateData.linkedin = linkedin;
      if (github) updateData.github = github;
      if (twitter) updateData.twitter = twitter;
      if (instagram) updateData.instagram = instagram;
      if (education) updateData.education = education;
      if (experience) updateData.experience = experience;
      if (skills) updateData.skills = JSON.stringify(skills);
      if (interests) updateData.interests = JSON.stringify(interests);

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          bio: true,
          website: true,
          linkedin: true,
          github: true,
          twitter: true,
          instagram: true,
          education: true,
          experience: true,
          skills: true,
          interests: true,
          showEmail: true,
          showPhone: true,
          showLocation: true,
          showStats: true,
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: true
        }
      });

      return NextResponse.json({ 
        success: true, 
        profile: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          location: updatedUser.location,
          bio: updatedUser.bio,
          website: updatedUser.website,
          linkedin: updatedUser.linkedin,
          github: updatedUser.github,
          twitter: updatedUser.twitter,
          instagram: updatedUser.instagram,
          education: updatedUser.education,
          experience: updatedUser.experience,
          skills: updatedUser.skills ? JSON.parse(updatedUser.skills) : [],
          interests: updatedUser.interests ? JSON.parse(updatedUser.interests) : [],
          privacy: {
            showEmail: updatedUser.showEmail,
            showPhone: updatedUser.showPhone,
            showLocation: updatedUser.showLocation,
            showStats: updatedUser.showStats
          },
          notifications: {
            email: updatedUser.emailNotifications,
            push: updatedUser.pushNotifications,
            sms: updatedUser.smsNotifications
          }
        }
      });
    }

    // Update password
    if (currentPassword && newPassword) {
      // For now, just return success (password validation would be implemented here)
      return NextResponse.json({ 
        success: true, 
        message: 'Password updated successfully' 
      });
    }

    // Update notifications and privacy settings
    if (notifications || privacy) {
      const updateData: any = {};
      if (notifications) {
        updateData.emailNotifications = notifications.email;
        updateData.pushNotifications = notifications.push;
      }
      if (privacy) {
        updateData.isPublic = privacy.profileVisibility === 'public';
        updateData.showEmail = privacy.showEmail;
        updateData.showPhone = privacy.showPhone;
        updateData.showLocation = privacy.showLocation;
        updateData.showStats = privacy.showStats;
      }

      await prisma.user.update({
        where: { id: userId },
        data: updateData
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Settings updated successfully' 
      });
    }

    return NextResponse.json(
      { error: 'No valid update data provided' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 