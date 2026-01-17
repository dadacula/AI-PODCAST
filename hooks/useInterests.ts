import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface InterestsHook {
    userInterests: string[];
    loading: boolean;
    error: string | null;
    addInterest: (interestId: string) => Promise<void>;
    removeInterest: (interestId: string) => Promise<void>;
    toggleInterest: (interestId: string) => Promise<void>;
    isInterestSelected: (interestId: string) => boolean;
    refreshInterests: () => Promise<void>;
}

export const useInterests = (): InterestsHook => {
    const { user } = useAuth();
    const [userInterests, setUserInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInterests = useCallback(async () => {
        if (!user) {
            // Load from localStorage for non-authenticated users
            const stored = localStorage.getItem('user_interests');
            if (stored) {
                try {
                    setUserInterests(JSON.parse(stored));
                } catch {
                    setUserInterests([]);
                }
            }
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('user_interests')
                .select('interest_id')
                .eq('user_id', user.id);

            if (fetchError) throw fetchError;

            const ids = (data as any[])?.map(item => item.interest_id) || [];
            setUserInterests(ids);
        } catch (err) {
            console.error('Error fetching interests:', err);
            setError('Failed to load interests');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchInterests();
    }, [fetchInterests]);

    const addInterest = async (interestId: string) => {
        // Optimistic update
        setUserInterests(prev => [...prev, interestId]);

        if (!user) {
            const newInterests = [...userInterests, interestId];
            localStorage.setItem('user_interests', JSON.stringify(newInterests));
            return;
        }

        try {
            const { error: insertError } = await supabase
                .from('user_interests')
                .insert({
                    user_id: user.id,
                    interest_id: interestId
                } as any);

            if (insertError) {
                setUserInterests(prev => prev.filter(id => id !== interestId));
                throw insertError;
            }
        } catch (err) {
            console.error('Error adding interest:', err);
            setError('Failed to add interest');
        }
    };

    const removeInterest = async (interestId: string) => {
        // Optimistic update
        setUserInterests(prev => prev.filter(id => id !== interestId));

        if (!user) {
            const newInterests = userInterests.filter(id => id !== interestId);
            localStorage.setItem('user_interests', JSON.stringify(newInterests));
            return;
        }

        try {
            const { error: deleteError } = await supabase
                .from('user_interests')
                .delete()
                .eq('user_id', user.id)
                .eq('interest_id', interestId);

            if (deleteError) {
                setUserInterests(prev => [...prev, interestId]);
                throw deleteError;
            }
        } catch (err) {
            console.error('Error removing interest:', err);
            setError('Failed to remove interest');
        }
    };

    const toggleInterest = async (interestId: string) => {
        if (userInterests.includes(interestId)) {
            await removeInterest(interestId);
        } else {
            await addInterest(interestId);
        }
    };

    const isInterestSelected = (interestId: string): boolean => {
        return userInterests.includes(interestId);
    };

    return {
        userInterests,
        loading,
        error,
        addInterest,
        removeInterest,
        toggleInterest,
        isInterestSelected,
        refreshInterests: fetchInterests
    };
};
