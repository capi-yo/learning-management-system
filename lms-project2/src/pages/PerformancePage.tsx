import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useMockAuth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  getUserEnrollments, 
  getCourseProgress,
  mockCourses 
} from '../data/mockData';
import { 
  getUserQuizAttempts, 
  getUserSubmissions,
  getUserCertificates 
} from '../data/extendedMockData';

interface PerformanceData {
  courseProgress: Array<{
    name: string;
    progress: number;
    completed: number;
    total: number;
  }>;
  quizScores: Array<{
    date: string;
    score: number;
    quiz: string;
  }>;
  assignmentGrades: Array<{
    name: string;
    grade: number;
    maxGrade: number;
  }>;
  overallStats: {
    totalCourses: number;
    completedCourses: number;
    averageQuizScore: number;
    averageAssignmentGrade: number;
    certificatesEarned: number;
  };
}

export function PerformancePage() {
  const { user } = useAuth();
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [user]);

  const fetchPerformanceData = async () => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const enrollments = getUserEnrollments(user.id);
      const quizAttempts = getUserQuizAttempts(user.id);
      const submissions = getUserSubmissions(user.id);
      const certificates = getUserCertificates(user.id);

      // Course progress data
      const courseProgress = enrollments.map(enrollment => {
        const course = mockCourses.find(c => c.id === enrollment.course_id);
        const progress = getCourseProgress(user.id, enrollment.course_id);
        
        return {
          name: course?.title.substring(0, 15) + '...' || 'Unknown Course',
          progress: progress.percentage,
          completed: progress.completed,
          total: progress.total,
        };
      });

      // Quiz scores over time
      const quizScores = quizAttempts
        .filter(attempt => attempt.completed_at)
        .sort((a, b) => new Date(a.completed_at!).getTime() - new Date(b.completed_at!).getTime())
        .map(attempt => ({
          date: new Date(attempt.completed_at!).toLocaleDateString(),
          score: Math.round((attempt.score / attempt.max_score) * 100),
          quiz: `Quiz ${attempt.quiz_id.slice(-1)}`,
        }));

      // Assignment grades
      const assignmentGrades = submissions
        .filter(sub => sub.grade !== undefined)
        .map(sub => ({
          name: `Assignment ${sub.assignment_id.slice(-1)}`,
          grade: sub.grade!,
          maxGrade: 100, // Assuming max grade is 100
        }));

      // Overall stats
      const completedCourses = enrollments.filter(enrollment => {
        const progress = getCourseProgress(user.id, enrollment.course_id);
        return progress.percentage === 100;
      }).length;

      const averageQuizScore = quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((sum, attempt) => 
            sum + (attempt.score / attempt.max_score) * 100, 0) / quizAttempts.length)
        : 0;

      const averageAssignmentGrade = submissions.filter(s => s.grade).length > 0
        ? Math.round(submissions
            .filter(s => s.grade)
            .reduce((sum, sub) => sum + sub.grade!, 0) / submissions.filter(s => s.grade).length)
        : 0;

      setData({
        courseProgress,
        quizScores,
        assignmentGrades,
        overallStats: {
          totalCourses: enrollments.length,
          completedCourses,
          averageQuizScore,
          averageAssignmentGrade,
          certificatesEarned: certificates.length,
        },
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No performance data available
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Complete some courses and quizzes to see your performance analytics
          </p>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Track your learning progress and achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overallStats.totalCourses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overallStats.completedCourses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-full p-3">
              <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Quiz Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overallStats.averageQuizScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Assignment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overallStats.averageAssignmentGrade}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/20 rounded-full p-3">
              <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overallStats.certificatesEarned}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Course Progress Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.courseProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quiz Scores Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quiz Performance</h3>
          {data.quizScores.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.quizScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300 text-gray-500 dark:text-gray-400">
              No quiz data available
            </div>
          )}
        </div>
      </div>

      {/* Assignment Grades */}
      {data.assignmentGrades.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Assignment Grades</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.assignmentGrades}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="grade" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}