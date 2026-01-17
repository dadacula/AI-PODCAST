import React, { useState } from 'react';
import { INTERESTS } from '../data';

interface OnboardingProps {
  onFinish: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [selected, setSelected] = useState<string[]>(['Politics', 'Technology']);

  const toggleInterest = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    // Save to localStorage for guest users
    localStorage.setItem('user_interests', JSON.stringify(selected));
    localStorage.setItem('onboarding_completed', 'true');
    onFinish();
  };

  return (
    <div className="relative flex flex-col h-full overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Progress Header */}
      <div className="flex w-full flex-row items-center justify-center gap-3 py-6 px-6">
        <div className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-white opacity-20"></div>
        <div className="h-1.5 w-12 rounded-full bg-primary dark:bg-white"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-white opacity-20"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-white opacity-20"></div>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar">
        {/* Headline */}
        <div className="pb-8 pt-2">
          <h1 className="text-primary dark:text-white text-[42px] font-medium leading-[1.1] tracking-tight mb-3 font-display">
            Curate Your <br /><span className="italic font-light opacity-90">Edition</span>
          </h1>
          <p className="text-primary/70 dark:text-gray-400 text-lg font-normal leading-relaxed max-w-[90%] font-display">
            Tailor your daily briefing. Select the voices and topics that matter to you.
          </p>
        </div>

        {/* Interest Grid */}
        <div>
          <h3 className="text-primary/60 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 px-1 font-sans">Select Interests</h3>
          <div className="grid grid-cols-2 gap-4">
            {INTERESTS.map((interest) => {
              const isSelected = selected.includes(interest.id);
              return (
                <div
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer shadow-soft transition-all duration-300 ${isSelected
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark'
                    : 'border border-transparent hover:border-primary/20'
                    }`}
                >
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${isSelected ? '' : 'grayscale group-hover:grayscale-0'}`}
                    style={{ backgroundImage: `url("${interest.imageUrl}")` }}
                  ></div>
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${isSelected ? '' : 'opacity-80 group-hover:opacity-60 transition-opacity'}`}></div>

                  {/* Checkmark or Circle */}
                  <div className="absolute top-3 right-3 transition-transform">
                    {isSelected ? (
                      <div className="bg-primary text-white rounded-full p-1 shadow-lg transform scale-100">
                        <span className="material-symbols-outlined text-[16px] font-bold block">check</span>
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm group-hover:border-white/60 transition-colors"></div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <p className={`text-xl font-medium italic tracking-wide font-display ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                      {interest.name}
                    </p>
                    <p className={`text-xs mt-1 font-sans font-light tracking-wide uppercase ${isSelected ? 'text-white/70' : 'text-white/50 group-hover:text-white/70'}`}>
                      {interest.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-8"></div>
      </div>

      {/* Sticky Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95 pointer-events-none"></div>
        <div className="relative px-6 pb-8 pt-4 flex flex-col gap-4">
          <button
            onClick={handleFinish}
            className="w-full bg-primary hover:bg-primary-dark dark:bg-white dark:hover:bg-gray-200 text-white dark:text-primary rounded-xl py-4 shadow-floating active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <span className="text-lg font-bold tracking-wide font-display">Build My Feed</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;