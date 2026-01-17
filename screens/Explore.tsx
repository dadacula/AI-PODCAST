import React, { useState, useMemo } from 'react';
import { Screen, Article, TrendingTopic } from '../types';
import { HISTORY } from '../data';
import BottomNav from '../components/BottomNav';

interface ExploreProps {
  navigate: (screen: Screen) => void;
  onTopicClick: (topic: string) => void;
  articles: Article[];
}

const Explore: React.FC<ExploreProps> = ({ navigate, onTopicClick, articles }) => {
  const [query, setQuery] = useState('');
  const [historyItems, setHistoryItems] = useState<string[]>(HISTORY);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Dynamic Trending Logic
  const trendingTopics = useMemo(() => {
    if (articles.length === 0) return [];

    // 1. Group by Category
    const counts: Record<string, number> = {};
    articles.forEach(article => {
        const cat = article.category;
        counts[cat] = (counts[cat] || 0) + 1;
    });

    // 2. Sort by Count
    const sortedCategories = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);

    // 3. Map to TrendingTopic shape
    const paths = [
        'M0,15 Q10,18 20,10 T40,5',
        'M0,10 L10,12 L20,8 L30,5 L40,2',
        'M0,18 L15,15 L25,10 L40,8',
        'M0,12 Q15,5 25,12 T40,10'
    ];

    return sortedCategories.map((item, index) => {
        const [name, count] = item;
        const total = articles.length;
        const percentage = Math.round((count / total) * 100);
        
        return {
            id: index,
            rank: `#0${index + 1}`,
            name: name,
            volume: `+${percentage}% vol`,
            path: paths[index % paths.length]
        } as TrendingTopic;
    });
  }, [articles]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (!historyItems.includes(query)) {
        setHistoryItems([query, ...historyItems]);
    }
    onTopicClick(query);
    setQuery('');
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
  };

  const handleMicClick = () => {
    alert("Listening for search query...");
  };

  const filters = [
      { id: 'World', label: 'World' },
      { id: 'Business', label: 'Business' },
      { id: 'Politics', label: 'Politics' },
      { id: 'Technology', label: 'Technology' },
      { id: 'Science', label: 'Science' }
  ];

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
       {/* Main Content */}
       <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Header */}
        <header className="px-6 pt-12 pb-4">
            <h1 className="text-primary dark:text-white text-[40px] font-medium tracking-tight leading-none italic font-display">Explore</h1>
        </header>

        {/* Search Bar */}
        <div className="px-6 mb-6">
            <form onSubmit={handleSearch} className="group flex items-center w-full h-14 rounded-lg bg-white dark:bg-[#2c2830] shadow-paper transition-shadow duration-300 focus-within:shadow-md border border-transparent focus-within:border-primary/10">
                <div className="pl-4 pr-3 text-primary/40 dark:text-white/40">
                    <span className="material-symbols-outlined text-[24px]">search</span>
                </div>
                <input 
                    className="flex-1 h-full bg-transparent border-none p-0 text-xl placeholder:text-primary/30 dark:placeholder:text-white/30 text-primary dark:text-white focus:ring-0 font-display italic tracking-wide outline-none" 
                    placeholder="Search global news..." 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="button" onClick={handleMicClick} className="pr-4 text-primary/40 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>
            </form>
        </div>

        {/* Chips */}
        <div className="w-full overflow-x-auto no-scrollbar pl-6 pb-2 mb-6">
            <div className="flex gap-3 pr-6">
                <button className="flex shrink-0 items-center justify-center size-10 rounded-full border border-primary/20 dark:border-white/20 text-primary dark:text-white bg-transparent hover:bg-primary/5 dark:hover:bg-white/5 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                </button>
                {filters.map(filter => (
                    <button 
                        key={filter.id}
                        onClick={() => onTopicClick(filter.id)}
                        className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-4 transition-all ${
                            activeFilter === filter.id 
                            ? 'bg-primary text-white shadow-paper'
                            : 'bg-transparent border border-primary/20 dark:border-white/20 text-primary dark:text-white hover:bg-primary/5 dark:hover:bg-white/5'
                        }`}
                    >
                        <p className="text-sm font-sans font-medium tracking-wide">{filter.label}</p>
                    </button>
                ))}
            </div>
        </div>

        {/* Recent History */}
        {historyItems.length > 0 && (
            <div className="mb-8">
                <div className="px-6 pb-3 pt-2 flex items-baseline justify-between">
                    <h3 className="text-accent-gold text-xs font-sans font-bold tracking-widest uppercase">Recent History</h3>
                    <button 
                        onClick={handleClearHistory}
                        className="text-primary/40 dark:text-white/40 text-xs font-sans font-medium hover:text-primary dark:hover:text-white transition-colors"
                    >
                        Clear
                    </button>
                </div>
                <div className="flex flex-col">
                    {historyItems.map((item, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => onTopicClick(item)}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center justify-center size-8 rounded-full bg-primary/5 dark:bg-white/10 text-primary dark:text-white group-hover:bg-white dark:group-hover:bg-[#2c2830] transition-colors">
                                <span className="material-symbols-outlined text-[18px]">history</span>
                            </div>
                            <p className="text-primary dark:text-white text-lg font-display italic flex-1 truncate text-left">{item}</p>
                            <span className="material-symbols-outlined text-primary/20 dark:text-white/20 text-[20px] -rotate-45 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Trending */}
        <div className="px-6 flex-1">
            <h3 className="text-accent-gold text-xs font-sans font-bold tracking-widest uppercase mb-4">Trending Now</h3>
            {trendingTopics.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    {trendingTopics.map((trend) => (
                        <button 
                            key={trend.id} 
                            onClick={() => onTopicClick(trend.name)}
                            className="relative bg-white dark:bg-[#2c2830] p-4 rounded-xl shadow-paper flex flex-col justify-between h-32 group hover:-translate-y-1 transition-transform duration-300 border border-transparent hover:border-accent-gold/20 text-left"
                        >
                            <div className="flex justify-between items-start w-full">
                                <span className="text-accent-gold font-sans font-bold text-xs">{trend.rank}</span>
                                <div className="w-8 h-4">
                                    <svg className="stroke-primary/40 dark:stroke-white/40 fill-none" strokeWidth="2" viewBox="0 0 40 20">
                                        <path d={trend.path}></path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-primary dark:text-white text-xl font-display font-medium leading-tight mb-1 truncate w-full">{trend.name}</h4>
                                <p className="text-primary/50 dark:text-white/50 text-xs font-sans">{trend.volume}</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center bg-white dark:bg-[#2c2830] rounded-xl border border-dashed border-primary/10">
                    <p className="text-primary/40 font-sans text-sm">Gathering trends...</p>
                </div>
            )}
        </div>

        {/* End decoration */}
        <div className="flex items-center justify-center mt-12 opacity-30">
            <span className="text-accent-gold text-2xl font-display italic">~</span>
        </div>

       </div>
       <BottomNav activeScreen="explore" navigate={navigate} />
    </div>
  );
};

export default Explore;