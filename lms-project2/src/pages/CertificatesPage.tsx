import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useMockAuth';
import { Award, Download, Calendar, ExternalLink } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  getUserCertificates,
  type MockCertificate 
} from '../data/extendedMockData';
import { mockCourses } from '../data/mockData';

interface CertificateWithCourse extends MockCertificate {
  course_title: string;
  course_description: string;
}

export function CertificatesPage() {
  const { user, profile } = useAuth();
  const [certificates, setCertificates] = useState<CertificateWithCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const userCertificates = getUserCertificates(user.id);
      
      const certificatesWithCourse = userCertificates.map(cert => {
        const course = mockCourses.find(c => c.id === cert.course_id);
        return {
          ...cert,
          course_title: course?.title || 'Unknown Course',
          course_description: course?.description || '',
        };
      });

      setCertificates(certificatesWithCourse);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate: CertificateWithCourse) => {
    // In a real app, this would download the actual certificate
    const link = document.createElement('a');
    link.href = certificate.certificate_url;
    link.download = `${certificate.course_title} - Certificate.pdf`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificates</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Your earned certificates and achievements
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No certificates yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Complete courses to earn certificates of completion
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Certificate Preview */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white text-center">
                <Award className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-lg font-bold mb-2">Certificate of Completion</h3>
                <p className="text-blue-100 text-sm">LearnHub</p>
              </div>

              {/* Certificate Details */}
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {certificate.course_title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {certificate.course_description}
                </p>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Earned on {formatDate(certificate.issued_at)}
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <User className="h-4 w-4 mr-2" />
                  Awarded to {profile?.full_name || 'Student'}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDownload(certificate)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => window.open(certificate.certificate_url, '_blank')}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}