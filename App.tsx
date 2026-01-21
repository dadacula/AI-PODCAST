import React, { useState, useEffect, ReactNode } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSavedArticles } from './hooks/useSavedArticles';
import { usePreferences } from './hooks/usePreferences';
import { useInterests } from './hooks/useInterests';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Explore from './screens/Explore';
import ArticleScreen from './screens/Article';
import Saved from './screens/Saved';
import Settings from './screens/Settings';
import Profile from './screens/Profile';
import Interests from './screens/Interests';
import Topic from './screens/Topic';
import Login from './screens/Login';
import { Screen, Article } from './types';
import { fetchNews, ARTICLES } from './data';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { savedArticleIds, toggleSave, isArticleSaved, isConfigured, loading: savedLoading, error: savedError } = useSavedArticles();
  const { preferences, updatePreferences, loading: prefsLoading, error: prefsError } = usePreferences();
  const { userInterests, refreshInterests, loading: interestsLoading, error: interestsError } = useInterests();

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    if (localStorage.getItem('onboarding_completed') === 'true') {
      return 'login';
    }
    return 'onboarding';
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('[App] State:', {
      user: !!user,
      authLoading,
      savedLoading,
      prefsLoading,
      interestsLoading,
      currentScreen,
      articlesCount: articles.length,
      interestsCount: userInterests.length
    });

    if (savedError) console.error('[App] Saved articles error:', savedError);
    if (prefsError) console.error('[App] Preferences error:', prefsError);
    if (interestsError) console.error('[App] Interests error:', interestsError);
  }, [user, authLoading, savedLoading, prefsLoading, interestsLoading, currentScreen, savedError, prefsError, interestsError, articles.length, userInterests.length]);

  // Initial redirect if logged in
  useEffect(() => {
    if (!authLoading && user && (currentScreen === 'onboarding' || currentScreen === 'login')) {
      setCurrentScreen('home');
    }
  }, [authLoading, user, currentScreen]);

  // Theme Effect
  useEffect(() => {
    if (preferences.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.isDarkMode]);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const fetchedArticles = await fetchNews();
      if (fetchedArticles.length > 0) {
        setArticles(fetchedArticles);
      } else {
        setArticles(ARTICLES);
      }
    } catch (err) {
      setArticles(ARTICLES);
    }
    setIsLoading(false);
  };

  // Fetch articles on mount
  useEffect(() => {
    loadNews();
  }, []);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setAutoPlay(false);
    navigate('article');
  };

  const handlePlayClick = (article: Article) => {
    setSelectedArticle(article);
    setAutoPlay(true);
    navigate('article');
  };

  const handleTopicClick = (topicName: string) => {
    setSelectedTopic(topicName);
    navigate('topic');
  };

  // Show loading screen while auth or user-dependent hooks are initializing
  const isInitializing = authLoading || (user && (savedLoading || prefsLoading || interestsLoading));

  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center gap-4 bg-[#f0f2f5] dark:bg-black text-primary dark:text-white">
        <span className="animate-spin material-symbols-outlined text-4xl">sync</span>
        <p className="text-sm text-primary/60 dark:text-white/60">Loading your personalized feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#f0f2f5] dark:bg-black font-sans transition-colors duration-300">
      <div className="w-full max-w-[430px] bg-background-light dark:bg-background-dark shadow-2xl relative min-h-screen transition-colors duration-300 overflow-hidden">

        {!isConfigured && (
          <div className="bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-[10px] text-amber-800 dark:text-amber-200 font-sans text-center relative z-[100]">
            ⚠️ Supabase 未配置。请在 .env 文件中填入 VITE_SUPABASE_URL 和 KEY。
          </div>
        )}

        {currentScreen === 'onboarding' && (
          <Onboarding onFinish={() => {
            refreshInterests();
            navigate(user ? 'home' : 'login');
          }} />
        )}

        {currentScreen === 'login' && (
          <Login navigate={navigate} />
        )}

        {currentScreen === 'home' && (
          <Home
            navigate={navigate}
            onArticleClick={handleArticleClick}
            onPlayClick={handlePlayClick}
            articles={articles.filter(a => userInterests.length === 0 || userInterests.includes(a.category))}
            isLoading={isLoading}
            isSaved={isArticleSaved}
            onToggleSave={toggleSave}
            onRefresh={loadNews}
          />
        )}

        {currentScreen === 'explore' && (
          <Explore
            navigate={navigate}
            onTopicClick={handleTopicClick}
            onArticleClick={handleArticleClick}
            articles={articles.filter(a => userInterests.length === 0 || userInterests.includes(a.category))}
          />
        )}

        {currentScreen === 'saved' && (
          <Saved
            navigate={navigate}
            savedIds={savedArticleIds}
            onArticleClick={handleArticleClick}
            allArticles={articles}
          />
        )}

        {currentScreen === 'settings' && (
          <Settings
            navigate={navigate}
            isDark={preferences.isDarkMode}
            toggleTheme={() => updatePreferences({ isDarkMode: !preferences.isDarkMode })}
          />
        )}

        {currentScreen === 'profile' && (
          <Profile navigate={navigate} />
        )}

        {currentScreen === 'interests' && (
          <Interests navigate={navigate} />
        )}

        {currentScreen === 'topic' && (
          <Topic
            topic={selectedTopic}
            navigate={navigate}
            onArticleClick={handleArticleClick}
            articles={articles.filter(a => userInterests.length === 0 || userInterests.includes(a.category))}
            isSaved={isArticleSaved}
            onToggleSave={toggleSave}
          />
        )}

        {currentScreen === 'article' && selectedArticle && (
          <ArticleScreen
            article={selectedArticle}
            onBack={() => navigate('home')}
            isSaved={isArticleSaved(selectedArticle.id)}
            onToggleSave={toggleSave}
            onCategoryClick={handleTopicClick}
            autoPlay={autoPlay}
          />
        )}

      </div>
    </div>
  );
};

// Simplified ErrorBoundary using a simple state check
const App: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-red-50 p-8 text-center" style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, width: '100vw' }}>
        <h1 className="text-2xl font-bold text-red-600 mb-4">应用运行出错</h1>
        <p className="text-red-500 mb-6">{error.message || "未知错误"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg"
        >
          刷新页面
        </button>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;