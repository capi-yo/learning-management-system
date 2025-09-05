import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useMockAuth';
import { BookOpen, Clock, CheckCircle, Play, FileText } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  mockCourses, 
  getUserEnrollments, 
  getCourseProgress,
  type MockCourse 
} from '../data/mockData';

interface CourseWithProgress extends MockCourse {
  progress?: number;
  total_lessons?: number;
  completed_lessons?: number;
  is_enrolled?: boolean;
}

export function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'completed'>('all');

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const userEnrollments = getUserEnrollments(user.id);
      
      const coursesWithProgress = mockCourses.map(course => {
        const enrollment = userEnrollments.find(e => e.course_id === course.id);
        const progress = getCourseProgress(user.id, course.id);
        
        return {
          ...course,
          is_enrolled: !!enrollment,
          total_lessons: course.lessons.length,
          completed_lessons: progress.completed,
          progress: progress.percentage,
        };
      });

      setCourses(coursesWithProgress);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    switch (filter) {
      case 'enrolled':
        return course.is_enrolled;
      case 'completed':
        return course.is_enrolled && course.progress === 100;
      default:
        return true;
    }
  });

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage and continue your learning journey
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'all', label: 'All Courses' },
              { id: 'enrolled', label: 'Enrolled' },
              { id: 'completed', label: 'Completed' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {filter === 'enrolled' 
              ? 'You haven\'t enrolled in any courses yet'
              : filter === 'completed'
              ? 'You haven\'t completed any courses yet'
              : 'No courses available'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  {course.progress === 100 && (
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{course.total_lessons} lessons</span>
                </div>

                {course.is_enrolled && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{course.completed_lessons} / {course.total_lessons} lessons</span>
                      <span>{course.progress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link
                  to={`/course/${course.id}`}
                  className="inline-flex items-center w-full justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {course.is_enrolled ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      View Course
                    </>
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}