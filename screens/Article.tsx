import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { fetchFullArticle } from '../data';
import { useListeningHistory } from '../hooks/useListeningHistory';
import { usePreferences } from '../hooks/usePreferences';

interface ArticleScreenProps {
    article: Article;
    onBack: () => void;
    isSaved?: boolean;
    onToggleSave?: (id: string) => void;
    onCategoryClick: (category: string) => void;
    autoPlay?: boolean;
}

const ArticleScreen: React.FC<ArticleScreenProps> = ({
    article,
    onBack,
    isSaved = false,
    onToggleSave = (_id: string) => { },
    onCategoryClick,
    autoPlay = false
}) => {
    const { preferences, updatePreferences } = usePreferences();
    const { getProgress, updateProgress, markAsCompleted } = useListeningHistory();

    const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('base');
    const [fullContent, setFullContent] = useState<string | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Audio Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayer, setShowPlayer] = useState(autoPlay);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(preferences.playbackSpeed);
    const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
    const [durationStr, setDurationStr] = useState("...");
    const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);

    const synth = window.speechSynthesis;
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const saveProgressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load Saved Progress
    useEffect(() => {
        const savedProgress = getProgress(article.id);
        if (savedProgress > 0 && savedProgress < 100) {
            setProgress(savedProgress);
        }
    }, [article.id, getProgress]);

    // Fetch full content on mount
    useEffect(() => {
        const loadContent = async () => {
            if (!article.link) return;
            setIsLoadingContent(true);
            const text = await fetchFullArticle(article.link);
            setFullContent(text);
            setIsLoadingContent(false);
        };
        loadContent();
    }, [article.link]);

    // Initialize/Update Audio
    useEffect(() => {
        if (!showPlayer) {
            synth.cancel();
            return;
        }

        let isMounted = true;
        const prepareAudio = async () => {
            synth.cancel();

            let textToRead = fullContent || article.content || "";
            const completeText = `${article.title}. Published by ${article.source}. ${textToRead}`;

            // Duration estimation
            const wordCount = completeText.split(/\s+/).length;
            const totalSeconds = Math.floor(wordCount / (140 / 60) / speed);
            setTotalDurationSeconds(totalSeconds);
            const min = Math.floor(totalSeconds / 60);
            const sec = totalSeconds % 60;
            setDurationStr(`${min}:${sec.toString().padStart(2, '0')}`);

            const utterance = new SpeechSynthesisUtterance(completeText);
            utterance.rate = speed;

            const voices = synth.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha")) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onboundary = (event) => {
                if (!isMounted) return;
                const pct = (event.charIndex / completeText.length) * 100;
                setProgress(pct);

                const currentSec = (pct / 100) * totalSeconds;
                const cMin = Math.floor(currentSec / 60);
                const cSec = Math.floor(currentSec % 60);
                setCurrentTimeStr(`${cMin}:${cSec.toString().padStart(2, '0')}`);

                // Debounced save
                if (saveProgressTimeoutRef.current) clearTimeout(saveProgressTimeoutRef.current);
                saveProgressTimeoutRef.current = setTimeout(() => {
                    updateProgress(article.id, pct, totalSeconds);
                }, 5000);
            };

            utterance.onend = () => {
                if (isMounted) {
                    setIsPlaying(false);
                    setProgress(100);
                    markAsCompleted(article.id);
                }
            };

            utteranceRef.current = utterance;

            if (isMounted) {
                synth.speak(utterance);
                setIsPlaying(true);
            }
        };

        prepareAudio();

        return () => {
            isMounted = false;
            synth.cancel();
            if (saveProgressTimeoutRef.current) clearTimeout(saveProgressTimeoutRef.current);
        };
    }, [showPlayer, article.id, fullContent, speed]);

    // Handle Play/Pause toggle
    useEffect(() => {
        if (isPlaying) {
            if (synth.paused) synth.resume();
        } else {
            if (synth.speaking) synth.pause();
        }
    }, [isPlaying]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrolled(e.currentTarget.scrollTop > 50);
    };

    const handleShare = async () => {
        const shareData = {
            title: article.title,
            text: `Listen to this: ${article.title}`,
            url: article.link || window.location.href
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (err) { }
        } else {
            navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert("Link copied!");
        }
    };

    const cycleFontSize = () => {
        setFontSize(prev => prev === 'base' ? 'lg' : prev === 'lg' ? 'xl' : 'base');
    };

    const cycleSpeed = () => {
        const next = speed === 1.0 ? 1.25 : speed === 1.25 ? 1.5 : 1.0;
        setSpeed(next);
        updatePreferences({ playbackSpeed: next });
    };

    const fontSizeClass = {
        'base': 'text-[18px] leading-8',
        'lg': 'text-[21px] leading-9',
        'xl': 'text-[24px] leading-10',
    };

    return (
        <div className="relative flex h-full w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Sticky Nav */}
            <nav
                className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 transition-all duration-300 ${scrolled ? 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm' : 'bg-gradient-to-b from-black/60 to-transparent'
                    }`}
            >
                <button
                    onClick={onBack}
                    className={`flex items-center justify-center p-2 -ml-2 rounded-full transition-colors active:scale-95 ${scrolled ? 'text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/10' : 'text-white hover:bg-white/20'}`}
                >
                    <span className="material-symbols-outlined text-[28px]">arrow_back</span>
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggleSave(article.id)}
                        className={`flex items-center justify-center p-2 rounded-full transition-colors active:scale-95 ${scrolled ? 'hover:bg-black/5 dark:hover:bg-white/10' : 'hover:bg-white/20'}`}
                    >
                        <span className={`material-symbols-outlined text-[24px] ${isSaved ? 'icon-filled text-accent-gold' : scrolled ? 'text-primary dark:text-white' : 'text-white'}`}>
                            {isSaved ? 'bookmark' : 'bookmark_border'}
                        </span>
                    </button>
                    <button
                        onClick={handleShare}
                        className={`flex items-center justify-center p-2 rounded-full transition-colors active:scale-95 ${scrolled ? 'text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/10' : 'text-white hover:bg-white/20'}`}
                    >
                        <span className="material-symbols-outlined text-[24px]">share</span>
                    </button>
                    <button
                        onClick={cycleFontSize}
                        className={`flex items-center justify-center p-2 -mr-2 rounded-full font-sans font-bold text-lg active:scale-95 transition-colors ${scrolled ? 'text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/10' : 'text-white hover:bg-white/20'}`}
                    >
                        Aa
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar w-full pb-32" onScroll={handleScroll}>

                {/* Immersive Hero Image */}
                <div className="relative w-full h-[55vh] shrink-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${article.imageUrl}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-24 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/60 dark:via-background-dark/80 to-transparent">
                        <div className="flex items-center gap-2 mb-3 opacity-90">
                            <button
                                onClick={() => onCategoryClick(article.category)}
                                className="px-2 py-0.5 rounded text-[11px] font-bold tracking-widest uppercase bg-accent-gold text-white font-sans shadow-sm"
                            >
                                {article.category}
                            </button>
                            <span className="text-[11px] font-bold text-primary/80 dark:text-white/80 font-sans uppercase tracking-wide">
                                {article.source} • {article.timeAgo}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold leading-[1.05] tracking-tight text-primary dark:text-white font-display">
                            {article.title}
                        </h1>
                    </div>
                </div>

                {/* Article Body */}
                <div className="px-6 relative">
                    <div className="flex flex-col gap-6 mb-8 mt-2 border-b border-primary/10 dark:border-white/10 pb-8">
                        {/* Author Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/10 dark:border-white/10 bg-gray-200">
                                    <img alt="Author" className="w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${article.author || article.source}&background=random`} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-primary dark:text-white font-sans">{article.author || article.source}</span>
                                    <span className="text-xs text-primary/60 dark:text-gray-400 font-sans">{article.date || 'Today'}</span>
                                </div>
                            </div>
                            <div className="text-xs font-semibold text-primary/50 dark:text-gray-500 font-sans bg-primary/5 dark:bg-white/5 px-3 py-1.5 rounded-full">
                                {article.readTime} read
                            </div>
                        </div>

                        {/* Integrated Play Button */}
                        {!showPlayer && (
                            <button
                                onClick={() => setShowPlayer(true)}
                                className="w-full bg-primary dark:bg-white text-white dark:text-primary rounded-xl p-4 flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <span className="material-symbols-outlined icon-filled">play_circle</span>
                                <span className="font-sans font-bold text-lg">Listen to this Article</span>
                                <span className="text-sm opacity-70 font-normal">({article.listenTime})</span>
                            </button>
                        )}
                    </div>

                    {/* Content Text */}
                    <article className={`text-primary/90 dark:text-gray-300 font-display transition-all duration-300 ${fontSizeClass[fontSize]}`}>
                        <p className="drop-cap mb-6 first-letter:float-left first-letter:text-[3.5em] first-letter:leading-[0.8] first-letter:pr-3 first-letter:font-bold first-letter:text-primary dark:first-letter:text-white">
                            {article.content}
                        </p>

                        {isLoadingContent ? (
                            <div className="space-y-6 animate-pulse opacity-60 mt-4">
                                <div className="h-4 bg-primary/10 dark:bg-white/10 rounded w-full"></div>
                                <div className="h-4 bg-primary/10 dark:bg-white/10 rounded w-[90%]"></div>
                                <div className="h-4 bg-primary/10 dark:bg-white/10 rounded w-[95%]"></div>
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap space-y-6">
                                {fullContent || 'Full story content loading...'}
                            </div>
                        )}

                        <div className="h-24 flex items-center justify-center mt-12 opacity-40">
                            <span className="text-accent-gold text-2xl font-display italic">~ End of Article ~</span>
                        </div>
                    </article>
                </div>
            </main>

            {/* Floating Player Control Bar */}
            {showPlayer && (
                <div className="fixed bottom-0 left-0 right-0 p-4 z-[60] bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent">
                    <div className="max-w-[400px] mx-auto bg-primary dark:bg-surface-dark text-white rounded-2xl shadow-2xl p-4 border border-white/10">
                        <div className="flex flex-col gap-3">
                            {/* Top Row: Title & Close */}
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-accent-gold uppercase tracking-widest truncate">Now Playing</span>
                                    <h4 className="text-xs font-bold truncate opacity-90">{article.title}</h4>
                                </div>
                                <button
                                    onClick={() => { setShowPlayer(false); setIsPlaying(false); synth.cancel(); }}
                                    className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>

                            {/* Middle Row: Progress */}
                            <div className="flex flex-col gap-1">
                                <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-accent-gold transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-sans opacity-60">
                                    <span>{currentTimeStr}</span>
                                    <span>{durationStr}</span>
                                </div>
                            </div>

                            {/* Bottom Row: Controls */}
                            <div className="flex items-center justify-between pt-1">
                                <button
                                    onClick={cycleSpeed}
                                    className="text-xs font-bold bg-white/10 px-2 py-1 rounded min-w-[40px] hover:bg-white/20"
                                >
                                    {speed.toFixed(2)}x
                                </button>

                                <div className="flex items-center gap-6">
                                    <button onClick={() => { synth.cancel(); synth.speak(utteranceRef.current!); }} className="hover:scale-110 active:scale-90 transition-transform">
                                        <span className="material-symbols-outlined">replay_10</span>
                                    </button>
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="h-12 w-12 rounded-full bg-white text-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-[32px] icon-filled">
                                            {isPlaying ? 'pause' : 'play_arrow'}
                                        </span>
                                    </button>
                                    <button className="opacity-30 cursor-not-allowed">
                                        <span className="material-symbols-outlined">forward_10</span>
                                    </button>
                                </div>

                                <div className="w-[40px] flex justify-end">
                                    <span className="material-symbols-outlined text-[20px] text-accent-gold animate-pulse">equalizer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleScreen;