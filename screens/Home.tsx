import React, { useState, useMemo } from 'react';
import { Article, Screen } from '../types';
import BottomNav from '../components/BottomNav';
import DailySummary from '../components/DailySummary';

interface HomeProps {
  navigate: (screen: Screen) => void;
  onArticleClick: (article: Article) => void;
  onPlayClick: (article: Article) => void;
  articles: Article[];
  isOverlay?: boolean;
  isLoading?: boolean;
  isSaved?: (id: string) => boolean;
  onToggleSave?: (id: string) => void;
  onRefresh?: () => void;
}

const Home: React.FC<HomeProps> = ({
  navigate,
  onArticleClick,
  onPlayClick,
  articles,
  isOverlay = false,
  isLoading = false,
  isSaved = (_id: string) => false,
  onToggleSave = (_id: string) => { },
  onRefresh = () => { }
}) => {
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dynamic Date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();

  // Latest news sorting - ensuring newest articles are first regardless of category
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.timestamp - a.timestamp);
  }, [articles]);

  if (isOverlay) {
    return <BottomNav activeScreen="home" navigate={navigate} />;
  }

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-pulse">
        <header className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="h-4 w-32 bg-primary/10 dark:bg-white/10 rounded"></div>
          <div className="h-9 w-9 rounded-full bg-primary/10 dark:bg-white/10"></div>
        </header>
        <div className="flex-1 overflow-hidden px-6 pt-6">
          <div className="h-56 w-full bg-primary/5 dark:bg-white/5 rounded-2xl mb-8"></div>
          <div className="h-6 w-48 bg-primary/10 dark:bg-white/10 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-primary/10 dark:bg-white/10 rounded"></div>
                  <div className="h-4 w-full bg-primary/10 dark:bg-white/10 rounded"></div>
                  <div className="h-4 w-2/3 bg-primary/10 dark:bg-white/10 rounded"></div>
                </div>
                <div className="h-20 w-20 bg-primary/5 dark:bg-white/5 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav activeScreen="home" navigate={navigate} />
      </div>
    );
  }

  const displayArticles = sortedArticles.length > 0 ? sortedArticles : [];
  const isLive = articles.length > 0 && articles[0].source.includes('BBC');

  const heroArticles = displayArticles.slice(0, 5);
  const feedArticles = displayArticles.slice(5, 11);

  // Trending article: pick a random one from the remaining articles (after index 8) 
  // or just the next one available, to avoid it always being the same fixed index
  const remainingArticles = displayArticles.slice(8);
  const trendingArticle = remainingArticles.length > 0
    ? remainingArticles[Math.floor(Math.random() * remainingArticles.length)]
    : (displayArticles[8] || displayArticles[0]);

  const miniPlayerArticle = displayArticles[0];

  const handleMiniPlayerClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMiniPlayer(false);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex flex-col">
          <span className="text-primary/60 dark:text-white/60 text-xs font-bold tracking-[0.15em] font-sans">{dateStr}</span>
          {isLive && (
            <div className="flex items-center gap-1.5 mt-0.5 animate-in fade-in duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold text-primary dark:text-white font-sans uppercase">Live from BBC</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="h-9 w-9 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center text-primary/60 dark:text-white/60 active:scale-95 transition-transform"
            title="Refresh News"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
          <button
            onClick={() => navigate('settings')}
            className="h-9 w-9 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center overflow-hidden ring-1 ring-primary/5 dark:ring-white/10 active:scale-95 transition-transform"
          >
            <img alt="User Profile" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjsJIVuw8GuQTC7_-zKLJdgZ8ex3RsyqELoGkiI8WVsfmzPX-YGN5Z1HJ0hDqV4JDb6MFhGmjN8YkC7_wL42-z-6uB-lj_yG-FgSmK4M6CGtWucZRkQmiFT5gHrPp6c4QuVomjnTRvJthrOJ8nI5KUTw8UjCQobjDgsi4rTGvG_AELV32TDXgdB48xR_u5PJJF3iNXqYLaKkybtYqHSdp96UHLvc9EA1XqBmftnNxzivpSQXHBA2C2QXOoVNfquPoeMxcbmgDQ09Q" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Daily AI Summary */}
        <div className="px-6 mt-6">
          <DailySummary articles={sortedArticles} />
        </div>

        {/* Carousel */}
        <div className="mt-4 pl-6 relative">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pr-6 pb-4 snap-x snap-mandatory">
            {heroArticles.map((article, index) => (
              <div
                key={article.id}
                className={`min-w-[88%] snap-center flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft overflow-hidden group cursor-pointer ${index === 1 ? 'opacity-90 scale-[0.98]' : ''}`}
                onClick={() => onArticleClick(article)}
              >
                <div className="relative h-56 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallbackAttempted) {
                        target.dataset.fallbackAttempted = 'true';
                        // Use a fallback image from Google
                        target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWBtb4b8GJXGRkAyAKYSLg8padcTFx41kIuvb-4qCogDGVgwB410EiiAKF0HdJ7i0WBIVPDH0LtU67htw6iOA3zKuFj71VKmyCe7BBnYbgPCaPGk4pBUTWnEdXZxMJxAH70r9wiwkNg5feUENRlhBLrtsR-A-Gb1LVX2r_Y5zRtJFWBmj5vfSe846kcvuhtUZwKhXiCOff3SmcjbVg3HFA5AD3gU0CJdqWlhdzvssvkBOXqizvmHSRt5g9vuEyf2sqMuzhz3HXdOg=w1200';
                      }
                    }}
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-2.5 py-1 bg-surface-light/90 dark:bg-black/60 backdrop-blur-md text-accent-gold text-[10px] font-bold tracking-widest uppercase rounded font-sans border border-accent-gold/20">
                      Top Spotlight
                    </span>
                    <span className="max-w-fit px-2 py-0.5 bg-primary/20 dark:bg-white/10 backdrop-blur-md text-primary dark:text-white text-[8px] font-bold tracking-widest uppercase rounded font-sans">
                      {article.category}
                    </span>
                  </div>
                  {/* Bookmark Overlay in Carousel */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleSave(article.id); }}
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    <span className={`material-symbols-outlined text-[20px] ${isSaved(article.id) ? 'icon-filled text-accent-gold' : ''}`}>
                      {isSaved(article.id) ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <h2 className="font-display text-2xl font-bold leading-tight text-primary dark:text-white line-clamp-3">
                    {article.title}
                  </h2>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-primary/70 dark:text-gray-400 text-xs font-medium font-sans">{article.source}</p>
                      <p className="text-primary/40 dark:text-gray-500 text-[10px] font-sans">{article.readTime} read • 🎧 {article.listenTime} listen</p>
                    </div>
                    {index === 0 ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onPlayClick(article); }}
                        className="flex items-center gap-2 bg-primary dark:bg-white text-white dark:text-primary px-4 py-2 rounded-lg transition-transform active:scale-95 shadow-lg shadow-primary/20 dark:shadow-none"
                      >
                        <span className="material-symbols-outlined text-[18px] icon-filled">play_circle</span>
                        <span className="text-xs font-bold font-sans tracking-wide">Listen</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); onPlayClick(article); }}
                        className="h-9 w-9 rounded-full bg-primary/5 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Briefing Section */}
        <div className="px-6 mt-6 mb-2 flex items-baseline justify-between">
          <h3 className="font-display text-2xl font-bold text-primary dark:text-white">Latest Edition</h3>
          <button
            onClick={() => navigate('explore')}
            className="text-xs font-bold text-accent-gold tracking-wide font-sans uppercase hover:text-primary dark:hover:text-white transition-colors"
          >
            View All
          </button>
        </div>

        <div className="flex flex-col px-4 gap-3">
          {feedArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-primary/5 dark:border-white/5 shadow-sm active:bg-primary/5 transition-colors cursor-pointer group"
            >
              <div className="flex gap-4 items-start">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-accent-gold tracking-wider uppercase font-sans">{article.category}</span>
                    <span className="w-1 h-1 rounded-full bg-primary/20 dark:bg-white/20"></span>
                    <span className="text-[10px] text-primary/50 dark:text-gray-500 font-sans">{article.source}</span>
                  </div>
                  <h4 className="font-display text-lg font-bold leading-snug text-primary dark:text-gray-100 group-hover:text-accent-gold transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-primary/60 dark:text-gray-400">
                        <span className="material-symbols-outlined text-[16px] text-accent-gold">headphones</span>
                        <span className="text-xs font-sans font-medium">{article.listenTime}</span>
                      </div>
                      <span className="text-[10px] text-primary/30 dark:text-gray-600 font-sans">{article.timeAgo}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleSave(article.id); }}
                      className="text-primary/30 dark:text-white/30 hover:text-accent-gold transition-colors"
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isSaved(article.id) ? 'icon-filled text-accent-gold' : ''}`}>
                        {isSaved(article.id) ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="w-20 h-20 shrink-0 rounded-lg shadow-inner overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
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
            </article>
          ))}
        </div>

        {/* Divider */}
        <div
          onClick={() => navigate('explore')}
          className="px-6 mt-8 mb-4 flex items-center gap-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        >
          <div className="h-px bg-primary/10 dark:bg-white/10 flex-1"></div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary/40 dark:text-white/40 uppercase font-sans">Trending Now</span>
          <div className="h-px bg-primary/10 dark:bg-white/10 flex-1"></div>
        </div>

        {/* Text Only Card / Trending */}
        {trendingArticle && (
          <div className="px-4 pb-6">
            <article
              onClick={() => onArticleClick(trendingArticle)}
              className="p-5 rounded-xl bg-surface-light dark:bg-surface-dark border border-primary/5 dark:border-white/5 shadow-sm flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-accent-gold tracking-wider uppercase font-sans">{trendingArticle.category}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleSave(trendingArticle.id); }}
                  className="text-primary/30 dark:text-white/30 hover:text-accent-gold transition-colors"
                >
                  <span className={`material-symbols-outlined text-[20px] ${isSaved(trendingArticle.id) ? 'icon-filled text-accent-gold' : ''}`}>
                    {isSaved(trendingArticle.id) ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>
              <h4 className="font-display text-xl font-bold leading-snug text-primary dark:text-gray-100">
                {trendingArticle.title}
              </h4>
              <p className="text-sm font-sans text-primary/60 dark:text-gray-400 line-clamp-3">
                {trendingArticle.content}
              </p>
              <div className="pt-2 border-t border-primary/5 dark:border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-primary/40 dark:text-gray-500 font-sans">{trendingArticle.source} • {trendingArticle.readTime} read</p>
                <button
                  onClick={(e) => { e.stopPropagation(); onPlayClick(trendingArticle); }}
                  className="flex items-center gap-1 text-primary dark:text-white bg-primary/5 dark:bg-white/5 px-3 py-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span className="text-[10px] font-bold font-sans">Listen {trendingArticle.listenTime}</span>
                </button>
              </div>
            </article>
          </div>
        )}
      </div>

      <BottomNav activeScreen="home" navigate={navigate} />
    </div>
  );
};

export default Home;