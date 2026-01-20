import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '../types';

interface DailySummaryProps {
  articles: Article[];
}

interface CategorySummary {
  category: string;
  emoji: string;
  count: number;
  articles: Article[];
  keywords: string[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ articles }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate brief loading for smooth UX
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [articles]);

  const getTodayKey = () => {
    const today = new Date();
    return `daily-summary-v2-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const categorySummaries = useMemo(() => {
    if (articles.length === 0) return [];

    // Filter articles from last 24 hours
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const todayArticles = articles.filter(a => a.timestamp >= oneDayAgo);

    if (todayArticles.length === 0) return [];

    // Group by category
    const categoryMap: Record<string, Article[]> = {};
    todayArticles.forEach(article => {
      if (!categoryMap[article.category]) {
        categoryMap[article.category] = [];
      }
      categoryMap[article.category].push(article);
    });

    // Create summaries
    const summaries: CategorySummary[] = Object.entries(categoryMap)
      .map(([category, arts]) => {
        // Extract keywords from titles
        const allWords = arts
          .flatMap(a => a.title.toLowerCase().split(' '))
          .filter(w => w.length > 4 && !['about', 'after', 'their', 'which', 'could', 'would', 'should'].includes(w));

        const wordCount: Record<string, number> = {};
        allWords.forEach(w => {
          wordCount[w] = (wordCount[w] || 0) + 1;
        });

        const keywords = Object.entries(wordCount)
          .filter(([_, count]) => count >= 2)
          .sort(([_, a], [__, b]) => b - a)
          .slice(0, 3)
          .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

        return {
          category,
          emoji: getCategoryEmoji(category),
          count: arts.length,
          articles: arts.slice(0, 3), // Top 3 articles
          keywords: keywords.length > 0 ? keywords : ['Breaking news', 'Updates', 'Latest']
        };
      })
      .sort((a, b) => b.count - a.count);

    return summaries;
  }, [articles]);

  const getCategoryEmoji = (category: string): string => {
    const emojiMap: Record<string, string> = {
      '热点': '🔥',
      'Top Stories': '🌟',
      '国际': '🌍',
      'World': '🌍',
      '商业': '💼',
      'Business': '💼',
      '政治': '🏛️',
      'Politics': '🏛️',
      '科技': '💻',
      'Technology': '💻',
      '科学': '🔬',
      'Science': '🔬',
      '娱乐': '🎨',
      'Arts': '🎨',
      '健康': '❤️',
      'Health': '❤️',
    };
    return emojiMap[category] || '📌';
  };

  const totalStories = categorySummaries.reduce((sum, cat) => sum + cat.count, 0);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-3xl p-6 mb-6 border border-indigo-500/20 dark:border-indigo-400/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10 animate-shimmer"></div>
        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center animate-pulse">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <div className="h-6 w-48 bg-white/30 dark:bg-white/10 rounded-lg mb-2"></div>
            <div className="h-4 w-32 bg-white/20 dark:bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (categorySummaries.length === 0) {
    return null;
  }

  const displayCategories = isExpanded ? categorySummaries : categorySummaries.slice(0, 2);

  return (
    <div className="relative bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-3xl overflow-hidden border border-indigo-500/20 dark:border-indigo-400/30 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/20 mb-6">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-3xl">🤖</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300 mb-1">
              AI Daily Brief
            </h3>
            <p className="text-sm font-sans text-primary/60 dark:text-white/60">
              {dateStr}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-400/30 dark:to-purple-400/30 border border-indigo-500/30 dark:border-indigo-400/40">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 font-sans">
                {totalStories} Stories
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/40 dark:border-white/10">
            <div className="text-2xl font-bold text-primary dark:text-white font-display">
              {categorySummaries.length}
            </div>
            <div className="text-[10px] text-primary/60 dark:text-white/60 font-sans uppercase tracking-wider mt-0.5">
              Categories
            </div>
          </div>
          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/40 dark:border-white/10">
            <div className="text-2xl font-bold text-primary dark:text-white font-display">
              {totalStories}
            </div>
            <div className="text-[10px] text-primary/60 dark:text-white/60 font-sans uppercase tracking-wider mt-0.5">
              Articles
            </div>
          </div>
          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/40 dark:border-white/10">
            <div className="text-2xl font-bold text-primary dark:text-white font-display">
              {Math.round(totalStories * 3.5)}m
            </div>
            <div className="text-[10px] text-primary/60 dark:text-white/60 font-sans uppercase tracking-wider mt-0.5">
              Read Time
            </div>
          </div>
        </div>

        {/* Category Summaries */}
        <div className="space-y-4">
          {displayCategories.map((catSummary, idx) => (
            <div
              key={catSummary.category}
              className="bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/60 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white to-gray-100 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-2xl shadow-sm">
                  {catSummary.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-lg text-primary dark:text-white">
                      {catSummary.category}
                    </h4>
                    <span className="px-2 py-0.5 bg-indigo-500/20 dark:bg-indigo-400/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-full">
                      {catSummary.count}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {catSummary.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-sans font-medium text-primary/50 dark:text-white/40 px-2 py-0.5 bg-primary/5 dark:bg-white/5 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Articles Preview */}
              <div className="space-y-2">
                {catSummary.articles.map((article, articleIdx) => (
                  <div
                    key={article.id}
                    className="flex gap-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans text-primary dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-primary/40 dark:text-white/30 font-sans">
                          {article.source}
                        </span>
                        <span className="text-[10px] text-primary/30 dark:text-white/20">•</span>
                        <span className="text-[10px] text-primary/40 dark:text-white/30 font-sans">
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                    {article.imageUrl && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <img
                          src={article.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show more articles indicator */}
              {catSummary.count > 3 && (
                <div className="mt-2 pt-2 border-t border-primary/5 dark:border-white/5">
                  <p className="text-xs text-primary/50 dark:text-white/40 font-sans text-center">
                    +{catSummary.count - 3} more {catSummary.count - 3 === 1 ? 'article' : 'articles'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {categorySummaries.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/20 dark:to-purple-400/20 hover:from-indigo-500/20 hover:to-purple-500/20 dark:hover:from-indigo-400/30 dark:hover:to-purple-400/30 border border-indigo-500/20 dark:border-indigo-400/30 transition-all duration-300 group"
          >
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300 font-sans">
              {isExpanded ? 'Show Less' : `Show ${categorySummaries.length - 2} More Categories`}
            </span>
            <span className={`material-symbols-outlined text-indigo-600 dark:text-indigo-300 text-[18px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-primary/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-primary/50 dark:text-white/40 font-sans uppercase tracking-wider">
              Live Updates
            </span>
          </div>
          <div className="text-[10px] text-primary/40 dark:text-white/30 font-sans">
            Auto-refreshed daily
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
