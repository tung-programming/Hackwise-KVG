// XP award logic
type XPAction =
  | 'onboarding_complete'
  | 'module_complete'
  | 'course_complete'
  | 'project_complete'
  | 'daily_login'
  | 'streak_bonus'
  | 'first_project'
  | 'first_course';

const XP_VALUES: Record<XPAction, number> = {
  onboarding_complete: 100,
  module_complete: 25,
  course_complete: 200,
  project_complete: 150,
  daily_login: 10,
  streak_bonus: 5, // per day of streak
  first_project: 50,
  first_course: 50,
};

export const calculateXP = (action: XPAction, multiplier: number = 1): number => {
  return Math.round(XP_VALUES[action] * multiplier);
};

export const calculateLevel = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const xpForNextLevel = (currentLevel: number): number => {
  // XP needed for next level
  return Math.pow(currentLevel, 2) * 100;
};

export const calculateStreakBonus = (streakDays: number): number => {
  // Bonus increases with streak length
  if (streakDays <= 7) return streakDays * XP_VALUES.streak_bonus;
  if (streakDays <= 30) return streakDays * XP_VALUES.streak_bonus * 1.5;
  return streakDays * XP_VALUES.streak_bonus * 2;
};
