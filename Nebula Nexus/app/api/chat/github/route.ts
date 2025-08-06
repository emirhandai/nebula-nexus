import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const action = searchParams.get('action');

    if (!username) {
      return NextResponse.json({ error: 'GitHub username is required' }, { status: 400 });
    }

    switch (action) {
      case 'repos':
        return await getGitHubRepos(username);
      case 'profile':
        return await getGitHubProfile(username);
      case 'activity':
        return await getGitHubActivity(username);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getGitHubRepos(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      isPrivate: repo.private,
      topics: repo.topics || []
    }));

    return NextResponse.json({
      success: true,
      repos: formattedRepos,
      totalCount: repos.length
    });

  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}

async function getGitHubProfile(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const profile = await response.json();
    
    const formattedProfile = {
      id: profile.id,
      username: profile.login,
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar_url,
      location: profile.location,
      company: profile.company,
      blog: profile.blog,
      twitter: profile.twitter_username,
      publicRepos: profile.public_repos,
      publicGists: profile.public_gists,
      followers: profile.followers,
      following: profile.following,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };

    return NextResponse.json({
      success: true,
      profile: formattedProfile
    });

  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

async function getGitHubActivity(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=20`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();
    
    const formattedEvents = events
      .filter((event: any) => ['PushEvent', 'CreateEvent', 'ForkEvent', 'WatchEvent'].includes(event.type))
      .map((event: any) => ({
        id: event.id,
        type: event.type,
        repo: event.repo?.name,
        actor: event.actor?.login,
        createdAt: event.created_at,
        payload: event.payload
      }))
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      events: formattedEvents
    });

  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username, repoName, action } = body;

    if (!username || !repoName) {
      return NextResponse.json({ error: 'Username and repository name are required' }, { status: 400 });
    }

    switch (action) {
      case 'repo-details':
        return await getRepoDetails(username, repoName);
      case 'repo-readme':
        return await getRepoReadme(username, repoName);
      case 'repo-languages':
        return await getRepoLanguages(username, repoName);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getRepoDetails(username: string, repoName: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repo = await response.json();
    
    const formattedRepo = {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      openIssues: repo.open_issues_count,
      url: repo.html_url,
      cloneUrl: repo.clone_url,
      sshUrl: repo.ssh_url,
      homepage: repo.homepage,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      isPrivate: repo.private,
      isFork: repo.fork,
      topics: repo.topics || [],
      license: repo.license?.name,
      defaultBranch: repo.default_branch,
      size: repo.size,
      archived: repo.archived,
      disabled: repo.disabled
    };

    return NextResponse.json({
      success: true,
      repo: formattedRepo
    });

  } catch (error) {
    console.error('Error fetching repo details:', error);
    return NextResponse.json({ error: 'Failed to fetch repository details' }, { status: 500 });
  }
}

async function getRepoReadme(username: string, repoName: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`);
    
    if (!response.ok) {
      return NextResponse.json({
        success: true,
        readme: null,
        message: 'README not found'
      });
    }

    const readme = await response.json();
    
    // Base64 decode content
    const content = Buffer.from(readme.content, 'base64').toString('utf-8');

    return NextResponse.json({
      success: true,
      readme: {
        content,
        encoding: readme.encoding,
        size: readme.size,
        url: readme.url,
        downloadUrl: readme.download_url
      }
    });

  } catch (error) {
    console.error('Error fetching repo readme:', error);
    return NextResponse.json({ error: 'Failed to fetch README' }, { status: 500 });
  }
}

async function getRepoLanguages(username: string, repoName: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const languages = await response.json();
    
    // Calculate percentages
    const totalBytes = Object.values(languages).reduce((sum: number, bytes: any) => sum + bytes, 0);
    const languagesWithPercentages = Object.entries(languages).map(([language, bytes]) => ({
      language,
      bytes: bytes as number,
      percentage: Math.round(((bytes as number) / totalBytes) * 100)
    })).sort((a, b) => b.bytes - a.bytes);

    return NextResponse.json({
      success: true,
      languages: languagesWithPercentages,
      totalBytes
    });

  } catch (error) {
    console.error('Error fetching repo languages:', error);
    return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 });
  }
} 