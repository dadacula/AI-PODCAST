import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export interface UserProfile {
    id: string;
    displayName: string;
    avatarUrl: string;
}

const defaultProfile: UserProfile = {
    id: '',
    displayName: 'Guest User',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjsJIVuw8GuQTC7_-zKLJdgZ8ex3RsyqELoGkiI8WVsfmzPX-YGN5Z1HJ0hDqV4JDb6MFhGmjN8YkC7_wL42-z-6uB-lj_yG-FgSmK4M6CGtWucZRkQmiFT5gHrPp6c4QuVomjnTRvJthrOJ8nI5KUTw8UjCQobjDgsi4rTGvG_AELV32TDXgdB48xR_u5PJJF3iNXqYLaKkybtYqHSdp96UHLvc9EA1XqBmftnNxzivpSQXHBA2C2QXOoVNfquPoeMxcbmgDQ09Q'
};

interface ProfileHook {
    profile: UserProfile;
    loading: boolean;
    error: string | null;
    updateProfile: (updates: Partial<Omit<UserProfile, 'id'>>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

export const useProfile = (): ProfileHook => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!user) {
            setProfile(defaultProfile);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            if (data) {
                const d = data as any;
                setProfile({
                    id: d.id,
                    displayName: d.display_name || 'User',
                    avatarUrl: d.avatar_url || defaultProfile.avatarUrl
                });
            } else {
                setProfile({
                    ...defaultProfile,
                    id: user.id,
                    displayName: user.email?.split('@')[0] || 'User'
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (updates: Partial<Omit<UserProfile, 'id'>>) => {
        if (!user) return;

        const newProfile = { ...profile, ...updates };

        // Optimistic update
        setProfile(newProfile);

        try {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .upsert({
                    id: user.id,
                    display_name: newProfile.displayName,
                    avatar_url: newProfile.avatarUrl
                } as any);

            if (updateError) {
                // Revert on error
                setProfile(profile);
                throw updateError;
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        }
    };

    return {
        profile,
        loading,
        error,
        updateProfile,
        refreshProfile: fetchProfile
    };
};
