import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export interface UserPreferences {
    isDarkMode: boolean;
    notificationsEnabled: boolean;
    playbackSpeed: number;
    preferredVoice: 'ai' | 'human';
}

const defaultPreferences: UserPreferences = {
    isDarkMode: false,
    notificationsEnabled: true,
    playbackSpeed: 1.0,
    preferredVoice: 'ai'
};

interface PreferencesHook {
    preferences: UserPreferences;
    loading: boolean;
    error: string | null;
    updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
    refreshPreferences: () => Promise<void>;
}

export const usePreferences = (): PreferencesHook => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPreferences = useCallback(async () => {
        if (!user) {
            // Load from localStorage for non-authenticated users
            const stored = localStorage.getItem('user_preferences');
            if (stored) {
                try {
                    setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
                } catch {
                    setPreferences(defaultPreferences);
                }
            }
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (data) {
                const d = data as any;
                setPreferences({
                    isDarkMode: d.is_dark_mode,
                    notificationsEnabled: d.notifications_enabled,
                    playbackSpeed: Number(d.playback_speed),
                    preferredVoice: d.preferred_voice as 'ai' | 'human'
                });
            }
        } catch (err) {
            console.error('Error fetching preferences:', err);
            setError('Failed to load preferences');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const updatePreferences = async (updates: Partial<UserPreferences>) => {
        const newPreferences = { ...preferences, ...updates };

        // Optimistic update
        setPreferences(newPreferences);

        if (!user) {
            // Save to localStorage for non-authenticated users
            localStorage.setItem('user_preferences', JSON.stringify(newPreferences));
            return;
        }

        try {
            const { error: updateError } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: user.id,
                    is_dark_mode: newPreferences.isDarkMode,
                    notifications_enabled: newPreferences.notificationsEnabled,
                    playback_speed: newPreferences.playbackSpeed,
                    preferred_voice: newPreferences.preferredVoice
                } as any);

            if (updateError) {
                // Revert on error
                setPreferences(preferences);
                throw updateError;
            }
        } catch (err) {
            console.error('Error updating preferences:', err);
            setError('Failed to update preferences');
        }
    };

    return {
        preferences,
        loading,
        error,
        updatePreferences,
        refreshPreferences: fetchPreferences
    };
};
