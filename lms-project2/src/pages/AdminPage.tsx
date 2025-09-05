import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useMockAuth';
import { Plus, Edit, Trash2, BookOpen, FileText, Play, Save, X } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { mockCourses, mockLessons, type MockCourse, type MockLesson } from '../data/mockData';

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
  }, []);

  const fetchCourses = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const coursesWithLessons = mockCourses.map(course => ({
        ...course,
        lessons: course.lessons.sort((a, b) => a.order_index - b.order_index)
      }));

      setCourses(coursesWithLessons);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (editingCourse) {
        // Update existing course
        const courseIndex = mockCourses.findIndex(c => c.id === editingCourse.id);
        if (courseIndex !== -1) {
          mockCourses[courseIndex] = {
            ...mockCourses[courseIndex],
            title: formData.title,
            description: formData.description,
            lessons: formData.lessons.map((lesson, index) => ({
              ...lesson,
              id: lesson.id || `lesson-${Date.now()}-${index}`,
              course_id: editingCourse.id,
              order_index: index,
            }))
          };
        }

        // Update lessons in mockLessons array
        // Remove old lessons for this course
        for (let i = mockLessons.length - 1; i >= 0; i--) {
          if (mockLessons[i].course_id === editingCourse.id) {
            mockLessons.splice(i, 1);
          }
        }
        
        // Add new lessons
        formData.lessons.forEach((lesson, index) => {
          mockLessons.push({
            ...lesson,
            id: lesson.id || `lesson-${Date.now()}-${index}`,
            course_id: editingCourse.id,
            order_index: index,
          });
        });
      } else {
        // Create new course
        const newCourseId = `course-${Date.now()}`;
        const newCourse: MockCourse = {
          id: newCourseId,
          title: formData.title,
          description: formData.description,
          created_at: new Date().toISOString(),
          lessons: formData.lessons.map((lesson, index) => ({
            ...lesson,
            id: `lesson-${Date.now()}-${index}`,
            course_id: newCourseId,
            order_index: index,
          }))
        };

        mockCourses.push(newCourse);
        
        // Add lessons to mockLessons array
        newCourse.lessons.forEach(lesson => {
          mockLessons.push(lesson);
        });
      }

      await fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      // Remove course from mockCourses
      const courseIndex = mockCourses.findIndex(c => c.id === courseId);
      if (courseIndex !== -1) {
        mockCourses.splice(courseIndex, 1);
      }

      // Remove lessons from mockLessons
      for (let i = mockLessons.length - 1; i >= 0; i--) {
        if (mockLessons[i].course_id === courseId) {
          mockLessons.splice(i, 1);
        }
      }

      await fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      lessons: [],
    });
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  const addLesson = () => {
    setFormData(prev => ({
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
        }
      ]
    }));
  };

  const updateLesson = (index: number, updates: Partial<MockLesson>) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.map((lesson, i) =>
        i === index ? { ...lesson, ...updates } : lesson
      )
    }));
  };

  const removeLesson = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index)
    }));
  };

  const startEdit = (course: CourseWithLessons) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      lessons: course.lessons || [],
    });
    setShowCourseForm(true);
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600 mt-2">Create and manage courses for your students</p>
          </div>
          
          <button
            onClick={() => setShowCourseForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Course
          </button>
        </div>

        {/* Course Form Modal */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCourseSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter course description"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Lessons</h3>
                    <button
                      type="button"
                      onClick={addLesson}
                      className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Lesson
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.lessons.map((lesson, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Lesson {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeLesson(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Lesson Title
                            </label>
                            <input
                              type="text"
                              required
                              value={lesson.title}
                              onChange={(e) => updateLesson(index, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter lesson title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Content Type
                            </label>
                            <select
                              value={lesson.content_type}
                              onChange={(e) => updateLesson(index, { content_type: e.target.value as 'text' | 'video' })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="text">Text</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                          </label>
                          <textarea
                            rows={4}
                            value={lesson.content}
                            onChange={(e) => updateLesson(index, { content: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder={lesson.content_type === 'video' ? 'Enter video URL or embed code' : 'Enter lesson content'}
                          />
                        </div>
                      </div>
                    ))}

                    {formData.lessons.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No lessons added yet. Click "Add Lesson" to get started.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">Create your first course to get started</p>
            <button
              onClick={() => setShowCourseForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}