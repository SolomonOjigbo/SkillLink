import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../../hooks/useAuth';
import { PageLoading } from '@ui/utils/PageLoading';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { data: session, isLoading, error } = useSession();

  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
