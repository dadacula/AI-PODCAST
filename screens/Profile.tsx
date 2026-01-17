import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
    navigate: (screen: Screen) => void;
}

const Profile: React.FC<ProfileProps> = ({ navigate }) => {
    const { user } = useAuth();
    const { profile, updateProfile, loading } = useProfile();
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setName(profile.displayName);
    }, [profile.displayName]);

    const handleSave = async () => {
        if (!user) {
            navigate('login');
            return;
        }

        setSaving(true);
        await updateProfile({ displayName: name });
        setSaving(false);
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
            navigate('settings');
        }, 1000);
    };

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
                    <h1 className="text-primary dark:text-white text-xl font-bold font-display">Edit Profile</h1>
                </header>

                <div className="px-6 flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer">
                        <div className="h-28 w-28 rounded-full bg-gray-200 overflow-hidden ring-4 ring-white dark:ring-white/10 shadow-lg">
                            <img alt="User" className="w-full h-full object-cover" src={profile.avatarUrl} />
                        </div>
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white">camera_alt</span>
                        </div>
                    </div>
                    <button className="mt-3 text-accent-gold text-sm font-bold font-sans">Change Photo</button>
                </div>

                <div className="px-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold font-sans text-primary/60 dark:text-white/60 uppercase tracking-widest">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white dark:bg-surface-dark border border-primary/10 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white font-sans focus:outline-none focus:border-primary/40 dark:focus:border-white/40 shadow-sm"
                        />
                    </div>

                    {user && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold font-sans text-primary/60 dark:text-white/60 uppercase tracking-widest">Email</label>
                            <div className="w-full bg-gray-100 dark:bg-surface-dark/50 border border-primary/5 dark:border-white/5 rounded-xl px-4 py-3 text-primary/60 dark:text-white/60 font-sans">
                                {user.email}
                            </div>
                        </div>
                    )}

                    {!user && (
                        <div className="mt-8 p-4 rounded-xl bg-accent-gold/10 border border-accent-gold/20">
                            <p className="text-primary dark:text-white font-sans text-sm text-center">
                                登录后可以保存您的个人资料并在多设备间同步
                            </p>
                            <button
                                onClick={() => navigate('login')}
                                className="mt-3 w-full bg-accent-gold text-white py-3 rounded-xl font-bold font-sans text-sm"
                            >
                                立即登录
                            </button>
                        </div>
                    )}
                </div>

            </div>

            <div className="p-6 bg-background-light dark:bg-background-dark border-t border-primary/5 dark:border-white/5 z-20">
                <button
                    onClick={handleSave}
                    disabled={saving || !name.trim()}
                    className={`w-full py-4 rounded-xl font-bold font-sans text-lg shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 ${saved
                            ? 'bg-green-500 text-white'
                            : 'bg-primary dark:bg-white text-white dark:text-primary'
                        }`}
                >
                    {saving ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Saving...
                        </span>
                    ) : saved ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">check</span>
                            Saved!
                        </span>
                    ) : (
                        'Save'
                    )}
                </button>
            </div>
        </div>
    );
};

export default Profile;
