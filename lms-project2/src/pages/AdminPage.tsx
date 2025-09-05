import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useMockAuth';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  FileText,
  Play,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  mockCourses,
  mockLessons,
  type MockCourse,
  type MockLesson
} from '../data/mockData';

interface CourseWithLessons extends MockCourse {
  lessons: MockLesson[];
}

export function AdminPage() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseWithLessons | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lessons: [] as MockLesson[],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    // small simulated delay
    await new Promise((r) => setTimeout(r, 350));
    try {
      const coursesWithLessons = mockCourses.map((course) => ({
        ...course,
        lessons: (course.lessons || [])
          .slice()
          .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
      }));
      setCourses(coursesWithLessons);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', lessons: [] });
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  const addLesson = () => {
    setFormData((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          id: `temp-${Date.now()}`,
          course_id: '',
          title: '',
          content: '',
          content_type: 'text',
          order_index: prev.lessons.length,
        } as MockLesson,
      ],
    }));
  };

  const updateLesson = (index: number, updates: Partial<MockLesson>) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson, i) => (i === index ? { ...lesson, ...updates } : lesson)),
    }));
  };

  const removeLesson = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index),
    }));
  };

  const startEdit = (course: CourseWithLessons) => {
    // Deep clone lessons to avoid mutating the mock arrays directly during edit
    const clonedLessons = (course.lessons || []).map((l) => ({ ...l }));
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      lessons: clonedLessons,
    });
    setShowCourseForm(true);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // simulate API delay
    await new Promise((r) => setTimeout(r, 600));

    try {
      if (editingCourse) {
        // Update existing course in mockCourses
        const idx = mockCourses.findIndex((c) => c.id === editingCourse.id);
        if (idx !== -1) {
          mockCourses[idx] = {
            ...mockCourses[idx],
            title: formData.title,
            description: formData.description,
            lessons: formData.lessons.map((lesson, index) => ({
              ...lesson,
              id: lesson.id || `lesson-${Date.now()}-${index}`,
              course_id: editingCourse.id,
              order_index: index,
            })),
          };
        }

        // Remove old lessons for this course from mockLessons
        for (let i = mockLessons.length - 1; i >= 0; i--) {
          if (mockLessons[i].course_id === editingCourse.id) {
            mockLessons.splice(i, 1);
          }
        }

        // Add updated lessons to mockLessons
        formData.lessons.forEach((lesson, index) => {
          mockLessons.push({
            ...lesson,
            id: lesson.id || `lesson-${Date.now()}-${index}`,
            course_id: editingCourse.id,
            order_index: index,
          } as MockLesson);
        });
      } else {
        // Create new course (mock)
        const newCourseId = `course-${Date.now()}`;
        const newCourse: MockCourse = {
          id: newCourseId,
          title: formData.title,
          description: formData.description,
          created_at: new Date().toISOString(),
          lessons: formData.lessons.map((lesson, index) => ({
            ...lesson,
            id: lesson.id || `lesson-${Date.now()}-${index}`,
            course_id: newCourseId,
            order_index: index,
          })),
        };

        mockCourses.push(newCourse);
        newCourse.lessons.forEach((lesson) => mockLessons.push(lesson));
      }

      await fetchCourses();
      resetForm();
    } catch (err: unknown) {
      console.error('Error saving course:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this course? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      const idx = mockCourses.findIndex((c) => c.id === courseId);
      if (idx !== -1) mockCourses.splice(idx, 1);

      // remove lessons for that course
      for (let i = mockLessons.length - 1; i >= 0; i--) {
        if (mockLessons[i].course_id === courseId) mockLessons.splice(i, 1);
      }

      await fetchCourses();
    } catch (err: unknown) {
      console.error('Error deleting course:', err);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage courses for your students</p>
          </div>

          <button
            onClick={() => {
              setEditingCourse(null);
              setFormData({ title: '', description: '', lessons: [] });
              setShowCourseForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" /> New Course
          </button>
        </div>

        {/* Modal - Create / Edit Course */}
        <AnimatePresence>
          {showCourseForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {/* backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black dark:bg-black"
              />

              {/* dialog */}
              <motion.div
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 10, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-auto max-h-[90vh]"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleCourseSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter course description"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Lessons</h3>
                      <button
                        type="button"
                        onClick={addLesson}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Lesson
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/60">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Lesson {index + 1}</h4>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => removeLesson(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <span className="text-xs text-gray-500 dark:text-gray-400">#{lesson.id}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lesson Title</label>
                              <input
                                type="text"
                                required
                                value={lesson.title}
                                onChange={(e) => updateLesson(index, { title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter lesson title"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content Type</label>
                              <select
                                value={lesson.content_type}
                                onChange={(e) => updateLesson(index, { content_type: e.target.value as 'text' | 'video' })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="text">Text</option>
                                <option value="video">Video</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                            <textarea
                              rows={4}
                              value={lesson.content}
                              onChange={(e) => updateLesson(index, { content: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder={lesson.content_type === 'video' ? 'Enter video URL or embed code' : 'Enter lesson content'}
                            />
                          </div>
                        </div>
                      ))}

                      {formData.lessons.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No lessons added yet. Click "Add Lesson" to get started.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      {isSaving ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              layout
              whileHover={{ translateY: -4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{course.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                  <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(course)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No courses yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first course to get started</p>
            <button
              onClick={() => {
                setShowCourseForm(true);
                setEditingCourse(null);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Create Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
