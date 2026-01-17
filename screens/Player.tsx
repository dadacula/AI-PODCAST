import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { fetchFullArticle } from '../data';
import { useListeningHistory } from '../hooks/useListeningHistory';
import { usePreferences } from '../hooks/usePreferences';

interface PlayerScreenProps {
    article: Article;
    onBack: () => void;
    onNavigateHome: () => void;
    onRead: () => void;
}

const PlayerScreen: React.FC<PlayerScreenProps> = ({ article, onBack, onNavigateHome, onRead }) => {
    const { preferences, updatePreferences } = usePreferences();
    const { getProgress, updateProgress, markAsCompleted } = useListeningHistory();

    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(preferences.playbackSpeed);
    const [isHumanVoice, setIsHumanVoice] = useState(preferences.preferredVoice === 'human');
    const [durationStr, setDurationStr] = useState("Loading...");
    const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
    const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);

    const synth = window.speechSynthesis;
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const saveProgressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load saved progress on mount
    useEffect(() => {
        const savedProgress = getProgress(article.id);
        if (savedProgress > 0 && savedProgress < 100) {
            setProgress(savedProgress);
        }
    }, [article.id, getProgress]);

    // Initialize Player
    useEffect(() => {
        let isMounted = true;

        const prepareAudio = async () => {
            // Stop any previous playback
            synth.cancel();

            // Estimate initial duration from summary while loading
            const summaryWordCount = (article.content || "").split(/\s+/).length + article.title.split(/\s+/).length;
            const estMinutes = Math.ceil(summaryWordCount / 150); // ~150 wpm
            setDurationStr(`${estMinutes}m`);

            // Try to get full text
            let textToRead = article.content || "";
            if (article.link) {
                const fullText = await fetchFullArticle(article.link);
                if (isMounted && fullText && !fullText.startsWith("Error") && !fullText.startsWith("Unable")) {
                    textToRead = fullText;
                }
            }

            if (!isMounted) return;

            // Prepare text
            const fullContent = `${article.title}. Reported by ${article.source}. ${textToRead}`;

            // Calculate more accurate duration
            const wordCount = fullContent.split(/\s+/).length;
            const durationMin = Math.floor(wordCount / 140);
            const durationSec = Math.floor(((wordCount / 140) - durationMin) * 60);
            const totalSeconds = durationMin * 60 + durationSec;
            setTotalDurationSeconds(totalSeconds);
            setDurationStr(`${durationMin}:${durationSec.toString().padStart(2, '0')}`);

            // Create Utterance
            const utterance = new SpeechSynthesisUtterance(fullContent);
            utterance.rate = speed;
            utterance.pitch = 1;
            utterance.volume = 1;

            // Attempt to select a better voice
            const voices = synth.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha")) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onboundary = (event) => {
                if (!isMounted) return;
                const charIndex = event.charIndex;
                const textLen = fullContent.length;
                const pct = (charIndex / textLen) * 100;
                setProgress(pct);

                // Update current time display
                const currentSeconds = (pct / 100) * totalSeconds;
                const cMin = Math.floor(currentSeconds / 60);
                const cSec = Math.floor(currentSeconds % 60);
                setCurrentTimeStr(`${cMin}:${cSec.toString().padStart(2, '0')}`);

                // Debounced save to database
                if (saveProgressTimeoutRef.current) {
                    clearTimeout(saveProgressTimeoutRef.current);
                }
                saveProgressTimeoutRef.current = setTimeout(() => {
                    updateProgress(article.id, pct, totalSeconds);
                }, 5000); // Save every 5 seconds max
            };

            utterance.onend = () => {
                if (isMounted) {
                    setIsPlaying(false);
                    setProgress(100);
                    setCurrentTimeStr(durationStr);
                    markAsCompleted(article.id);
                }
            };

            utteranceRef.current = utterance;

            // Small delay to ensure browser is ready
            setTimeout(() => {
                if (isMounted) {
                    synth.speak(utterance);
                    setIsPlaying(true);
                }
            }, 500);
        };

        prepareAudio();

        return () => {
            isMounted = false;
            synth.cancel();
            // Save progress on unmount
            if (progress > 0 && progress < 100) {
                updateProgress(article.id, progress, totalDurationSeconds);
            }
            if (saveProgressTimeoutRef.current) {
                clearTimeout(saveProgressTimeoutRef.current);
            }
        };
    }, [article.id, article.link]); // Re-run if article changes

    // Handle Play/Pause toggle
    useEffect(() => {
        if (isPlaying) {
            if (synth.paused) synth.resume();
        } else {
            if (synth.speaking) synth.pause();
        }
    }, [isPlaying]);

    const cycleSpeed = () => {
        const newSpeed = speed === 1.0 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 0.75 : 1.0;
        setSpeed(newSpeed);
        updatePreferences({ playbackSpeed: newSpeed });

        // Applying speed usually requires restarting the utterance in Web Speech API, 
        // but for simplicity in this prototype we just set state. 
        // In a full implementation, we would cancel and seek to current charIndex.
        if (utteranceRef.current) {
            // Cancel and restart is complex without 'seek' support in Web Speech API.
            // We will just update the ref for next play, or user can pause/play to maybe apply it depending on browser.
            // For now, we alert the user of the limitation or just update the state.
        }
    };

    const handleVoiceChange = (useHuman: boolean) => {
        setIsHumanVoice(useHuman);
        updatePreferences({ preferredVoice: useHuman ? 'human' : 'ai' });
    };

    const handleAirplay = () => {
        alert("Searching for Airplay devices...");
    };

    return (
        <div className="relative flex flex-col h-full w-full bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 pt-12 pb-4 shrink-0 z-10">
                <button
                    onClick={onBack}
                    className="text-primary dark:text-white/80 p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined text-[28px]">keyboard_arrow_down</span>
                </button>
                <h2 className="text-primary dark:text-white/90 font-sans text-[11px] font-bold tracking-[0.2em] uppercase opacity-80">Now Playing</h2>
                <button className="text-primary dark:text-white/80 p-2 -mr-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-[24px]">more_horiz</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col px-8 items-center justify-start pt-4 pb-8 overflow-y-auto no-scrollbar">
                {/* Cover Art */}
                <div className="relative w-full aspect-square max-w-[320px] mb-10 group">
                    <div className={`absolute inset-4 bg-primary/20 blur-xl rounded-full translate-y-4 scale-95 transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
                    <div
                        className="relative h-full w-full bg-center bg-no-repeat bg-cover rounded-xl shadow-soft dark:shadow-none dark:border dark:border-white/10"
                        style={{ backgroundImage: `url('${article.imageUrl}')` }}
                    ></div>
                </div>

                <div className="w-full text-center space-y-3 mb-8">
                    <h1 className="text-primary dark:text-white font-display text-3xl font-semibold leading-tight tracking-tight line-clamp-2">
                        {article.title}
                    </h1>
                    <p className="font-sans text-sm font-medium tracking-wide text-accent-gold">
                        {article.source} <span className="mx-1 opacity-60">•</span> <span className="text-gray-500 dark:text-gray-400 font-normal">Narrated by {isHumanVoice ? 'David O.' : 'AI Assistant'}</span>
                    </p>
                </div>

                {/* Scrubber */}
                <div className="w-full mb-8">
                    <div className="relative flex w-full flex-col gap-3">
                        <div
                            className="group relative flex h-6 w-full items-center cursor-pointer"
                        // Web Speech API doesn't support seeking easily, so this visual only for now
                        >
                            <div className="absolute w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[45%] bg-primary/20 dark:bg-white/20"></div>
                            </div>
                            <div className="absolute h-1 rounded-full bg-primary dark:bg-accent-gold z-10 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            <div
                                className="absolute h-4 w-4 rounded-full bg-primary dark:bg-accent-gold shadow-md z-20 border-2 border-white dark:border-background-dark transform scale-100 transition-all duration-300"
                                style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                            ></div>
                        </div>
                        <div className="flex w-full items-center justify-between px-1">
                            <p className="font-sans text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums">
                                {currentTimeStr}
                            </p>
                            <p className="font-sans text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums">{durationStr}</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full flex items-center justify-between mb-auto">
                    <button
                        onClick={cycleSpeed}
                        className="font-sans text-xs font-bold text-gray-900 dark:text-white px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors w-12"
                    >
                        {speed}x
                    </button>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => { synth.cancel(); setIsPlaying(false); }} // Restart/Rewind hack
                            className="text-primary dark:text-white/90 hover:text-accent-gold dark:hover:text-accent-gold transition-colors p-2"
                        >
                            <span className="material-symbols-outlined text-[32px]">replay_10</span>
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="bg-primary dark:bg-white text-white dark:text-primary rounded-full size-20 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-[40px] icon-filled">{isPlaying ? 'pause' : 'play_arrow'}</span>
                        </button>
                        <button
                            className="text-primary dark:text-white/90 hover:text-accent-gold dark:hover:text-accent-gold transition-colors p-2 opacity-50 cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[32px]">forward_10</span>
                        </button>
                    </div>
                    <button
                        onClick={handleAirplay}
                        className="text-primary dark:text-white/90 hover:text-accent-gold dark:hover:text-accent-gold transition-colors p-2"
                    >
                        <span className="material-symbols-outlined text-[24px]">airplay</span>
                    </button>
                </div>
            </main>

            {/* Control Deck */}
            <div className="w-full px-6 pb-8 pt-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark">
                <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm rounded-2xl p-2 flex items-center justify-between gap-2">
                    <div className="flex-1 bg-gray-50 dark:bg-black/20 rounded-xl p-1 flex relative items-center">
                        {/* Slider BG */}
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary dark:bg-accent-gold rounded-lg shadow-sm z-0 transition-all duration-300 ${isHumanVoice ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                        ></div>
                        <button
                            onClick={() => handleVoiceChange(false)}
                            className={`relative z-10 flex-1 py-3 text-xs font-bold font-sans text-center transition-colors ${!isHumanVoice ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}
                        >
                            AI Voice
                        </button>
                        <button
                            onClick={() => handleVoiceChange(true)}
                            className={`relative z-10 flex-1 py-3 text-xs font-bold font-sans text-center transition-colors flex items-center justify-center gap-1.5 ${isHumanVoice ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">person</span>
                            Human
                        </button>
                    </div>
                    <button
                        onClick={onRead}
                        className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                    >
                        <span className="material-symbols-outlined text-primary dark:text-white/90 text-[20px] group-hover:scale-110 transition-transform">menu_book</span>
                        <span className="font-sans text-xs font-bold text-primary dark:text-white/90 whitespace-nowrap">Read</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerScreen;
