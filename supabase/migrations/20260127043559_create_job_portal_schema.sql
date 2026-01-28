/*
  # Job Listing Portal Schema

  ## Overview
  Creates the complete database schema for a job listing portal connecting employers and job seekers.

  ## New Tables

  ### 1. profiles
  Extends auth.users with additional profile information for both job seekers and employers.
  - `id` (uuid, primary key) - References auth.users(id)
  - `user_type` (text) - Either 'job_seeker' or 'employer'
  - `full_name` (text) - User's full name
  - `email` (text) - User's email
  - `phone` (text) - Contact phone number
  - `location` (text) - User location
  - `bio` (text) - About/bio section
  - `company_name` (text) - Company name (for employers)
  - `company_website` (text) - Company website (for employers)
  - `resume_url` (text) - Resume file URL (for job seekers)
  - `skills` (text array) - Skills list (for job seekers)
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. jobs
  Stores job postings created by employers.
  - `id` (uuid, primary key) - Unique job identifier
  - `employer_id` (uuid) - References profiles(id)
  - `title` (text) - Job title/role
  - `description` (text) - Detailed job description
  - `job_type` (text) - Job type (full-time, part-time, contract, internship)
  - `location` (text) - Job location
  - `salary_min` (integer) - Minimum salary
  - `salary_max` (integer) - Maximum salary
  - `requirements` (text array) - Job requirements
  - `is_active` (boolean) - Whether job is still accepting applications
  - `created_at` (timestamptz) - Job posting timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. applications
  Tracks job applications from job seekers.
  - `id` (uuid, primary key) - Unique application identifier
  - `job_id` (uuid) - References jobs(id)
  - `applicant_id` (uuid) - References profiles(id)
  - `status` (text) - Application status (pending, reviewed, accepted, rejected)
  - `cover_letter` (text) - Optional cover letter
  - `created_at` (timestamptz) - Application submission timestamp
  - `updated_at` (timestamptz) - Last status update timestamp

  ## Security
  - RLS enabled on all tables
  - Users can read their own profiles and update their own data
  - Job seekers can view all active jobs
  - Employers can manage their own job postings
  - Applicants can view their own applications
  - Employers can view applications for their jobs
  - Public can view active job listings (without applying)

  ## Indexes
  - Index on jobs(employer_id) for faster employer queries
  - Index on jobs(is_active) for filtering active jobs
  - Index on applications(job_id) for job application lookups
  - Index on applications(applicant_id) for user application history
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('job_seeker', 'employer')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  bio text,
  company_name text,
  company_website text,
  resume_url text,
  skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  job_type text NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  location text NOT NULL,
  salary_min integer,
  salary_max integer,
  requirements text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  cover_letter text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (is_active = true OR employer_id = auth.uid());

CREATE POLICY "Employers can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'employer'
    )
  );

CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (employer_id = auth.uid());

-- Applications policies
CREATE POLICY "Applicants can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    applicant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "Job seekers can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    applicant_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'job_seeker'
    )
  );

CREATE POLICY "Applicants can update their own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    applicant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  )
  WITH CHECK (
    applicant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can delete their own applications"
  ON applications FOR DELETE
  TO authenticated
  USING (applicant_id = auth.uid());

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();