import React, { useState } from "react";
import { useAuth } from "../hooks/useMockAuth";
import { useNotification } from "../contexts/NotificationContext";
import {
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  Upload,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { FileUpload } from "../components/FileUpload";
import {
  getUserEnrollments,
  getCompletedCourses,
} from "../data/mockData";
import {
  getUserCertificates,
  getUserQuizAttempts,
} from "../data/extendedMockData";

export function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    bio:
      "Passionate learner exploring new technologies and expanding my knowledge through online courses.",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      await updateProfile({
        full_name: formData.full_name,
        email: formData.email,
      });
      setIsEditing(false);
      showSuccess("Profile updated successfully!");
    } catch (error: any) {
      showError("Failed to update profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !profile) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  const enrollments = getUserEnrollments(user.id);
  const completedCourses = getCompletedCourses(user.id);
  const certificates = getUserCertificates(user.id);
  const quizAttempts = getUserQuizAttempts(user.id);

  const averageQuizScore =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce(
            (sum, attempt) =>
              sum + (attempt.score / attempt.max_score) * 100,
            0
          ) / quizAttempts.length
        )
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 shadow-lg relative text-white">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="h-14 w-14 text-blue-600" />
            </div>
            <button
              onClick={() => setShowAvatarUpload(true)}
              className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-md"
            >
              <Upload className="h-4 w-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            <p className="text-blue-100">{profile.email}</p>
            <div className="flex items-center mt-2 text-sm text-blue-200">
              <Calendar className="h-4 w-4 mr-1" />
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white bg-opacity-20 text-white px-5 py-2 rounded-md hover:bg-opacity-30 transition-colors flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* About / Edit Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isSaving ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                About
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {formData.bio}
              </p>
            </div>
          )}
        </div>

        {/* Learning Stats */}
        <div className="space-y-4">
          {[
            {
              label: "Enrolled Courses",
              value: enrollments.length,
              icon: BookOpen,
              color: "blue",
            },
            {
              label: "Completed Courses",
              value: completedCourses.length,
              icon: CheckCircle,
              color: "green",
            },
            {
              label: "Quiz Average",
              value: `${averageQuizScore}%`,
              icon: TrendingUp,
              color: "purple",
            },
            {
              label: "Certificates",
              value: certificates.length,
              icon: Award,
              color: "yellow",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl p-5 flex items-center shadow-md`}
            >
              <stat.icon
                className={`h-10 w-10 text-${stat.color}-600 dark:text-${stat.color}-400 mr-4`}
              />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upload Avatar
              </h2>
            </div>

            <div className="p-6">
              <FileUpload
                onFileSelect={() => {
                  showSuccess("Avatar updated successfully!");
                  setShowAvatarUpload(false);
                }}
                acceptedTypes={["image/*"]}
                maxFiles={1}
                maxSize={5 * 1024 * 1024}
              />
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowAvatarUpload(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
