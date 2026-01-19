import React, { useState, useEffect } from 'react';
import { Article } from '../types';

interface DailySummaryProps {
  articles: Article[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ articles }) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    generateDailySummary();
  }, [articles]);

  const getTodayKey = () => {
    const today = new Date();
    return `daily-summary-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const generateDailySummary = async () => {
    if (articles.length === 0) {
      setIsLoading(false);
      return;
    }

    // Check if we have a cached summary for today
    const todayKey = getTodayKey();
    const cached = localStorage.getItem(todayKey);

    if (cached) {
      setSummary(cached);
      setIsLoading(false);
      return;
    }

    // Filter today's articles (last 24 hours)
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const todayArticles = articles.filter(a => a.timestamp >= oneDayAgo);

    if (todayArticles.length === 0) {
      setSummary("No new stories today. Check back later for the latest headlines.");
      setIsLoading(false);
      return;
    }

    // Generate summary from articles
    const summaryText = generateSummaryFromArticles(todayArticles);

    // Cache the summary
    localStorage.setItem(todayKey, summaryText);
    setSummary(summaryText);
    setIsLoading(false);
  };

  const generateSummaryFromArticles = (todayArticles: Article[]): string => {
    // Group articles by category
    const categoryCounts: Record<string, number> = {};
    const categoryTopics: Record<string, string[]> = {};

    todayArticles.forEach(article => {
      const cat = article.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      if (!categoryTopics[cat]) {
        categoryTopics[cat] = [];
      }
      if (categoryTopics[cat].length < 2) {
        // Extract key phrases from title (first few words)
        const words = article.title.split(' ').slice(0, 6).join(' ');
        categoryTopics[cat].push(words);
      }
    });

    // Sort categories by article count
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);

    // Build summary
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    let summaryParts: string[] = [];
    summaryParts.push(`📰 **${today}** — Today's top stories:`);
    summaryParts.push('');

    sortedCategories.forEach(([category, count]) => {
      const topics = categoryTopics[category];
      const emoji = getCategoryEmoji(category);

      if (count === 1) {
        summaryParts.push(`${emoji} **${category}**: ${topics[0]}...`);
      } else {
        summaryParts.push(`${emoji} **${category}** (${count} stories): ${topics.join('; ')}...`);
      }
    });

    summaryParts.push('');
    summaryParts.push(`📊 **${todayArticles.length} total stories** across ${Object.keys(categoryCounts).length} categories today.`);

    return summaryParts.join('\n');
  };

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

  const formatSummaryForDisplay = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Bold text between ** **
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className={line === '' ? 'h-2' : 'mb-2'}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <span key={i} className="font-bold">{part.slice(2, -2)}</span>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 dark:from-accent-gold/20 dark:to-accent-gold/10 rounded-2xl p-6 mb-6 border border-accent-gold/20">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🤖</span>
          <h3 className="text-xl font-display font-bold text-primary dark:text-white">Daily AI Brief</h3>
        </div>
        <div className="flex items-center gap-2 text-primary/60 dark:text-white/60">
          <span className="animate-spin material-symbols-outlined text-[20px]">sync</span>
          <p className="text-sm font-sans">Analyzing today's headlines...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const lines = summary.split('\n');
  const preview = lines.slice(0, 4).join('\n');
  const displayText = isExpanded ? summary : preview;

  return (
    <div className="bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 dark:from-accent-gold/20 dark:to-accent-gold/10 rounded-2xl p-6 mb-6 border border-accent-gold/20 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🤖</span>
        <h3 className="text-xl font-display font-bold text-primary dark:text-white">Daily AI Brief</h3>
        <div className="ml-auto">
          <span className="text-xs font-sans font-bold text-accent-gold/60 bg-accent-gold/10 px-2 py-1 rounded-full">
            AUTO-UPDATED
          </span>
        </div>
      </div>

      <div className="text-sm font-sans text-primary/80 dark:text-white/80 leading-relaxed space-y-2">
        {formatSummaryForDisplay(displayText)}
      </div>

      {lines.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-2 text-sm font-sans font-medium text-accent-gold hover:text-accent-gold/80 transition-colors"
        >
          <span>{isExpanded ? 'Show less' : 'Read full summary'}</span>
          <span className={`material-symbols-outlined text-[18px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
      )}
    </div>
  );
};

export default DailySummary;
