import React from 'react';
import { Screen, Article } from '../types';
import BottomNav from '../components/BottomNav';

interface SavedProps {
  navigate: (screen: Screen) => void;
  savedIds: string[];
  onArticleClick: (article: Article) => void;
  allArticles: Article[];
}

const Saved: React.FC<SavedProps> = ({ navigate, savedIds, onArticleClick, allArticles }) => {
  const savedArticles = allArticles.filter(article => savedIds.includes(article.id));

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
       <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Header */}
        <header className="px-6 pt-12 pb-6 border-b border-primary/5 dark:border-white/5">
            <h1 className="text-primary dark:text-white text-[40px] font-medium tracking-tight leading-none italic font-display">Saved</h1>
            <p className="mt-2 text-primary/60 dark:text-gray-400 font-sans text-sm">
                {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'} in your collection
            </p>
        </header>

        <div className="flex flex-col px-4 pt-6 gap-3">
          {savedArticles.length > 0 ? (
            savedArticles.map((article) => (
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
                    <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-primary/60 dark:text-gray-400">
                        <span className="material-symbols-outlined text-[16px] text-accent-gold">bookmark</span>
                        <span className="text-xs font-sans font-medium">Saved</span>
                        </div>
                        <span className="text-[10px] text-primary/30 dark:text-gray-600 font-sans">{article.readTime} read</span>
                    </div>
                    </div>
                    <div className="w-20 h-20 shrink-0 rounded-lg shadow-inner overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
                </article>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                <div className="w-16 h-16 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary/30 dark:text-white/30 text-[32px]">bookmark_border</span>
                </div>
                <h3 className="text-primary dark:text-white font-display text-xl font-bold mb-2">No saved stories yet</h3>
                <p className="text-primary/60 dark:text-gray-400 font-sans text-sm leading-relaxed">
                    Tap the bookmark icon on any article to save it here for later reading or listening.
                </p>
                <button 
                    onClick={() => navigate('explore')}
                    className="mt-6 px-6 py-3 rounded-full bg-primary dark:bg-white text-white dark:text-primary font-bold font-sans text-sm shadow-lg active:scale-95 transition-transform"
                >
                    Start Exploring
                </button>
            </div>
          )}
        </div>
       </div>
       <BottomNav activeScreen="saved" navigate={navigate} />
    </div>
  );
};

export default Saved;
