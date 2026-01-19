import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '../types';

interface DailySummaryProps {
  articles: Article[];
  onArticleClick?: (article: Article) => void;
}

interface CategorySummary {
  category: string;
  count: number;
  emoji: string;
  topArticles: Article[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ articles, onArticleClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [articles]);

  // Get today's articles (last 24 hours)
  const todayArticles = useMemo(() => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    return articles.filter(a => a.timestamp >= oneDayAgo);
  }, [articles]);

  // Get top story
  const topStory = useMemo(() => {
    return todayArticles.length > 0 ? todayArticles[0] : null;
  }, [todayArticles]);

  // Generate category summaries
  const categorySummaries = useMemo((): CategorySummary[] => {
    const categoryMap: Record<string, Article[]> = {};

    todayArticles.forEach(article => {
      if (!categoryMap[article.category]) {
        categoryMap[article.category] = [];
      }
      categoryMap[article.category].push(article);
    });

    const summaries = Object.entries(categoryMap).map(([category, arts]) => ({
      category,
      count: arts.length,
      emoji: getCategoryEmoji(category),
      topArticles: arts.slice(0, 3) // Top 3 articles per category
    }));

    // Sort by count (descending)
    return summaries.sort((a, b) => b.count - a.count);
  }, [todayArticles]);

  const getCategoryEmoji = (category: string): string => {
    const emojiMap: Record<string, string> = {
      'Top Stories': '🌟',
      'World': '🌍',
      'Business': '💼',
      'Politics': '🏛️',
      'Technology': '💻',
      'Science': '🔬',
      'Arts': '🎨',
      'Health': '❤️',
    };
    return emojiMap[category] || '📌';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-accent-gold/10 via-accent-gold/5 to-transparent dark:from-accent-gold/20 dark:via-accent-gold/10 dark:to-transparent rounded-2xl p-6 mb-6 border border-accent-gold/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-gold/20 dark:bg-accent-gold/30">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-xl font-display font-bold text-primary dark:text-white">Daily AI Digest</h3>
        </div>
        <div className="flex items-center gap-2 text-primary/60 dark:text-white/60">
          <span className="animate-spin material-symbols-outlined text-[20px]">sync</span>
          <p className="text-sm font-sans">Analyzing today's headlines...</p>
        </div>
      </div>
    );
  }

  if (todayArticles.length === 0) {
    return null;
  }

  const displayedCategories = isExpanded ? categorySummaries : categorySummaries.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-accent-gold/10 via-accent-gold/5 to-transparent dark:from-accent-gold/20 dark:via-accent-gold/10 dark:to-transparent rounded-2xl overflow-hidden mb-6 border border-accent-gold/20 shadow-lg">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-accent-gold/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold/30 to-accent-gold/20 dark:from-accent-gold/40 dark:to-accent-gold/30">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-primary dark:text-white">Daily AI Digest</h3>
              <p className="text-xs font-sans text-primary/50 dark:text-white/50">{today}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-sans font-bold text-accent-gold/80 bg-accent-gold/10 px-3 py-1.5 rounded-full border border-accent-gold/20">
              LIVE
            </div>
            <p className="text-xs font-sans text-primary/40 dark:text-white/40 mt-1">{todayArticles.length} stories</p>
          </div>
        </div>
      </div>

      {/* Top Story Highlight */}
      {topStory && (
        <div
          className="p-6 border-b border-accent-gold/10 cursor-pointer hover:bg-white/30 dark:hover:bg-black/20 transition-colors"
          onClick={() => onArticleClick?.(topStory)}
        >
          <div className="flex items-start gap-1 mb-2">
            <span className="text-xs font-sans font-bold text-accent-gold tracking-wider">BREAKING</span>
            <span className="material-symbols-outlined text-accent-gold text-[14px] animate-pulse">fiber_manual_record</span>
          </div>
          <h4 className="font-display text-lg font-bold text-primary dark:text-white leading-snug mb-2 line-clamp-2">
            {topStory.title}
          </h4>
          <div className="flex items-center gap-3 text-xs font-sans text-primary/60 dark:text-white/60">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {topStory.timeAgo}
            </span>
            <span>•</span>
            <span>{topStory.source}</span>
            <span>•</span>
            <span className="text-accent-gold">{topStory.category}</span>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="p-6">
        <h4 className="text-xs font-sans font-bold text-accent-gold/80 tracking-widest uppercase mb-4">Coverage by Topic</h4>
        <div className="space-y-4">
          {displayedCategories.map((summary) => (
            <div key={summary.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{summary.emoji}</span>
                  <span className="font-display font-bold text-primary dark:text-white">{summary.category}</span>
                </div>
                <span className="text-xs font-sans text-primary/50 dark:text-white/50 bg-primary/5 dark:bg-white/5 px-2 py-1 rounded-full">
                  {summary.count} {summary.count === 1 ? 'story' : 'stories'}
                </span>
              </div>
              <div className="pl-7 space-y-1.5">
                {summary.topArticles.map((article, idx) => (
                  <button
                    key={article.id}
                    onClick={() => onArticleClick?.(article)}
                    className="block w-full text-left group"
                  >
                    <p className="text-sm font-sans text-primary/70 dark:text-white/70 group-hover:text-accent-gold transition-colors line-clamp-1">
                      <span className="text-primary/40 dark:text-white/40 mr-1.5">{idx + 1}.</span>
                      {article.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Expand/Collapse */}
      {categorySummaries.length > 3 && (
        <div className="px-6 pb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-gold/10 hover:bg-accent-gold/20 border border-accent-gold/20 text-accent-gold font-sans font-medium text-sm transition-colors"
          >
            <span>{isExpanded ? 'Show less' : `Show ${categorySummaries.length - 3} more categories`}</span>
            <span className={`material-symbols-outlined text-[18px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DailySummary;
