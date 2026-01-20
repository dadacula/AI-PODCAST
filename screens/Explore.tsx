import React, { useState, useMemo, useEffect } from 'react';
import { Screen, Article } from '../types';
import BottomNav from '../components/BottomNav';

interface ExploreProps {
  navigate: (screen: Screen) => void;
  onTopicClick: (topic: string) => void;
  articles: Article[];
}

interface CategoryInfo {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  articleCount: number;
}

const Explore: React.FC<ExploreProps> = ({ navigate, onTopicClick, articles }) => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('search-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Save search history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('search-history', JSON.stringify(searchHistory.slice(0, 5)));
    } catch (err) {
      console.warn('Failed to save search history', err);
    }
  }, [searchHistory]);

  // Category configuration with modern design
  const allCategories: CategoryInfo[] = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    articles.forEach(article => {
      categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
    });

    const categoryConfig: Record<string, { emoji: string; color: string; gradient: string }> = {
      'Top Stories': { emoji: '🌟', color: 'from-amber-500 to-orange-500', gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' },
      'World': { emoji: '🌍', color: 'from-blue-500 to-cyan-500', gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' },
      'Business': { emoji: '💼', color: 'from-emerald-500 to-teal-500', gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20' },
      'Politics': { emoji: '🏛️', color: 'from-purple-500 to-indigo-500', gradient: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20' },
      'Technology': { emoji: '💻', color: 'from-violet-500 to-purple-500', gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20' },
      'Science': { emoji: '🔬', color: 'from-pink-500 to-rose-500', gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20' },
      'Health': { emoji: '❤️', color: 'from-red-500 to-pink-500', gradient: 'bg-gradient-to-br from-red-500/20 to-pink-500/20' },
      'Arts': { emoji: '🎨', color: 'from-fuchsia-500 to-pink-500', gradient: 'bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20' },
    };

    return Object.keys(categoryCounts).map(cat => ({
      id: cat,
      name: cat,
      emoji: categoryConfig[cat]?.emoji || '📌',
      color: categoryConfig[cat]?.color || 'from-gray-500 to-slate-500',
      gradient: categoryConfig[cat]?.gradient || 'bg-gradient-to-br from-gray-500/20 to-slate-500/20',
      articleCount: categoryCounts[cat]
    })).sort((a, b) => b.articleCount - a.articleCount);
  }, [articles]);

  // Search results - real-time filtering
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return articles
      .filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.category.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10); // Limit to 10 results
  }, [query, articles]);

  // Trending topics with actual article data
  const trendingTopics = useMemo(() => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const recentArticles = articles.filter(a => a.timestamp >= oneDayAgo);

    if (recentArticles.length === 0) return [];

    // Group by category
    const categoryGroups: Record<string, Article[]> = {};
    recentArticles.forEach(article => {
      if (!categoryGroups[article.category]) {
        categoryGroups[article.category] = [];
      }
      categoryGroups[article.category].push(article);
    });

    // Get top 3 trending categories
    return Object.entries(categoryGroups)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 3)
      .map(([category, arts]) => ({
        category,
        count: arts.length,
        topArticle: arts[0],
        emoji: allCategories.find(c => c.name === category)?.emoji || '📌',
        gradient: allCategories.find(c => c.name === category)?.gradient || 'bg-gradient-to-br from-gray-500/20 to-slate-500/20'
      }));
  }, [articles, allCategories]);

  // Popular articles (most recent with high engagement potential)
  const popularArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [articles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add to history
    if (!searchHistory.includes(query.trim())) {
      setSearchHistory([query.trim(), ...searchHistory].slice(0, 5));
    }
  };

  const handleSearchHistoryClick = (term: string) => {
    setQuery(term);
  };

  const clearSearch = () => {
    setQuery('');
    setIsSearchFocused(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Header with Search */}
        <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-lg border-b border-primary/5 dark:border-white/5">
          <div className="px-6 pt-8 pb-4">
            <h1 className="text-4xl font-display font-bold text-primary dark:text-white mb-4">
              Discover
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className={`flex items-center w-full h-12 rounded-xl bg-white dark:bg-surface-dark shadow-soft transition-all duration-300 ${
                isSearchFocused ? 'ring-2 ring-indigo-500/50 dark:ring-indigo-400/50' : ''
              }`}>
                <div className="pl-4 pr-3 text-primary/40 dark:text-white/40">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="flex-1 h-full bg-transparent border-none p-0 text-base placeholder:text-primary/30 dark:placeholder:text-white/30 text-primary dark:text-white focus:ring-0 font-sans outline-none"
                  placeholder="Search articles, topics..."
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="pr-4 text-primary/40 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </header>

        {/* Search Results Overlay */}
        {query.trim() && searchResults.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-surface-dark border-b border-primary/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-primary/60 dark:text-white/60 font-sans uppercase tracking-wider">
                {searchResults.length} Results
              </h3>
              <button
                onClick={clearSearch}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-sans font-medium hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((article) => (
                <div
                  key={article.id}
                  className="p-3 rounded-lg hover:bg-primary/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallbackAttempted) {
                            target.dataset.fallbackAttempted = 'true';
                            target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBtb4b8GJXGRkAyAKYSLg8padcTFx41kIuvb-4qCogDGVgwB410EiiAKF0HdJ7i0WBIVPDH0LtU67htw6iOA3zKuFj71VKmyCe7BBnYbgPCaPGk4pBUTWnEdXZxMJxAH70r9wiwkNg5feUENRlhBLrtsR-A-Gb1LVX2r_Y5zRtJFWBmj5vfSe846kcvuhtUZwKhXiCOff3SmcjbVg3HFA5AD3gU0CJdqWlhdzvssvkBOXqizvmHSRt5g9vuEyf2sqMuzhz3HXdOg=w1200';
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans text-primary dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-accent-gold font-sans font-bold uppercase">
                          {article.category}
                        </span>
                        <span className="text-[10px] text-primary/30 dark:text-white/20">•</span>
                        <span className="text-[10px] text-primary/40 dark:text-white/30 font-sans">
                          {article.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search History */}
        {!query && searchHistory.length > 0 && (
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-primary/60 dark:text-white/60 font-sans uppercase tracking-wider">
                Recent Searches
              </h3>
              <button
                onClick={clearHistory}
                className="text-xs text-primary/40 dark:text-white/40 font-sans hover:text-primary dark:hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchHistoryClick(term)}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-surface-dark border border-primary/10 dark:border-white/10 text-sm text-primary dark:text-white font-sans hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Topics */}
        {!query && trendingTopics.length > 0 && (
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-primary/60 dark:text-white/60 font-sans uppercase tracking-wider mb-4">
              Trending Now
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((trending, idx) => (
                <button
                  key={trending.category}
                  onClick={() => onTopicClick(trending.category)}
                  className="w-full"
                >
                  <div className={`${trending.gradient} dark:opacity-80 rounded-2xl p-4 border border-white/40 dark:border-white/10 hover:scale-[1.02] transition-transform duration-300 group`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-sm">
                          {trending.emoji}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-primary/60 dark:text-white/60 font-sans">
                            #{idx + 1} TRENDING
                          </span>
                          <span className="px-2 py-0.5 bg-white/60 dark:bg-black/30 rounded-full text-[10px] font-bold text-primary dark:text-white">
                            {trending.count} stories
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-lg text-primary dark:text-white mb-1">
                          {trending.category}
                        </h4>
                        <p className="text-sm text-primary/70 dark:text-white/70 font-sans line-clamp-1">
                          {trending.topArticle.title}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="material-symbols-outlined text-primary/30 dark:text-white/30 group-hover:text-primary dark:group-hover:text-white group-hover:translate-x-1 transition-all">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Browse Categories */}
        {!query && (
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-primary/60 dark:text-white/60 font-sans uppercase tracking-wider mb-4">
              Browse by Category
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onTopicClick(category.id)}
                  className="group"
                >
                  <div className={`${category.gradient} dark:opacity-80 rounded-2xl p-4 border border-white/40 dark:border-white/10 hover:scale-[1.02] transition-all duration-300 text-left h-28 flex flex-col justify-between`}>
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-sm">
                        {category.emoji}
                      </div>
                      <div className="px-2 py-0.5 bg-white/60 dark:bg-black/30 rounded-full text-[10px] font-bold text-primary dark:text-white">
                        {category.articleCount}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-primary dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {category.name}
                      </h4>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Articles */}
        {!query && popularArticles.length > 0 && (
          <div className="px-6 py-4 pb-8">
            <h3 className="text-xs font-bold text-primary/60 dark:text-white/60 font-sans uppercase tracking-wider mb-4">
              Popular Right Now
            </h3>
            <div className="space-y-3">
              {popularArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-primary/5 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="text-2xl font-display font-bold text-primary/20 dark:text-white/20 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-accent-gold uppercase tracking-wider">
                          {article.category}
                        </span>
                        <span className="text-[10px] text-primary/30 dark:text-white/20">•</span>
                        <span className="text-[10px] text-primary/40 dark:text-white/30 font-sans">
                          {article.source}
                        </span>
                      </div>
                      <h4 className="text-base font-sans font-medium text-primary dark:text-white line-clamp-2 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-primary/40 dark:text-white/30">
                        <span>{article.readTime} read</span>
                        <span>•</span>
                        <span>{article.timeAgo}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallbackAttempted) {
                            target.dataset.fallbackAttempted = 'true';
                            target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBtb4b8GJXGRkAyAKYSLg8padcTFx41kIuvb-4qCogDGVgwB410EiiAKF0HdJ7i0WBIVPDH0LtU67htw6iOA3zKuFj71VKmyCe7BBnYbgPCaPGk4pBUTWnEdXZxMJxAH70r9wiwkNg5feUENRlhBLrtsR-A-Gb1LVX2r_Y5zRtJFWBmj5vfSe846kcvuhtUZwKhXiCOff3SmcjbVg3HFA5AD3gU0CJdqWlhdzvssvkBOXqizvmHSRt5g9vuEyf2sqMuzhz3HXdOg=w1200';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for search with no results */}
        {query.trim() && searchResults.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary/30 dark:text-white/30">
                  search_off
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-primary dark:text-white mb-1">
                  No results found
                </h3>
                <p className="text-sm text-primary/60 dark:text-white/60 font-sans">
                  Try searching for different keywords
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav activeScreen="explore" navigate={navigate} />
    </div>
  );
};

export default Explore;
