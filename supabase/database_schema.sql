-- =====================================================
-- AI Podcast App - Supabase Database Schema (SAFE VERSION)
-- =====================================================
-- 注意：此脚本设计为幂等（可重复运行）。
-- 核心表的创建使用了 IF NOT EXISTS，不会覆盖已有数据。

-- =====================================================
-- 1. 用户个人资料
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY, -- 警告：删除用户将删除资料
  display_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 安全地创建策略 (先删后建，确保脚本可重复运行)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
END $$;

CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 用户注册时的自动处理函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 自动创建 profile 的触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. 用户偏好设置
-- =====================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  is_dark_mode BOOLEAN DEFAULT FALSE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  playback_speed DECIMAL(3,2) DEFAULT 1.00,
  preferred_voice TEXT DEFAULT 'ai' CHECK (preferred_voice IN ('ai', 'human')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
  DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
  DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
END $$;

CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. 用户兴趣标签
-- =====================================================
CREATE TABLE IF NOT EXISTS user_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  interest_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, interest_id)
);

ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own interests" ON user_interests;
  DROP POLICY IF EXISTS "Users can insert own interests" ON user_interests;
  DROP POLICY IF EXISTS "Users can delete own interests" ON user_interests;
END $$;

CREATE POLICY "Users can view own interests" ON user_interests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interests" ON user_interests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own interests" ON user_interests FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 4. 文章缓存库 (公共可读)
-- =====================================================
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  category TEXT,
  source TEXT,
  title TEXT,
  read_time TEXT DEFAULT '3m',
  listen_time TEXT DEFAULT '2m',
  time_ago TEXT,
  image_url TEXT,
  content TEXT,
  link TEXT,
  author TEXT,
  published_date TEXT,
  timestamp BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view articles" ON articles;
CREATE POLICY "Anyone can view articles" ON articles FOR SELECT USING (true);

DO $$ BEGIN
  DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
  DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
END $$;

CREATE POLICY "Authenticated users can insert articles" ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update articles" ON articles FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. 收藏列表
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  article_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own saved articles" ON saved_articles;
  DROP POLICY IF EXISTS "Users can save articles" ON saved_articles;
  DROP POLICY IF EXISTS "Users can unsave articles" ON saved_articles;
END $$;

CREATE POLICY "Users can view own saved articles" ON saved_articles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save articles" ON saved_articles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave articles" ON saved_articles FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 6. 收听历史进度
-- =====================================================
CREATE TABLE IF NOT EXISTS listening_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  article_id TEXT NOT NULL,
  progress DECIMAL(5,2) DEFAULT 0.00,
  duration_seconds INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, article_id)
);

ALTER TABLE listening_history ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own history" ON listening_history;
  DROP POLICY IF EXISTS "Users can insert history" ON listening_history;
  DROP POLICY IF EXISTS "Users can update history" ON listening_history;
  DROP POLICY IF EXISTS "Users can delete history" ON listening_history;
END $$;

CREATE POLICY "Users can view own history" ON listening_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert history" ON listening_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update history" ON listening_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete history" ON listening_history FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 时间戳自动更新逻辑
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 自动更新触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 性能索引
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_saved_articles_user_id ON saved_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_timestamp ON articles(timestamp DESC);
