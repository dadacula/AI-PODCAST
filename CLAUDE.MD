# CLAUDE.MD - AI-PODCAST Project Guide

## Project Overview

**AI-PODCAST** is a premium personalized news briefing app with text-to-speech capabilities. It aggregates news from BBC RSS feeds, allows users to read or listen to articles, and provides personalized content based on user interests.

**Tech Stack:** React 19 + TypeScript + Vite + Supabase + Tailwind CSS

## Quick Start

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (port 3000)
npm run build           # Build for production
```

**Required Environment Variables:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `GEMINI_API_KEY` - (Optional) For AI features

## Architecture Overview

### Project Structure

```
/home/user/AI-PODCAST/
├── App.tsx                    # Main app shell with routing
├── data.ts                    # News fetching & RSS feed constants
├── types.ts                   # Global TypeScript interfaces
├── components/                # Reusable UI components
│   ├── BottomNav.tsx         # 4-tab navigation
│   └── DailySummary.tsx      # AI-generated daily brief
├── screens/                   # Full-page views
│   ├── Home.tsx              # Main feed with hero carousel
│   ├── Article.tsx           # Article reader with TTS
│   ├── Explore.tsx           # Search & trending topics
│   ├── Saved.tsx             # Bookmarked articles
│   ├── Settings.tsx          # User preferences
│   ├── Profile.tsx           # User profile management
│   ├── Player.tsx            # Audio player
│   └── Login.tsx             # Authentication
├── contexts/
│   └── AuthContext.tsx       # Authentication state management
├── hooks/                     # Custom React hooks for data
│   ├── useSavedArticles.ts
│   ├── usePreferences.ts
│   ├── useInterests.ts
│   ├── useListeningHistory.ts
│   └── useProfile.ts
├── lib/
│   ├── supabaseClient.ts     # Supabase initialization
│   └── database.types.ts     # Auto-generated DB types
└── supabase/
    └── database_schema.sql   # Complete DB schema with RLS
```

## Key Features

### 1. News Aggregation
- **8 BBC RSS feeds:** Top Stories, World, Business, Politics, Health, Science, Technology, Arts
- **CORS proxies:** Uses corsproxy.io (primary) and allorigins.win (fallback)
- **Image optimization:** Automatic resolution enhancement (976x549 for BBC)
- **Duplicate detection:** Removes duplicate articles across feeds
- **Metadata extraction:** Title, category, source, image, reading/listening time

### 2. Text-to-Speech
- **Web Speech API:** Browser-native speech synthesis
- **Playback controls:** Speed adjustment (0.5x - 2x), pause/resume
- **Progress tracking:** Saves listening position in Supabase
- **Article fetching:** Full content extraction from source URLs

### 3. User Personalization
- **Dark/light theme:** Persistent across sessions
- **Interest selection:** Filter news by preferred categories
- **Saved articles:** Bookmark management with Supabase
- **Listening history:** Track playback progress and completion
- **Profile management:** Display name and avatar

### 4. Discovery
- **Search:** With history storage
- **Trending topics:** Dynamic based on recent articles
- **Daily AI brief:** Auto-generated summary of top stories (grouped by category)

## Data Flow

### News Loading
```
App.tsx useEffect → fetchNews() →
  → Fetch 8 BBC RSS feeds via proxy →
  → Parse XML → Extract metadata →
  → Optimize images → Remove duplicates →
  → Store in state (feeds, articles)
```

### Article Reading
```
Home/Explore → Click → Article.tsx →
  → fetchFullArticle() → Parse HTML →
  → Display + enable TTS
```

### Authentication
```
Login → Supabase signUp/signIn →
  → Session stored → AuthContext updates →
  → Custom hooks load user data
```

## Database Schema (Supabase)

### Key Tables
- **user_profiles** - `id`, `display_name`, `avatar_url`, `created_at`
- **user_preferences** - `user_id`, `is_dark_mode`, `playback_speed`, `notifications_enabled`, `preferred_voice`
- **user_interests** - `user_id`, `interest_id` (category name)
- **saved_articles** - `user_id`, `article_id`
- **listening_history** - `user_id`, `article_id`, `progress`, `duration_seconds`, `completed`
- **articles** - `id`, `title`, `content`, `category`, `source`, `image_url`, `link`, `timestamp`

**Security:** Row-level security (RLS) enabled on all tables. Users can only access their own data.

## Custom Hooks API

### `useSavedArticles()`
```typescript
const { savedArticleIds, toggleSave, saveArticle, unsaveArticle } = useSavedArticles();
```
Manages bookmarked articles in Supabase.

### `usePreferences()`
```typescript
const { isDarkMode, playbackSpeed, notificationsEnabled, preferredVoice, updatePreferences } = usePreferences();
```
Syncs user settings to Supabase + localStorage (fallback for non-auth).

### `useInterests()`
```typescript
const { userInterests, toggleInterest, addInterest, removeInterest } = useInterests();
```
Manages followed news categories.

### `useListeningHistory()`
```typescript
const { history, updateProgress, markAsCompleted } = useListeningHistory();
```
Tracks article playback progress and completion.

### `useProfile()`
```typescript
const { displayName, avatarUrl, id, updateProfile } = useProfile();
```
Manages user profile data.

## Important Implementation Details

### Reading/Listening Time Calculations
- **Reading time:** ~238 words per minute
- **Listening time:** ~150 words per minute (speech synthesis rate)

### Image Optimization
```typescript
// BBC images: 976x549 resolution
imageUrl.replace(/\d+x\d+/, '976x549')
// Google images: w1200 width
imageUrl.replace(/w\d+/, 'w1200')
```

### Content Fetching Strategy
1. Fetch article HTML via CORS proxy
2. Parse with DOMParser
3. Extract content from: `main` > `article` > `[data-component]` > BBC-specific classes
4. Clean and format text

### Dark Mode
- Root element class toggle: `document.documentElement.classList.add('dark')`
- Tailwind `dark:` prefix for all dark styles
- Colors defined in `index.html` Tailwind config

### Responsive Design
- Mobile-first (max-width: 430px)
- Bottom nav fixed at 80px
- Custom scrollbar hiding: `no-scrollbar` class

## Color Palette

### Light Mode
- Background: `#fbfaf9` (bg-background-light)
- Surface: `#ffffff`
- Primary Text: `#473c53` (text-primary)
- Accent: `#A38C6F` (gold)

### Dark Mode
- Background: `#211e25` (dark:bg-background-dark)
- Surface: `#2d2a33`
- Primary Text: `white` with opacity
- Accent: `#A38C6F` (gold)

## RSS Feed Sources

Located in `data.ts`:
```typescript
export const RSS_FEEDS = [
  { url: 'http://feeds.bbci.co.uk/news/rss.xml', category: '热点' },
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: '国际' },
  { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: '商业' },
  { url: 'http://feeds.bbci.co.uk/news/politics/rss.xml', category: '政治' },
  { url: 'http://feeds.bbci.co.uk/news/health/rss.xml', category: '健康' },
  { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: '科学' },
  { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', category: '科技' },
  { url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', category: '娱乐' }
]
```

## Error Handling

- **Fallback Supabase client:** Returns dummy client if env vars missing
- **CORS proxy fallback:** Switches from corsproxy.io to allorigins.win
- **Graceful degradation:** Features work offline with localStorage
- **User-friendly messages:** Chinese & English error text

## Development Guidelines

### Code Style
- TypeScript with strict typing
- Functional React components with hooks
- Tailwind utility classes for styling
- Optimistic UI updates for better UX

### Testing Changes
1. Test with and without authentication
2. Verify dark/light mode switching
3. Check responsive layout (430px max-width)
4. Test TTS functionality across browsers
5. Verify Supabase RLS policies

### Common Tasks

**Add new RSS feed:**
1. Add to `RSS_FEEDS` in `data.ts`
2. Add category to interests in relevant screens

**Modify article display:**
1. Update `ArticleCard` rendering in `Home.tsx`
2. Adjust styles with Tailwind classes

**Add user preference:**
1. Update `user_preferences` table schema
2. Update `usePreferences` hook
3. Add UI control in `Settings.tsx`

**Change theme colors:**
1. Edit Tailwind config in `index.html` `<script>` tag
2. Update color references in components

## Recent Updates

### January 20, 2026
- **Fixed blank screen after login** - App now properly waits for all hooks to load before rendering
- **Completely redesigned AI Daily Brief** - Beautiful gradient design with detailed summaries, keyword extraction, top articles preview, and expandable categories
- **Fixed image loading issues** - Better error handling with automatic fallbacks, improved BBC URL optimization
- **Completely rewrote Explore tab** - Real-time search with results, trending topics with article previews, category browser with visual tiles, popular articles section, search history

### Previous Updates
- Added daily AI-generated summary of latest headlines
- Improved BBC image resolution (976x549)
- Enhanced Explore tab trending logic
- Fixed read/listen time calculations
- Added manual refresh to Home screen
- Expanded hero carousel to 5 articles

## Key Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `App.tsx` | 230 | App shell, routing, news fetching |
| `data.ts` | 274 | RSS feeds, fetch logic, constants |
| `screens/Article.tsx` | 374 | Article reader with TTS |
| `screens/Home.tsx` | 313 | Main feed with hero section |
| `types.ts` | 53 | Type definitions |
| `contexts/AuthContext.tsx` | 106 | Auth state management |
| `lib/supabaseClient.ts` | 54 | Supabase initialization |

## Links

- **AI Studio App:** https://ai.studio/apps/drive/189inEYpgY65PG9fbL_JpcZk7WsS55Fv6
- **Repository:** Local proxy at http://local_proxy@127.0.0.1:61770/git/dadacula/AI-PODCAST

---

**Last Updated:** 2026-01-19
**Project Version:** 0.0.0
**Status:** Active Development
