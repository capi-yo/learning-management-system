// Extended mock data for additional features
export interface MockAssignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
  created_at: string;
}

export interface MockSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  content: string;
  file_url?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: string;
}

export interface MockQuiz {
  id: string;
  course_id: string;
  title: string;
  description: string;
  questions: MockQuestion[];
  time_limit?: number;
  max_attempts: number;
  created_at: string;
}

export interface MockQuestion {
  id: string;
  quiz_id: string;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: number;
  points: number;
}

export interface MockQuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: Record<string, number>;
  score: number;
  max_score: number;
  started_at: string;
  completed_at?: string;
}

export interface MockCertificate {
  id: string;
  user_id: string;
  course_id: string;
  issued_at: string;
  certificate_url: string;
}

export interface MockFile {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  course_id?: string;
  lesson_id?: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface MockNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

// Mock assignments
export const mockAssignments: MockAssignment[] = [
  {
    id: 'assignment-1',
    course_id: 'course-1',
    title: 'Build a React Component',
    description: 'Create a reusable React component that demonstrates props, state, and event handling.',
    due_date: '2024-02-15T23:59:00Z',
    max_points: 100,
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'assignment-2',
    course_id: 'course-2',
    title: 'JavaScript Functions Exercise',
    description: 'Complete the provided JavaScript exercises focusing on functions, arrays, and objects.',
    due_date: '2024-02-10T23:59:00Z',
    max_points: 80,
    created_at: '2024-01-18T10:00:00Z',
  },
];

// Mock submissions
export const mockSubmissions: MockSubmission[] = [
  {
    id: 'submission-1',
    assignment_id: 'assignment-2',
    user_id: 'user-1',
    content: 'Here is my solution to the JavaScript functions exercise...',
    submitted_at: '2024-01-25T14:30:00Z',
    grade: 75,
    feedback: 'Good work! Your functions are well-structured. Consider adding more error handling.',
    graded_at: '2024-01-26T10:00:00Z',
    graded_by: 'user-2',
  },
];

// Mock quizzes
export const mockQuizzes: MockQuiz[] = [
  {
    id: 'quiz-1',
    course_id: 'course-1',
    title: 'React Basics Quiz',
    description: 'Test your understanding of React fundamentals',
    time_limit: 30,
    max_attempts: 3,
    created_at: '2024-01-22T10:00:00Z',
    questions: [
      {
        id: 'question-1',
        quiz_id: 'quiz-1',
        question: 'What is JSX?',
        type: 'multiple_choice',
        options: [
          'A JavaScript library',
          'A syntax extension for JavaScript',
          'A CSS framework',
          'A database query language'
        ],
        correct_answer: 1,
        points: 10,
      },
      {
        id: 'question-2',
        quiz_id: 'quiz-1',
        question: 'React components must return a single parent element.',
        type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 0,
        points: 10,
      },
    ],
  },
];

// Mock quiz attempts
export const mockQuizAttempts: MockQuizAttempt[] = [
  {
    id: 'attempt-1',
    quiz_id: 'quiz-1',
    user_id: 'user-1',
    answers: { 'question-1': 1, 'question-2': 0 },
    score: 20,
    max_score: 20,
    started_at: '2024-01-23T10:00:00Z',
    completed_at: '2024-01-23T10:15:00Z',
  },
];

// Mock certificates
export const mockCertificates: MockCertificate[] = [
  {
    id: 'cert-1',
    user_id: 'user-1',
    course_id: 'course-2',
    issued_at: '2024-01-25T16:00:00Z',
    certificate_url: '/certificates/cert-1.pdf',
  },
];

// Mock files
export const mockFiles: MockFile[] = [
  {
    id: 'file-1',
    name: 'React Documentation.pdf',
    type: 'pdf',
    url: 'https://example.com/react-docs.pdf',
    course_id: 'course-1',
    uploaded_by: 'user-2',
    uploaded_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'file-2',
    name: 'Introduction to React Video',
    type: 'video',
    url: 'https://example.com/react-intro.mp4',
    lesson_id: 'lesson-1',
    uploaded_by: 'user-2',
    uploaded_at: '2024-01-20T11:00:00Z',
  },
];

// Mock notifications
export const mockNotifications: MockNotification[] = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    title: 'Assignment Graded',
    message: 'Your JavaScript Functions Exercise has been graded. Score: 75/80',
    type: 'success',
    read: false,
    created_at: '2024-01-26T10:00:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    title: 'New Assignment Available',
    message: 'A new assignment "Build a React Component" has been posted in React Fundamentals',
    type: 'info',
    read: true,
    created_at: '2024-01-20T10:00:00Z',
  },
];

// Helper functions
export const getUserAssignments = (userId: string) => {
  // Get user's enrolled courses
  const { getUserEnrollments } = require('./mockData');
  const enrollments = getUserEnrollments(userId);
  const enrolledCourseIds = enrollments.map((e: any) => e.course_id);
  
  return mockAssignments.filter(assignment => 
    enrolledCourseIds.includes(assignment.course_id)
  );
};

export const getUserSubmissions = (userId: string) => {
  return mockSubmissions.filter(submission => submission.user_id === userId);
};

export const getCourseAssignments = (courseId: string) => {
  return mockAssignments.filter(assignment => assignment.course_id === courseId);
};

export const getCourseQuizzes = (courseId: string) => {
  return mockQuizzes.filter(quiz => quiz.course_id === courseId);
};

export const getUserQuizAttempts = (userId: string) => {
  return mockQuizAttempts.filter(attempt => attempt.user_id === userId);
};

export const getUserNotifications = (userId: string) => {
  return mockNotifications.filter(notification => notification.user_id === userId);
};

export const getUserCertificates = (userId: string) => {
  return mockCertificates.filter(cert => cert.user_id === userId);
};

export const getCourseFiles = (courseId: string) => {
  return mockFiles.filter(file => file.course_id === courseId);
};

export const getLessonFiles = (lessonId: string) => {
  return mockFiles.filter(file => file.lesson_id === lessonId);
};