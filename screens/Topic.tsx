import React, { useMemo } from 'react';
import { Screen, Article } from '../types';

interface TopicProps {
  navigate: (screen: Screen) => void;
  topic: string;
  onArticleClick: (article: Article) => void;
  articles: Article[];
  isSaved?: (id: string) => boolean;
  onToggleSave?: (id: string) => void;
}

const Topic: React.FC<TopicProps> = ({
  navigate,
  topic,
  onArticleClick,
  articles,
  isSaved = (_id: string) => false,
  onToggleSave = (_id: string) => { }
}) => {

  // Filter articles based on the selected topic and sort by latest
  const filteredArticles = useMemo(() => {
    if (!topic) return [...articles].sort((a, b) => b.timestamp - a.timestamp);

    const search = topic.toLowerCase();

    const filtered = articles.filter(article => {
      // Match Category (Exact or partial)
      if (article.category.toLowerCase().includes(search)) return true;
      // Match Title (Keyword search)
      if (article.title.toLowerCase().includes(search)) return true;
      return false;
    });

    // Sort by timestamp descending (newest first)
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [topic, articles]);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">

        {/* Header Image/Banner */}
        <div className="relative w-full h-40 bg-primary">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCDckfNuUz3nPrhirGAn0djRllDeXszU8UpEJatBNmJix59I9_CKpv_jtPBuJwHU1M5sp7nZ4dnBbgFBU-O49lKj653cwum1zzPcQqul0TVS0TUHoM-GclZfyq7r-TqrbfghSpZ86G712BiPgRHoUSNFF5lorYAB4DNqh40Nbd56w-LSs3nh9CBwocQCNZojObI2AWzTNlYl2cEDhGB0lu8j_iXW8yz4IHs3agg5YnjRg7O-zAIhetyCYgHsvSB8r4v_jk1-0rL5zc")' }}
          ></div>
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center justify-between">
            <button
              onClick={() => navigate('explore')}
              className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 p-6 z-20">
            <span className="text-white/80 font-sans text-xs font-bold tracking-widest uppercase mb-1 block">Topic</span>
            <h1 className="text-white text-3xl font-bold font-display">{topic || 'All Stories'}</h1>
          </div>
        </div>

        <div className="flex flex-col px-4 pt-6 gap-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-xs font-bold font-sans text-primary/40 dark:text-white/40 uppercase tracking-widest">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'Story' : 'Stories'}
            </p>
            <div className="flex items-center gap-1 text-primary/60 dark:text-gray-400">
              <span className="material-symbols-outlined text-[16px]">sort</span>
              <span className="text-xs font-sans font-medium">Latest</span>
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
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
                  <div
                    className="w-20 h-20 shrink-0 rounded-lg bg-cover bg-center shadow-inner"
                    style={{ backgroundImage: `url('${article.imageUrl}')` }}
                  ></div>
                </div>
              </article>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-8 opacity-60">
              <div className="mb-4 text-primary/30 dark:text-white/30">
                <span className="material-symbols-outlined text-[48px]">search_off</span>
              </div>
              <p className="text-primary dark:text-white font-sans font-medium">No stories found</p>
              <p className="text-sm text-primary/60 dark:text-gray-400 mt-2">Try searching for a different keyword or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topic;