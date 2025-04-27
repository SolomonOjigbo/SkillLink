// Welcome.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useAuth';

const Welcome = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      // Redirect to home after 3 seconds
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    } else {
      navigate('/login');
    }
  }, [session, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to SkillLink!</h1>
      <p className="mt-4 text-xl">Your account has been confirmed.</p>
      <p className="mt-2">You'll be redirected to the home page shortly...</p>
    </div>
  );
};

export default Welcome;
