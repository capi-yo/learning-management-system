import { createClient } from '@supabase/supabase-js'

const supabaseUrl =import.meta.env.VITE_SUPABASE_URL||'https://yozhbbaifultgkumpjrc.supabase.co'
const supabaseAnonKey =import.meta.env.VITE_SUPABASE_ANON_KEY||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvemhiYmFpZnVsdGdrdW1wanJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NjY0OTIsImV4cCI6MjA3MjM0MjQ5Mn0.eBnvu53MVeCmZf_J39ssP394cEDSsGozvPz687TgFYk'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: 'student' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: 'student' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          role?: 'student' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string | null;
          title: string;
          content: string | null;
          content_type: 'text' | 'video';
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id?: string | null;
          title: string;
          content?: string | null;
          content_type?: 'text' | 'video';
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string | null;
          title?: string;
          content?: string | null;
          content_type?: 'text' | 'video';
          order_index?: number;
          created_at?: string;
        };
      };
      course_enrollments: {
        Row: {
          id: string;
          user_id: string | null;
          course_id: string | null;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          course_id?: string | null;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          course_id?: string | null;
          enrolled_at?: string;
          completed_at?: string | null;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string | null;
          lesson_id: string | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          lesson_id?: string | null;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          lesson_id?: string | null;
          completed_at?: string;
        };
      };
    };
  };
};