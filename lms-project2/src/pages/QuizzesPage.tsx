import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useMockAuth';
import { useNotification } from '../contexts/NotificationContext';
import { 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  Play, 
  Trophy,
  RotateCcw
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  getCourseQuizzes, 
  getUserQuizAttempts,
  mockQuizAttempts,
  type MockQuiz,
  type MockQuizAttempt,
  type MockQuestion 
} from '../data/extendedMockData';
import { getUserEnrollments } from '../data/mockData';

interface QuizWithAttempts extends MockQuiz {
  attempts: MockQuizAttempt[];
  best_score?: number;
  attempts_remaining: number;
}

export function QuizzesPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [quizzes, setQuizzes] = useState<QuizWithAttempts[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<MockQuiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [user]);

  useEffect(() => {
    if (activeQuiz && timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, activeQuiz]);

  const fetchQuizzes = async () => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const enrollments = getUserEnrollments(user.id);
      const enrolledCourseIds = enrollments.map(e => e.course_id);
      
      const allQuizzes: QuizWithAttempts[] = [];
      
      for (const courseId of enrolledCourseIds) {
        const courseQuizzes = getCourseQuizzes(courseId);
        const userAttempts = getUserQuizAttempts(user.id);
        
        courseQuizzes.forEach(quiz => {
          const quizAttempts = userAttempts.filter(attempt => attempt.quiz_id === quiz.id);
          const bestScore = quizAttempts.length > 0 
            ? Math.max(...quizAttempts.map(a => (a.score / a.max_score) * 100))
            : undefined;
          
          allQuizzes.push({
            ...quiz,
            attempts: quizAttempts,
            best_score: bestScore,
            attempts_remaining: quiz.max_attempts - quizAttempts.length,
          });
        });
      }

      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      showError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz: MockQuiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    if (quiz.time_limit) {
      setTimeLeft(quiz.time_limit * 60); // Convert minutes to seconds
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !user) return;

    setSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Calculate score
      let score = 0;
      let maxScore = 0;

      activeQuiz.questions.forEach(question => {
        maxScore += question.points;
        if (answers[question.id] === question.correct_answer) {
          score += question.points;
        }
      });

      // Create quiz attempt
      const newAttempt: MockQuizAttempt = {
        id: `attempt-${Date.now()}`,
        quiz_id: activeQuiz.id,
        user_id: user.id,
        answers,
        score,
        max_score: maxScore,
        started_at: new Date(Date.now() - (activeQuiz.time_limit ? activeQuiz.time_limit * 60 * 1000 : 0)).toISOString(),
        completed_at: new Date().toISOString(),
      };

      mockQuizAttempts.push(newAttempt);

      const percentage = Math.round((score / maxScore) * 100);
      showSuccess(`Quiz completed! Score: ${score}/${maxScore} (${percentage}%)`);
      
      setActiveQuiz(null);
      setTimeLeft(null);
      await fetchQuizzes();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      showError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  // Quiz taking interface
  if (activeQuiz) {
    const currentQ = activeQuiz.questions[currentQuestion];
    const isLastQuestion = currentQuestion === activeQuiz.questions.length - 1;
    const allAnswered = activeQuiz.questions.every(q => answers[q.id] !== undefined);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Quiz header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeQuiz.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Question {currentQuestion + 1} of {activeQuiz.questions.length}
              </p>
            </div>
            
            {timeLeft !== null && (
              <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600'} dark:text-gray-300`}>
                <Clock className="h-5 w-5 inline mr-2" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentQ.question}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQ.id, index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    answers[currentQ.id] === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[currentQ.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {answers[currentQ.id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              {!isLastQuestion ? (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={answers[currentQ.id] === undefined}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!allAnswered || submitting}
                  className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Test your knowledge with course quizzes
        </p>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No quizzes available
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Quizzes will appear here when your instructors create them
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quiz.title}
                </h3>
                {quiz.best_score !== undefined && (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{Math.round(quiz.best_score)}%</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {quiz.description}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {quiz.questions.length} questions
                </div>
                {quiz.time_limit && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {quiz.time_limit} minutes
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {quiz.attempts_remaining} attempts remaining
                </div>
              </div>

              {quiz.attempts.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Previous Attempts
                  </h4>
                  <div className="space-y-1">
                    {quiz.attempts.slice(-3).map((attempt, index) => (
                      <div key={attempt.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Attempt {quiz.attempts.length - index}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {attempt.score}/{attempt.max_score} ({Math.round((attempt.score / attempt.max_score) * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => startQuiz(quiz)}
                disabled={quiz.attempts_remaining <= 0}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-4 w-4 mr-2" />
                {quiz.attempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}