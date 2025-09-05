import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useMockAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { CoursePage } from './pages/CoursePage';
import { CoursesPage } from './pages/CoursesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { PerformancePage } from './pages/PerformancePage';
import { CertificatesPage } from './pages/CertificatesPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { BlogPage } from './pages/BlogPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/courses"
                      element={
                        <ProtectedRoute>
                          <CoursesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/course/:courseId"
                      element={
                        <ProtectedRoute>
                          <CoursePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/assignments"
                      element={
                        <ProtectedRoute>
                          <AssignmentsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quizzes"
                      element={
                        <ProtectedRoute>
                          <QuizzesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/certificates"
                      element={
                        <ProtectedRoute>
                          <CertificatesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/performance"
                      element={
                        <ProtectedRoute>
                          <PerformancePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/blog"
                      element={
                        <ProtectedRoute>
                          <BlogPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute requireAdmin>
                          <UserManagementPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/analytics"
                      element={
                        <ProtectedRoute requireAdmin>
                          <PerformancePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;