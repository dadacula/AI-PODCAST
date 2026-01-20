import React, { useState } from 'react';
import { Screen } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
    navigate: (screen: Screen) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const Login: React.FC<LoginProps> = ({ navigate }) => {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            if (mode === 'login') {
                const { error } = await signIn(email, password);
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        setError('邮箱或密码错误');
                    } else if (error.message.includes('Failed to fetch')) {
                        setError('网络连接失败（Failed to fetch）。请确保您的 .env 文件已正确配置 Supabase URL 和 Key。');
                    } else {
                        setError(error.message);
                    }
                } else {
                    // Don't navigate manually - let App.tsx useEffect handle it
                    // This ensures all hooks finish loading before showing home screen
                    console.log('[Login] Sign in successful, waiting for App to handle navigation');
                }
            } else if (mode === 'signup') {
                const { error } = await signUp(email, password, displayName);
                if (error) {
                    if (error.message.includes('already registered')) {
                        setError('该邮箱已注册');
                    } else if (error.message.includes('Failed to fetch')) {
                        setError('网络连接失败（Failed to fetch）。请确保您的 .env 文件已正确配置 Supabase URL 和 Key。');
                    } else {
                        setError(error.message);
                    }
                } else {
                    setMessage('注册成功！请检查您的邮箱进行验证。');
                    setMode('login');
                }
            }
        } catch (err: any) {
            if (err.message && err.message.includes('Failed to fetch')) {
                setError('网络连接错误：无法连接到 Supabase。请检查 .env 配置。');
            } else {
                setError('发生未知错误，请稍后重试');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('home');
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
            {/* Header with gradient */}
            <div className="relative h-48 bg-gradient-to-br from-primary via-primary/80 to-accent-gold overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-8 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-4 w-48 h-48 bg-accent-gold/30 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                        <span className="material-symbols-outlined text-[32px]">headphones</span>
                    </div>
                    <h1 className="text-2xl font-bold font-display">AI Podcast</h1>
                    <p className="text-white/70 text-sm font-sans mt-1">Listen to the world</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-6 pt-8 pb-6 -mt-4 bg-background-light dark:bg-background-dark rounded-t-3xl relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold font-display text-primary dark:text-white">
                        {mode === 'login' ? '欢迎回来' : mode === 'signup' ? '创建账户' : '重置密码'}
                    </h2>
                    <p className="text-primary/60 dark:text-gray-400 text-sm font-sans mt-2">
                        {mode === 'login'
                            ? '登录以同步您的收藏和偏好设置'
                            : mode === 'signup'
                                ? '加入我们，开始您的个性化播客之旅'
                                : '输入您的邮箱，我们将发送重置链接'
                        }
                    </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-red-600 dark:text-red-400 text-sm font-sans text-center">{error}</p>
                    </div>
                )}
                {message && (
                    <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <p className="text-green-600 dark:text-green-400 text-sm font-sans text-center">{message}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold font-sans text-primary/60 dark:text-white/60 uppercase tracking-widest">
                                昵称
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="您的昵称"
                                className="w-full bg-white dark:bg-surface-dark border border-primary/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-primary dark:text-white font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-white/20 shadow-sm transition-all"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold font-sans text-primary/60 dark:text-white/60 uppercase tracking-widest">
                            邮箱
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full bg-white dark:bg-surface-dark border border-primary/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-primary dark:text-white font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-white/20 shadow-sm transition-all"
                        />
                    </div>

                    {mode !== 'forgot' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold font-sans text-primary/60 dark:text-white/60 uppercase tracking-widest">
                                密码
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-white dark:bg-surface-dark border border-primary/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-primary dark:text-white font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-white/20 shadow-sm transition-all"
                            />
                        </div>
                    )}

                    {mode === 'login' && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => setMode('forgot')}
                                className="text-sm text-accent-gold font-sans hover:underline"
                            >
                                忘记密码？
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary dark:bg-white text-white dark:text-primary py-4 rounded-xl font-bold font-sans text-lg shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 dark:border-primary/30 border-t-white dark:border-t-primary rounded-full animate-spin"></span>
                                处理中...
                            </span>
                        ) : mode === 'login' ? (
                            '登录'
                        ) : mode === 'signup' ? (
                            '注册'
                        ) : (
                            '发送重置链接'
                        )}
                    </button>
                </form>

                {/* Mode Switch */}
                <div className="mt-6 text-center">
                    {mode === 'login' ? (
                        <p className="text-primary/60 dark:text-gray-400 font-sans text-sm">
                            还没有账户？{' '}
                            <button
                                onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
                                className="text-accent-gold font-bold hover:underline"
                            >
                                立即注册
                            </button>
                        </p>
                    ) : (
                        <p className="text-primary/60 dark:text-gray-400 font-sans text-sm">
                            已有账户？{' '}
                            <button
                                onClick={() => { setMode('login'); setError(null); setMessage(null); }}
                                className="text-accent-gold font-bold hover:underline"
                            >
                                返回登录
                            </button>
                        </p>
                    )}
                </div>

                {/* Skip Login */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleSkip}
                        className="text-primary/40 dark:text-white/40 font-sans text-sm hover:text-primary/60 dark:hover:text-white/60 transition-colors"
                    >
                        跳过登录，以访客身份浏览
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
