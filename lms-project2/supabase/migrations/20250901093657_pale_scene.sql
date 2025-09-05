/*
  # Create assignments and quizzes system

  1. New Tables
    - `assignments`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `description` (text)
      - `due_date` (timestamp)
      - `max_points` (integer)
      - `created_at` (timestamp)
    
    - `submissions`
      - `id` (uuid, primary key)
      - `assignment_id` (uuid, references assignments)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `file_url` (text, nullable)
      - `submitted_at` (timestamp)
      - `grade` (integer, nullable)
      - `feedback` (text, nullable)
      - `graded_at` (timestamp, nullable)
      - `graded_by` (uuid, nullable, references profiles)
    
    - `quizzes`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `description` (text)
      - `time_limit` (integer, nullable, in minutes)
      - `max_attempts` (integer, default 3)
      - `created_at` (timestamp)
    
    - `quiz_questions`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, references quizzes)
      - `question` (text)
      - `type` (text, 'multiple_choice' or 'true_false')
      - `options` (jsonb)
      - `correct_answer` (integer)
      - `points` (integer, default 10)
      - `order_index` (integer, default 0)
    
    - `quiz_attempts`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, references quizzes)
      - `user_id` (uuid, references profiles)
      - `answers` (jsonb)
      - `score` (integer)
      - `max_score` (integer)
      - `started_at` (timestamp)
      - `completed_at` (timestamp, nullable)
    
    - `certificates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `course_id` (uuid, references courses)
      - `issued_at` (timestamp)
      - `certificate_url` (text)
    
    - `files`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text, 'pdf', 'video', or 'link')
      - `url` (text)
      - `course_id` (uuid, nullable, references courses)
      - `lesson_id` (uuid, nullable, references lessons)
      - `uploaded_by` (uuid, references profiles)
      - `uploaded_at` (timestamp)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `message` (text)
      - `type` (text, 'info', 'success', 'warning', or 'error')
      - `read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  max_points integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  file_url text,
  submitted_at timestamptz DEFAULT now(),
  grade integer,
  feedback text,
  graded_at timestamptz,
  graded_by uuid REFERENCES profiles(id),
  UNIQUE(assignment_id, user_id)
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  time_limit integer,
  max_attempts integer DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  type text DEFAULT 'multiple_choice' CHECK (type IN ('multiple_choice', 'true_false')),
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  points integer DEFAULT 10,
  order_index integer DEFAULT 0
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  answers jsonb NOT NULL,
  score integer NOT NULL,
  max_score integer NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  issued_at timestamptz DEFAULT now(),
  certificate_url text NOT NULL,
  UNIQUE(user_id, course_id)
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text DEFAULT 'pdf' CHECK (type IN ('pdf', 'video', 'link')),
  url text NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  uploaded_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Assignments policies
CREATE POLICY "Students can read assignments for enrolled courses"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_enrollments.course_id = assignments.course_id
      AND course_enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage assignments"
  ON assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Submissions policies
CREATE POLICY "Students can manage own submissions"
  ON submissions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read and grade all submissions"
  ON submissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Quizzes policies
CREATE POLICY "Students can read quizzes for enrolled courses"
  ON quizzes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_enrollments.course_id = quizzes.course_id
      AND course_enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage quizzes"
  ON quizzes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Quiz questions policies
CREATE POLICY "Students can read quiz questions"
  ON quiz_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      JOIN course_enrollments ON course_enrollments.course_id = quizzes.course_id
      WHERE quizzes.id = quiz_questions.quiz_id
      AND course_enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage quiz questions"
  ON quiz_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Quiz attempts policies
CREATE POLICY "Students can manage own quiz attempts"
  ON quiz_attempts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all quiz attempts"
  ON quiz_attempts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Certificates policies
CREATE POLICY "Students can read own certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage certificates"
  ON certificates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Files policies
CREATE POLICY "Students can read course files"
  ON files
  FOR SELECT
  TO authenticated
  USING (
    course_id IS NULL OR
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_enrollments.course_id = files.course_id
      AND course_enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage files"
  ON files
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );