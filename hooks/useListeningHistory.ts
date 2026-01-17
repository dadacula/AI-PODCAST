import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export interface ListeningHistoryItem {
    articleId: string;
    progress: number;
    durationSeconds: number;
    lastPlayedAt: string;
    completed: boolean;
}

interface ListeningHistoryHook {
    history: ListeningHistoryItem[];
    loading: boolean;
    error: string | null;
    getProgress: (articleId: string) => number;
    updateProgress: (articleId: string, progress: number, durationSeconds?: number) => Promise<void>;
    markAsCompleted: (articleId: string) => Promise<void>;
    refreshHistory: () => Promise<void>;
}

export const useListeningHistory = (): ListeningHistoryHook => {
    const { user } = useAuth();
    const [history, setHistory] = useState<ListeningHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        if (!user) {
            setHistory([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('listening_history')
                .select('*')
                .eq('user_id', user.id)
                .order('last_played_at', { ascending: false });

            if (fetchError) throw fetchError;

            const d = data as any[];
            setHistory(
                d?.map(item => ({
                    articleId: item.article_id,
                    progress: Number(item.progress),
                    durationSeconds: item.duration_seconds,
                    lastPlayedAt: item.last_played_at,
                    completed: item.completed
                })) || []
            );
        } catch (err) {
            console.error('Error fetching listening history:', err);
            setError('Failed to load listening history');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const getProgress = (articleId: string): number => {
        const item = history.find(h => h.articleId === articleId);
        return item?.progress || 0;
    };

    const updateProgress = async (articleId: string, progress: number, durationSeconds?: number) => {
        if (!user) return;

        // Optimistic update
        setHistory(prev => {
            const existing = prev.find(h => h.articleId === articleId);
            if (existing) {
                return prev.map(h =>
                    h.articleId === articleId
                        ? { ...h, progress, durationSeconds: durationSeconds || h.durationSeconds, lastPlayedAt: new Date().toISOString() }
                        : h
                );
            }
            return [...prev, {
                articleId,
                progress,
                durationSeconds: durationSeconds || 0,
                lastPlayedAt: new Date().toISOString(),
                completed: false
            }];
        });

        try {
            const updateData: Record<string, unknown> = {
                user_id: user.id,
                article_id: articleId,
                progress,
                last_played_at: new Date().toISOString()
            };

            if (durationSeconds !== undefined) {
                updateData.duration_seconds = durationSeconds;
            }

            const { error: upsertError } = await supabase
                .from('listening_history')
                .upsert(updateData, {
                    onConflict: 'user_id,article_id'
                });

            if (upsertError) throw upsertError;
        } catch (err) {
            console.error('Error updating progress:', err);
            setError('Failed to save progress');
        }
    };

    const markAsCompleted = async (articleId: string) => {
        if (!user) return;

        // Optimistic update
        setHistory(prev =>
            prev.map(h =>
                h.articleId === articleId
                    ? { ...h, completed: true, progress: 100 }
                    : h
            )
        );

        try {
            const { error: updateError } = await supabase
                .from('listening_history')
                .upsert({
                    user_id: user.id,
                    article_id: articleId,
                    progress: 100,
                    completed: true,
                    last_played_at: new Date().toISOString()
                } as any, {
                    onConflict: 'user_id,article_id'
                });

            if (updateError) throw updateError;
        } catch (err) {
            console.error('Error marking as completed:', err);
            setError('Failed to mark as completed');
        }
    };

    return {
        history,
        loading,
        error,
        getProgress,
        updateProgress,
        markAsCompleted,
        refreshHistory: fetchHistory
    };
};
