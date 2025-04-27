import { useState, useEffect } from 'react';
import { useLogin, useSession } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, error } = useLogin();
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);
    login(
      {
        email,
        password
      },
      {
        onSuccess: () => {
          // Clear form on successful login
          setSuccess(true);
          setEmail('');
          setPassword('');
        }
      }
    );
  };

   return (
     <div className=" flex flex-col items-center justify-center text-center align-middle">
       <div className="card my-8 flex flex-col justify-center bg-white p-10 sm:w-full lg:w-1/3">
         {error && (
           <div className="mb-4 rounded bg-red-100 p-2 text-red-700">
             Error: {error.message}
           </div>
         )}
         {success && (
           <div className="mb-4 rounded bg-green-100 p-2 text-green-700">
             Login successful!
           </div>
         )}
         <form onSubmit={handleSubmit}>
           <h3 className="my-3 text-3xl text-black">Login to SkillLink</h3>
           <div className="flex w-full flex-grow flex-col justify-center gap-5 align-middle">
             <input
               type="text"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Email"
               required
               className="input-secondary input"
             />
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Password"
               required
               className="input-secondary input"
             />
             <button type="submit" className="btn btn-primary">
               Login
             </button>
             <Link to="/sign-up">
               <p className="text-gray-600">Don't have an account? Sign Up</p>
             </Link>
           </div>
         </form>
       </div>
     </div>
   );
};
export default Login;
