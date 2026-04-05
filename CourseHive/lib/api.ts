// Centralized API client for CourseHive
// All backend endpoints with proper typing

import { authFetch, getAccessToken, refreshAccessToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ============ Types ============

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  field: string | null;
  type: string | null;
  xp: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  leaderboardPos?: number;
  completedCourses: number;
  completedProjects: number;
  activeInterests: number;
}

export interface HistoryUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  raw_data?: any;
  created_at: string;
}

export interface Interest {
  id: string;
  user_id: string;
  history_id: string | null;
  name: string;
  description: string;
  icon_url: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  is_completed: boolean;
  progress_pct: number;
  rank: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  interest_id: string;
  user_id: string;
  name: string;
  description: string;
  resource_url: string;
  node_order: number;
  is_completed: boolean;
  is_locked: boolean;
  roadmap_data: {
    duration?: string;
    difficulty?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  interest_id: string;
  user_id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  is_locked: boolean;
  is_completed: boolean;
  submission_url: string | null;
  is_validated: boolean;
  validation_feedback: string | null;
  xp_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  suggestions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============ API Error ============

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============ Helper Functions ============

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.error || data.message || 'API request failed',
      response.status,
      data.code
    );
  }
  
  return data.data || data;
}

// ============ User API ============

export const userApi = {
  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await authFetch('/api/users/profile');
    return handleResponse<User>(response);
  },

  // Update user profile
  async updateProfile(data: Partial<Pick<User, 'username' | 'avatar_url'>>): Promise<User> {
    const response = await authFetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
  },

  // Get user stats (XP, streak, completed courses, etc.)
  async getStats(): Promise<UserStats> {
    const response = await authFetch('/api/users/stats');
    const raw = await handleResponse<any>(response);

    return {
      xp: raw.xp || 0,
      streak: raw.streak || 0,
      leaderboardPos: raw.leaderboard_pos,
      completedCourses: raw.completedCourses ?? raw.courses_completed ?? 0,
      completedProjects: raw.completedProjects ?? raw.projects_completed ?? 0,
      activeInterests: raw.activeInterests ?? raw.interests_accepted ?? 0,
    };
  },

  // Get public profile by user ID
  async getPublicProfile(userId: string): Promise<Partial<User>> {
    const response = await fetch(`${API_URL}/api/users/${userId}/public`);
    return handleResponse<Partial<User>>(response);
  },
};

// ============ History API ============

export const historyApi = {
  // Upload history file (CSV/JSON)
  async upload(file: File): Promise<{ id: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await authFetch('/api/history/upload', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - let browser set multipart boundary
    });
    return handleResponse<{ id: string; status: string }>(response);
  },

  // Get all history uploads for current user
  async getAll(): Promise<HistoryUpload[]> {
    const response = await authFetch('/api/history');
    return handleResponse<HistoryUpload[]>(response);
  },

  // Get history upload status (poll this after upload)
  async getStatus(historyId: string): Promise<{
    status: string;
    interests?: Interest[];
    error?: string;
  }> {
    const response = await authFetch(`/api/history/${historyId}/status`);
    return handleResponse(response);
  },

  // Delete history upload
  async delete(historyId: string): Promise<void> {
    await authFetch(`/api/history/${historyId}`, {
      method: 'DELETE',
    });
  },
};

// ============ Interests API ============

export const interestsApi = {
  // Get all interests for current user
  async getAll(): Promise<Interest[]> {
    const response = await authFetch('/api/interests');
    return handleResponse<Interest[]>(response);
  },

  // Get single interest with courses and projects
  async getById(interestId: string): Promise<{
    interest: Interest;
    courses: Course[];
    projects: Project[];
  }> {
    const response = await authFetch(`/api/interests/${interestId}`);
    return handleResponse(response);
  },

  // Accept interest - triggers roadmap generation (202 async)
  async accept(interestId: string): Promise<{ message: string }> {
    const response = await authFetch(`/api/interests/${interestId}/accept`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Reject interest
  async reject(interestId: string): Promise<{ message: string }> {
    const response = await authFetch(`/api/interests/${interestId}/reject`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Get interest progress
  async getProgress(interestId: string): Promise<{
    progress_pct: number;
    completedCourses: number;
    totalCourses: number;
    completedProjects: number;
    totalProjects: number;
  }> {
    const response = await authFetch(`/api/interests/${interestId}/progress`);
    return handleResponse(response);
  },

  // Check if user has an active (accepted, not completed) interest
  async hasActiveInterest(): Promise<boolean> {
    const interests = await this.getAll();
    return interests.some(i => i.status === 'accepted' && !i.is_completed);
  },

  // Get the active interest (if any)
  async getActiveInterest(): Promise<Interest | null> {
    const interests = await this.getAll();
    return interests.find(i => i.status === 'accepted' && !i.is_completed) || null;
  },
};

// ============ Courses API ============

export const coursesApi = {
  // Get all courses for an interest
  async getByInterest(interestId: string): Promise<Course[]> {
    const response = await authFetch(`/api/courses?interestId=${interestId}`);
    return handleResponse<Course[]>(response);
  },

  // Get single course
  async getById(courseId: string): Promise<Course> {
    const response = await authFetch(`/api/courses/${courseId}`);
    return handleResponse<Course>(response);
  },

  // Mark course as completed
  async complete(courseId: string): Promise<{
    course: Course;
    xpAwarded: number;
    nextCourseUnlocked?: string;
    interestCompleted?: boolean;
  }> {
    const response = await authFetch(`/api/courses/${courseId}/complete`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },
};

// ============ Projects API ============

export const projectsApi = {
  // Get all projects for current user
  async getAll(): Promise<Project[]> {
    const response = await authFetch('/api/projects');
    return handleResponse<Project[]>(response);
  },

  // Get projects for a specific interest
  async getByInterest(interestId: string): Promise<Project[]> {
    const projects = await this.getAll();
    return projects.filter(p => p.interest_id === interestId);
  },

  // Get single project
  async getById(projectId: string): Promise<Project> {
    const response = await authFetch(`/api/projects/${projectId}`);
    return handleResponse<Project>(response);
  },

  // Submit project for validation (202 async)
  async submit(
    projectId: string,
    data: { repo_url?: string; live_url?: string; technologies?: string[] }
  ): Promise<{ message: string }> {
    const submissionUrl = data.repo_url || data.live_url;
    if (!submissionUrl) {
      throw new ApiError('submission_url is required', 400);
    }

    const response = await authFetch(`/api/projects/${projectId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submission_url: submissionUrl,
        submission_data: {
          technologies_used: data.technologies || [],
          live_demo_url: data.live_url || undefined,
        },
      }),
    });
    return handleResponse(response);
  },

  // Get validation result (poll after submit)
  async getValidation(projectId: string): Promise<{
    status: 'pending' | 'validated' | 'failed';
    result?: ValidationResult;
    xpAwarded?: number;
  }> {
    const response = await authFetch(`/api/projects/${projectId}/validation`);
    return handleResponse(response);
  },
};

// ============ Leaderboard API ============

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url: string | null;
  field: string;
  xp: number;
  streak: number;
}

type LeaderboardResponse =
  | LeaderboardEntry[]
  | {
      entries?: Array<LeaderboardEntry & { total_xp?: number }>;
      pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };

function normalizeLeaderboardEntries(payload: LeaderboardResponse): LeaderboardEntry[] {
  const rows = Array.isArray(payload) ? payload : payload.entries || [];
  return rows.map((entry) => ({
    rank: entry.rank,
    user_id: entry.user_id,
    username: entry.username,
    avatar_url: entry.avatar_url ?? null,
    field: entry.field,
    xp: entry.xp ?? entry.total_xp ?? 0,
    streak: entry.streak ?? 0,
  }));
}

export const leaderboardApi = {
  // Get global leaderboard
  async getAll(period?: 'all' | 'month' | 'week'): Promise<LeaderboardEntry[]> {
    const query = period && period !== 'all' ? `?period=${period}` : '';
    const response = await fetch(`${API_URL}/api/leaderboard${query}`);
    const data = await handleResponse<LeaderboardResponse>(response);
    return normalizeLeaderboardEntries(data);
  },

  // Get top users
  async getTop(limit = 10): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_URL}/api/leaderboard/top?limit=${limit}`);
    const data = await handleResponse<LeaderboardResponse>(response);
    return normalizeLeaderboardEntries(data);
  },

  // Get streak leaderboard
  async getStreaks(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_URL}/api/leaderboard/streaks`);
    const data = await handleResponse<LeaderboardResponse>(response);
    return normalizeLeaderboardEntries(data);
  },

  // Get current user rank (requires auth)
  async getMyRank(): Promise<{ rank: number; xp?: number; streak?: number }> {
    const response = await authFetch('/api/leaderboard/me');
    return handleResponse(response);
  },
};

// ============ Weekly Stats API ============

export interface WeeklyActivity {
  day: string;
  hours: number;
  date: string;
}

export const statsApi = {
  // Get weekly activity data
  async getWeeklyActivity(): Promise<WeeklyActivity[]> {
    const response = await authFetch('/api/users/stats/weekly');
    return handleResponse<WeeklyActivity[]>(response);
  },
};

// ============ Polling Utilities ============

export async function pollHistoryStatus(
  historyId: string,
  onUpdate: (status: string, interests?: Interest[]) => void,
  maxAttempts = 30,
  intervalMs = 2000
): Promise<Interest[] | null> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await historyApi.getStatus(historyId);
      onUpdate(result.status, result.interests);

      if (result.status === 'completed') {
        return result.interests || [];
      }
      if (result.status === 'failed') {
        throw new ApiError(result.error || 'Processing failed', 500);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Poll error:', error);
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new ApiError('Processing timeout', 408);
}

export async function pollProjectValidation(
  projectId: string,
  onUpdate: (status: string) => void,
  maxAttempts = 20,
  intervalMs = 3000
): Promise<ValidationResult | null> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await projectsApi.getValidation(projectId);
      onUpdate(result.status);

      if (result.status === 'validated' && result.result) {
        return result.result;
      }
      if (result.status === 'failed') {
        throw new ApiError('Validation failed', 500);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Poll error:', error);
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new ApiError('Validation timeout', 408);
}

// ============ Export All ============

export const api = {
  user: userApi,
  history: historyApi,
  interests: interestsApi,
  courses: coursesApi,
  projects: projectsApi,
  leaderboard: leaderboardApi,
  stats: statsApi,
};

export default api;
