import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useMockAuth';
import { 
  Bell, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  X,
  Check,
  Trash2
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  getUserNotifications,
  mockNotifications,
  type MockNotification 
} from '../data/extendedMockData';

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const userNotifications = getUserNotifications(user.id);
      setNotifications(userNotifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      mockNotifications[notificationIndex].read = true;
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    mockNotifications.forEach(notification => {
      if (notification.user_id === user.id) {
        notification.read = true;
      }
    });

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (notificationId: string) => {
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      mockNotifications.splice(notificationIndex, 1);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  const getNotificationIcon = (type: MockNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: MockNotification['type'], read: boolean) => {
    const opacity = read ? 'bg-opacity-50' : '';
    switch (type) {
      case 'success':
        return `bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 ${opacity}`;
      case 'warning':
        return `bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 ${opacity}`;
      case 'error':
        return `bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 ${opacity}`;
      default:
        return `bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ${opacity}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" size="lg" />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Stay updated with your learning progress
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            You'll receive notifications about course updates, grades, and more
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all ${getNotificationBg(notification.type, notification.read)} ${
                !notification.read ? 'shadow-sm' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${
                        notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}