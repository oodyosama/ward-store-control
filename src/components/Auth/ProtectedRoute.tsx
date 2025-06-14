
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useTenant();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!isLoading && !user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">جاري التحميل...</p>
          <p className="text-sm text-gray-500 mt-2">يتم تحميل بيانات المستخدم</p>
        </div>
      </div>
    );
  }

  // If no user, show redirect message (navigation will happen via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">جاري التوجيه لصفحة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, show children even if profile is null
  // (profile might be null if user hasn't completed setup)
  return <>{children}</>;
}
