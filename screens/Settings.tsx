import React from 'react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../hooks/usePreferences';
import { useProfile } from '../hooks/useProfile';

interface SettingsProps {
    navigate: (screen: Screen) => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ navigate, isDark, toggleTheme }) => {
    const { user, signOut } = useAuth();
    const { preferences, updatePreferences } = usePreferences();
    const { profile } = useProfile();

    const handleNotificationsToggle = () => {
        updatePreferences({ notificationsEnabled: !preferences.notificationsEnabled });
    };

    const handleOfflineReading = () => alert("Offline Reading Settings");
    const handleHelp = () => alert("Help Center");

    const handleLogout = async () => {
        await signOut();
        navigate('login');
    };

    const handleLogin = () => {
        navigate('login');
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                <header className="px-6 pt-12 pb-8">
                    <h1 className="text-primary dark:text-white text-[40px] font-medium tracking-tight leading-none italic font-display">Settings</h1>
                </header>

                {/* My Card */}
                <div className="px-6 mb-8">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark shadow-paper border border-primary/5 dark:border-white/5">
                        <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white dark:ring-white/10">
                            <img alt="User" className="w-full h-full object-cover" src={profile.avatarUrl} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-primary dark:text-white font-display text-xl font-bold">
                                {user ? profile.displayName : 'Guest User'}
                            </h3>
                            <p className="text-primary/50 dark:text-gray-400 font-sans text-xs">
                                {user ? user.email : '未登录'}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('profile')}
                            className="text-primary/40 dark:text-white/40 hover:text-primary dark:hover:text-white p-2 transition-colors"
                        >
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                </div>

                {/* Settings Groups */}
                <div className="px-6 space-y-6">

                    {/* Preferences */}
                    <section>
                        <h4 className="text-xs font-bold font-sans text-primary/40 dark:text-white/40 uppercase tracking-widest mb-3 px-1">Preferences</h4>
                        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-primary/5 dark:border-white/5">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors w-full"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary dark:text-white">dark_mode</span>
                                    <span className="text-primary dark:text-white font-sans font-medium">Dark Mode</span>
                                </div>
                                <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </button>
                            <div className="h-px bg-primary/5 dark:bg-white/5 mx-4"></div>
                            <button
                                onClick={handleNotificationsToggle}
                                className="flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors w-full"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary dark:text-white">notifications</span>
                                    <span className="text-primary dark:text-white font-sans font-medium">Notifications</span>
                                </div>
                                <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${preferences.notificationsEnabled ? 'bg-primary' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${preferences.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Content */}
                    <section>
                        <h4 className="text-xs font-bold font-sans text-primary/40 dark:text-white/40 uppercase tracking-widest mb-3 px-1">Content</h4>
                        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-primary/5 dark:border-white/5">
                            <button
                                onClick={() => navigate('interests')}
                                className="flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors w-full"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary dark:text-white">tune</span>
                                    <span className="text-primary dark:text-white font-sans font-medium">Manage Interests</span>
                                </div>
                                <span className="material-symbols-outlined text-primary/30 dark:text-white/30 text-[20px]">chevron_right</span>
                            </button>
                            <div className="h-px bg-primary/5 dark:bg-white/5 mx-4"></div>
                            <button
                                onClick={handleOfflineReading}
                                className="flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors w-full"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary dark:text-white">download</span>
                                    <span className="text-primary dark:text-white font-sans font-medium">Offline Reading</span>
                                </div>
                                <span className="material-symbols-outlined text-primary/30 dark:text-white/30 text-[20px]">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* Account */}
                    <section>
                        <h4 className="text-xs font-bold font-sans text-primary/40 dark:text-white/40 uppercase tracking-widest mb-3 px-1">Account</h4>
                        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-primary/5 dark:border-white/5">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-red-500">logout</span>
                                        <span className="text-red-500 font-sans font-medium">退出登录</span>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary dark:text-white">login</span>
                                        <span className="text-primary dark:text-white font-sans font-medium">登录/注册</span>
                                    </div>
                                    <span className="material-symbols-outlined text-primary/30 dark:text-white/30 text-[20px]">chevron_right</span>
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Support */}
                    <section>
                        <div className="flex flex-col bg-transparent rounded-xl overflow-hidden">
                            <button
                                onClick={handleHelp}
                                className="flex items-center justify-between p-4 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors rounded-xl w-full"
                            >
                                <span className="text-primary dark:text-white font-sans font-medium">Help & Support</span>
                                <span className="material-symbols-outlined text-primary/30 dark:text-white/30 text-[20px]">open_in_new</span>
                            </button>
                        </div>
                    </section>

                    <p className="text-center text-[10px] text-primary/30 dark:text-white/20 font-sans mt-8 pb-8">
                        Personal Edition v2.5.0 {user && '• Synced'}
                    </p>

                </div>
            </div>
            <BottomNav activeScreen="settings" navigate={navigate} />
        </div>
    );
};

export default Settings;
