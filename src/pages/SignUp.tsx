import { useState, useEffect } from 'react';
import { useSignup, useSession } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: ''
  });
  const { mutate: signUp, status, error } = useSignup();
  const isLoading = status === 'pending';
  const { data: session } = useSession();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.username) {
      return;
    }

    signUp(
      {
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.full_name
          },
          redirectTo: `${window.location.origin}/welcome` // Corrected property name
        }
      },
      {
        onSuccess: () => {
          setFormData({
            full_name: '',
            email: '',
            username: '',
            password: ''
          });
          // Show success message but don't redirect yet
        }
      }
    );
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className=" flex flex-col items-center justify-center text-center align-middle">
      <div className="card my-8 flex w-1/3 flex-col justify-center bg-white p-10">
        <form onSubmit={handleSubmit}>
          <h3 className="my-3 text-3xl text-black">SignUp to SkillLink</h3>
          <div className="flex w-full flex-grow flex-col justify-center gap-5 align-middle">
            <input
              type="text"
              value={formData.username || ''}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter a username"
              required
              className="input-primary input"
            />
            <input
              type="text"
              value={formData.full_name || ''}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Enter Full Name"
              required
              className="input-primary input"
            />
            <input
              type="text"
              value={formData.email || ''}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              required
              className="input-primary input"
            />
            <input
              type="password"
              value={formData.password || ''}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter Password"
              required
              className="input-primary input"
            />
          </div>
          <button type="submit" className="btn btn-primary my-6 w-full">
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <Link to="/login">
            <p className="text-gray-600">Already have an account? Login</p>
          </Link>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
