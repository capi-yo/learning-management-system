import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useMockAuth';
import { useNotification } from '../contexts/NotificationContext';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Eye
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FileUpload } from '../components/FileUpload';
import { 
  getUserAssignments, 
  getUserSubmissions,
  mockSubmissions,
  type MockAssignment,
  type MockSubmission 
} from '../data/extendedMockData';

interface AssignmentWithSubmission extends MockAssignment {
  submission?: MockSubmission;
  status: 'not_submitted' | 'submitted' | 'graded' | 'overdue';
}

export function AssignmentsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [assignments, setAssignments] = useState<AssignmentWithSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const userAssignments = getUserAssignments(user.id);
      const userSubmissions = getUserSubmissions(user.id);

      const assignmentsWithStatus = userAssignments.map(assignment => {
        const submission = userSubmissions.find(s => s.assignment_id === assignment.id);
        const dueDate = new Date(assignment.due_date);
        const now = new Date();
        
        let status: AssignmentWithSubmission['status'] = 'not_submitted';
        
        if (submission) {
          status = submission.grade !== undefined ? 'graded' : 'submitted';
        } else if (now > dueDate) {
          status = 'overdue';
        }

        return {
          ...assignment,
          submission,
          status,
        };
      });

      setAssignments(assignmentsWithStatus);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      showError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = async (assignmentId: string) => {
    if (!user || !submissionContent.trim()) {
      showError('Please provide submission content');
      return;
    }

    setSubmitting(assignmentId);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Create new submission
      const newSubmission: MockSubmission = {
        id: `submission-${Date.now()}`,
        assignment_id: assignmentId,
        user_id: user.id,
        content: submissionContent,
        file_url: selectedFiles.length > 0 ? `uploads/${selectedFiles[0].name}` : undefined,
        submitted_at: new Date().toISOString(),
      };

      mockSubmissions.push(newSubmission);
      
      setSubmissionContent('');
      setSelectedFiles([]);
      setShowSubmissionModal(null);
      showSuccess('Assignment submitted successfully!');
      
      await fetchAssignments();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      showError('Failed to submit assignment');
    } finally {
      setSubmitting(null);
    }
  };

  const getStatusColor = (status: AssignmentWithSubmission['status']) => {
    switch (status) {
      case 'graded':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'submitted':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'overdue':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: AssignmentWithSubmission['status']) => {
    switch (status) {
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          View and submit your course assignments
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No assignments yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Assignments will appear here when your instructors create them
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {assignment.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {assignment.description}
                  </p>
                </div>
                
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                  {getStatusIcon(assignment.status)}
                  <span className="ml-2 capitalize">{assignment.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {formatDate(assignment.due_date)}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FileText className="h-4 w-4 mr-2" />
                  Max Points: {assignment.max_points}
                </div>
                {assignment.submission && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submitted: {formatDate(assignment.submission.submitted_at)}
                  </div>
                )}
              </div>

              {assignment.submission && assignment.submission.grade !== undefined && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800 dark:text-green-200">Grade Received</h4>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {assignment.submission.grade}/{assignment.max_points}
                    </span>
                  </div>
                  {assignment.submission.feedback && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>Feedback:</strong> {assignment.submission.feedback}
                    </p>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                {assignment.status === 'not_submitted' && new Date() <= new Date(assignment.due_date) && (
                  <button
                    onClick={() => setShowSubmissionModal(assignment.id)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Assignment
                  </button>
                )}
                
                {assignment.submission && (
                  <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    View Submission
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Submit Assignment
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Submission Content
                </label>
                <textarea
                  rows={6}
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your assignment submission..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attach Files (Optional)
                </label>
                <FileUpload
                  onFileSelect={setSelectedFiles}
                  maxFiles={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowSubmissionModal(null);
                    setSubmissionContent('');
                    setSelectedFiles([]);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmission(showSubmissionModal)}
                  disabled={submitting === showSubmissionModal || !submissionContent.trim()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting === showSubmissionModal ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {submitting === showSubmissionModal ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}