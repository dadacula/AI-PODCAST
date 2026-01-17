import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface SavedArticlesHook {
    savedArticleIds: string[];
    loading: boolean;
    error: string | null;
    saveArticle: (articleId: string) => Promise<void>;
    unsaveArticle: (articleId: string) => Promise<void>;
    toggleSave: (articleId: string) => Promise<void>;
    isArticleSaved: (articleId: string) => boolean;
    refreshSavedArticles: () => Promise<void>;
    isConfigured: boolean;
}

export const isSupabaseConfigured =
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key';

export const useSavedArticles = (): SavedArticlesHook => {
    const { user } = useAuth();
    const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSavedArticles = useCallback(async () => {
        if (!user) {
            setSavedArticleIds([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('saved_articles')
                .select('article_id')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            const ids = (data as any[])?.map(item => item.article_id) || [];
            setSavedArticleIds(ids);
        } catch (err) {
            console.error('Error fetching saved articles:', err);
            setError('Failed to load saved articles');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchSavedArticles();
    }, [fetchSavedArticles]);

    const saveArticle = async (articleId: string) => {
        if (!user) return;

        try {
            // Optimistic update
            setSavedArticleIds(prev => [...prev, articleId]);

            const { error: insertError } = await supabase
                .from('saved_articles')
                .insert({
                    user_id: user.id,
                    article_id: articleId
                } as any);

            if (insertError) {
                // Revert on error
                setSavedArticleIds(prev => prev.filter(id => id !== articleId));
                throw insertError;
            }
        } catch (err) {
            console.error('Error saving article:', err);
            setError('Failed to save article');
        }
    };

    const unsaveArticle = async (articleId: string) => {
        if (!user) return;

        try {
            // Optimistic update
            setSavedArticleIds(prev => prev.filter(id => id !== articleId));

            const { error: deleteError } = await supabase
                .from('saved_articles')
                .delete()
                .eq('user_id', user.id)
                .eq('article_id', articleId);

            if (deleteError) {
                // Revert on error
                setSavedArticleIds(prev => [...prev, articleId]);
                throw deleteError;
            }
        } catch (err) {
            console.error('Error unsaving article:', err);
            setError('Failed to unsave article');
        }
    };

    const toggleSave = async (articleId: string) => {
        if (!user) {
            alert("请先登录以收藏文章！");
            return;
        }
        if (savedArticleIds.includes(articleId)) {
            await unsaveArticle(articleId);
        } else {
            await saveArticle(articleId);
        }
    };

    const isArticleSaved = (articleId: string): boolean => {
        return savedArticleIds.includes(articleId);
    };

    return {
        savedArticleIds,
        loading,
        error,
        saveArticle,
        unsaveArticle,
        toggleSave,
        isArticleSaved,
        refreshSavedArticles: fetchSavedArticles,
        isConfigured: isSupabaseConfigured
    };
};
