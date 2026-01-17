export type Screen = 'onboarding' | 'login' | 'home' | 'explore' | 'saved' | 'settings' | 'article' | 'player' | 'profile' | 'interests' | 'topic';

export interface Article {
  id: string;
  category: string;
  source: string;
  title: string;
  readTime: string;
  listenTime: string;
  timeAgo: string;
  imageUrl: string;
  timestamp: number;
  author?: string;
  date?: string;
  content?: string;
  link?: string;
}

export interface Interest {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
}

export interface TrendingTopic {
  id: number;
  rank: string;
  name: string;
  volume: string;
  path: string; // SVG path for sparkline
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string;
}

export interface UserPreferences {
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  playbackSpeed: number;
  preferredVoice: 'ai' | 'human';
}

export interface ListeningHistoryItem {
  articleId: string;
  progress: number;
  durationSeconds: number;
  lastPlayedAt: string;
  completed: boolean;
}