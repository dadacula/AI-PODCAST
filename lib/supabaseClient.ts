import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const getSupabaseConfig = () => {
    let url = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
    let key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

    // Ensure URL has protocol to prevent createClient from throwing
    if (url && !url.startsWith('http')) {
        url = `https://${url}`;
    }

    return { url, key };
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

// We wrap in a try-catch just in case the URL is still malformed
let supabaseInstance: any;
try {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });
} catch (err) {
    console.error("Critical: Failed to initialize Supabase client", err);
    // Create a dummy client that fails gracefully
    // This chainable query builder makes all query chains return a Promise
    const createQueryBuilder = () => {
        const queryResult = Promise.resolve({ data: null, error: null });
        const chainable: any = {
            select: () => chainable,
            eq: () => chainable,
            order: () => chainable,
            single: () => queryResult,
            // Make the chainable itself awaitable
            then: queryResult.then.bind(queryResult),
            catch: queryResult.catch.bind(queryResult),
            finally: queryResult.finally.bind(queryResult)
        };
        return chainable;
    };

    supabaseInstance = {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: { message: "Supabase not configured" } }),
            signUp: async () => ({ error: { message: "Supabase not configured" } }),
            signOut: async () => { }
        },
        from: () => ({
            select: () => createQueryBuilder(),
            insert: () => Promise.resolve({ error: null }),
            delete: () => createQueryBuilder(),
            upsert: () => Promise.resolve({ error: null })
        })
    };
}

export const supabase = supabaseInstance;

// Helper type exports
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
