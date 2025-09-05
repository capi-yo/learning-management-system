import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useMockAuth';
import { 
  BookOpen, 
  Award, 
  Clock,
  CheckCircle,
  FileText,
  HelpCircle,
  Users,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  mockCourses, 
  getUserEnrollments, 
  getCourseProgress,
  getCompletedCourses 
} from '../data/mockData';
import { 
  getUserAssignments, 
  getUserSubmissions,
  getUserQuizAttempts,
  getUserCertificates 
} from '../data/extendedMockData';

export function Dashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    pendingAssignments: 0,
    averageQuizScore: 0,
    certificatesEarned: 0,
    totalStudents: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const enrollments = getUserEnrollments(user.id);
      const completedCourses = getCompletedCourses(user.id);
      const assignments = getUserAssignments(user.id);
      const submissions = getUserSubmissions(user.id);
      const quizAttempts = getUserQuizAttempts(user.id);
      const certificates = getUserCertificates(user.id);

      const pendingAssignments = assignments.filter(assignment => {
        const hasSubmission = submissions.some(sub => sub.assignment_id === assignment.id);
        return !hasSubmission && new Date(assignment.due_date) > new Date();
      });

      const averageQuizScore = quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((sum, attempt) => 
            sum + (attempt.score / attempt.max_score) * 100, 0) / quizAttempts.length)
        : 0;

      setStats({
        enrolledCourses: enrollments.length,
        completedCourses: completedCourses.length,
        pendingAssignments: pendingAssignments.length,
        averageQuizScore,
        certificatesEarned: certificates.length,
        totalStudents: profile?.role === 'admin' ? 150 : 0,
      });

      const activity = [
        ...submissions.slice(-3).map(sub => ({
          type: 'submission',
          title: 'Assignment Submitted',
          description: `Assignment ${sub.assignment_id.slice(-1)} submitted`,
          time: sub.submitted_at,
        })),
        ...quizAttempts.slice(-3).map(attempt => ({
          type: 'quiz',
          title: 'Quiz Completed',
          description: `Quiz ${attempt.quiz_id.slice(-1)} - Score: ${Math.round((attempt.score / attempt.max_score) * 100)}%`,
          time: attempt.completed_at || attempt.started_at,
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Welcome back, {profile?.full_name || 'Student'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's your learning progress overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[
          { label: 'Enrolled Courses', value: stats.enrolledCourses, icon: BookOpen, color: 'blue' },
          { label: 'Completed', value: stats.completedCourses, icon: CheckCircle, color: 'green' },
          { label: 'Pending', value: stats.pendingAssignments, icon: FileText, color: 'yellow' },
          { label: 'Quiz Average', value: `${stats.averageQuizScore}%`, icon: HelpCircle, color: 'purple' },
          { label: 'Certificates', value: stats.certificatesEarned, icon: Award, color: 'indigo' },
          profile?.role === 'admin' && { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'red' }
        ].filter(Boolean).map((item, index) => (
          <motion.div
            key={index}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/40 p-6 hover:shadow-xl hover:scale-[1.02] transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <div className={`rounded-full p-3 bg-${item?.color}-100 dark:bg-${item?.color}-900/20`}>
                <item.icon className={`h-6 w-6 text-${item?.color}-600 dark:text-${item?.color}-400`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item?.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{item?.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div 
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/40 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50/70 dark:bg-gray-700/70 hover:shadow-md transition"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`rounded-full p-2 ${
                    activity.type === 'submission' 
                      ? 'bg-blue-100 dark:bg-blue-900/20' 
                      : 'bg-green-100 dark:bg-green-900/20'
                  }`}>
                    {activity.type === 'submission' ? (
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <HelpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(activity.time).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/40 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[{
              path: '/courses', label: 'Browse Courses', icon: BookOpen, color: 'blue'
            },{
              path: '/assignments', label: 'Assignments', icon: FileText, color: 'yellow'
            },{
              path: '/quizzes', label: 'Take Quiz', icon: HelpCircle, color: 'green'
            },{
              path: '/performance', label: 'Performance', icon: BarChart3, color: 'purple'
            }].map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className={`flex flex-col items-center p-4 rounded-lg bg-${action.color}-50 dark:bg-${action.color}-900/20 hover:scale-[1.05] hover:shadow-md transition`}
              >
                <action.icon className={`h-8 w-8 text-${action.color}-600 dark:text-${action.color}-400 mb-2`} />
                <span className={`text-sm font-medium text-${action.color}-700 dark:text-${action.color}-300`}>
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Current Courses */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Continue Learning</h2>
          <Link to="/courses" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium">
            View all courses →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.slice(0, 3).map((course, i) => {
            const progress = user ? getCourseProgress(user.id, course.id) : { percentage: 0, completed: 0, total: course.lessons.length };
            return (
              <motion.div
                key={course.id}
                className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/40 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{progress.completed} / {progress.total} lessons</span>
                      <span>{progress.percentage}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="inline-flex items-center w-full justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:opacity-90 transition"
                  >
                    Continue Learning
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
