import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useMockAuth';
import { useNotification } from '../contexts/NotificationContext';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  FileText,
  Video,
  ArrowLeft,
  Download,
  ExternalLink
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  mockCourses, 
  getUserEnrollments, 
  getCourseProgress,
  isLessonCompleted,
  mockProgress,
  mockEnrollments,
  type MockLesson 
} from '../data/mockData';
import { getCourseFiles, type MockFile } from '../data/extendedMockData';

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<MockLesson | null>(null);
  const [courseFiles, setCourseFiles] = useState<MockFile[]>([]);

  useEffect(() => {
    fetchCourse();
  }, [courseId, user]);

  const fetchCourse = async () => {
    if (!courseId || !user) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const foundCourse = mockCourses.find(c => c.id === courseId);
      if (!foundCourse) {
        throw new Error('Course not found');
      }

      const enrollments = getUserEnrollments(user.id);
      const isEnrolled = enrollments.some(e => e.course_id === courseId);
      const progress = getCourseProgress(user.id, courseId);
      const files = getCourseFiles(courseId);

      // Mark lessons as completed based on user progress
      const lessonsWithProgress = foundCourse.lessons.map(lesson => ({
        ...lesson,
        completed: isLessonCompleted(user.id, lesson.id),
      }));

      setCourse({
        ...foundCourse,
        lessons: lessonsWithProgress,
        is_enrolled: isEnrolled,
        progress: progress.percentage,
        completed_lessons: progress.completed,
        total_lessons: progress.total,
      });

      setCourseFiles(files);

      // Auto-select first incomplete lesson or first lesson
      const firstIncomplete = lessonsWithProgress.find(lesson => !lesson.completed);
      setSelectedLesson(firstIncomplete || lessonsWithProgress[0] || null);
    } catch (error) {
      console.error('Error fetching course:', error);
      showError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user || !courseId) return;

    setEnrolling(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Add enrollment to mock data
      const newEnrollment = {
        id: `enrollment-${Date.now()}`,
        user_id: user.id,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
      };

      mockEnrollments.push(newEnrollment);
      showSuccess('Successfully enrolled in course!');
      await fetchCourse();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      showError('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteLesson = async (lessonId: string) => {
    if (!user) return;

    try {
      // Add progress to mock data
      const newProgress = {
        id: `progress-${Date.now()}`,
        user_id: user.id,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      };

      mockProgress.push(newProgress);
      showSuccess('Lesson completed!');
      await fetchCourse();

      // Auto-advance to next lesson
      const currentIndex = course.lessons.findIndex((l: MockLesson) => l.id === lessonId);
      const nextLesson = course.lessons[currentIndex + 1];
      if (nextLesson && !nextLesson.completed) {
        setSelectedLesson(nextLesson);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      showError('Failed to mark lesson as complete');
    }
  };

  const handleFileDownload = (file: MockFile) => {
    // Mock file download
    window.open(file.url, '_blank');
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course not found</h2>
        <Link to="/courses" className="text-blue-600 dark:text-blue-400 hover:text-blue-500">
          ← Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/courses"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{course.description}</p>
          </div>
          
          {!course.is_enrolled && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="mt-4 lg:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {enrolling ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <BookOpen className="h-5 w-5 mr-2" />
              )}
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}
        </div>

        {course.is_enrolled && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Progress: {course.completed_lessons} / {course.total_lessons} lessons
              </span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {course.progress}% complete
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {course.is_enrolled ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {selectedLesson.title}
                  </h2>
                  {selectedLesson.completed && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>

                {selectedLesson.content_type === 'video' ? (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center mb-6">
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Video content would be displayed here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{selectedLesson.content}</p>
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {selectedLesson.content}
                    </div>
                  </div>
                )}

                {!selectedLesson.completed && (
                  <button
                    onClick={() => handleCompleteLesson(selectedLesson.id)}
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Complete
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a lesson to start learning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose a lesson from the sidebar to begin
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lessons List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lessons</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson: MockLesson, index: number) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        lesson.completed
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          selectedLesson?.id === lesson.id
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center mt-1">
                          {lesson.content_type === 'video' ? (
                            <Video className="h-3 w-3 text-gray-400 mr-1" />
                          ) : (
                            <FileText className="h-3 w-3 text-gray-400 mr-1" />
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {lesson.content_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Files */}
            {courseFiles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Files</h3>
                <div className="space-y-3">
                  {courseFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {file.type === 'video' ? (
                            <Video className="h-5 w-5 text-purple-600" />
                          ) : file.type === 'link' ? (
                            <ExternalLink className="h-5 w-5 text-blue-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {file.type}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFileDownload(file)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Enroll to access course content
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join this course to start learning and track your progress
          </p>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {enrolling ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <BookOpen className="h-5 w-5 mr-2" />
            )}
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      )}
    </div>
  );
}