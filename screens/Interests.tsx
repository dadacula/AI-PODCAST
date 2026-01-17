import React from 'react';
import { Screen } from '../types';
import { INTERESTS } from '../data';
import { useInterests } from '../hooks/useInterests';

interface InterestsProps {
    navigate: (screen: Screen) => void;
}

const Interests: React.FC<InterestsProps> = ({ navigate }) => {
    const { userInterests, toggleInterest, isInterestSelected, loading } = useInterests();

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen items-center justify-center">
                <div className="w-10 h-10 border-3 border-primary/20 dark:border-white/20 border-t-primary dark:border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                <header className="px-6 pt-6 pb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate('settings')}
                        className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-primary dark:text-white text-[24px]">arrow_back</span>
                    </button>
                    <h1 className="text-primary dark:text-white text-xl font-bold font-display">Manage Interests</h1>
                </header>

                <div className="px-6 pb-4">
                    <p className="text-primary/70 dark:text-gray-400 text-sm font-sans leading-relaxed">
                        Customize your feed by selecting the topics you want to see. Changes are saved automatically.
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-accent-gold text-xs font-bold font-sans">{userInterests.length}</span>
                        <span className="text-primary/50 dark:text-gray-500 text-xs font-sans">topics selected</span>
                    </div>
                </div>

                <div className="px-4 grid grid-cols-1 gap-3">
                    {INTERESTS.map((interest) => {
                        const isSelected = isInterestSelected(interest.id);
                        return (
                            <button
                                key={interest.id}
                                onClick={() => toggleInterest(interest.id)}
                                className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 ${isSelected
                                        ? 'bg-white dark:bg-surface-dark border-primary/20 dark:border-white/20 shadow-sm'
                                        : 'bg-transparent border-transparent opacity-70 hover:opacity-100 hover:bg-primary/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                <div
                                    className="h-14 w-14 rounded-lg bg-cover bg-center shrink-0"
                                    style={{ backgroundImage: `url('${interest.imageUrl}')` }}
                                ></div>
                                <div className="flex-1 text-left">
                                    <h3 className={`font-display text-lg font-bold ${isSelected ? 'text-primary dark:text-white' : 'text-primary/60 dark:text-white/60'}`}>
                                        {interest.name}
                                    </h3>
                                    <p className="text-xs text-primary/50 dark:text-gray-500 font-sans">{interest.subtitle}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected
                                        ? 'bg-primary dark:bg-white border-primary dark:border-white'
                                        : 'border-primary/30 dark:border-white/30'
                                    }`}>
                                    {isSelected && (
                                        <span className="material-symbols-outlined text-white dark:text-primary text-[16px] font-bold">check</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Interests;
