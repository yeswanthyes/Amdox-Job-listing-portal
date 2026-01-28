import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  user_type: 'job_seeker' | 'employer';
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  company_name: string | null;
  company_website: string | null;
  resume_url: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  requirements: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  job_id: string;
  applicant_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
};
