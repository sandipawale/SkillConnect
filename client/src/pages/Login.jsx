import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../services/authService';
import { setCredentials } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Show error toast from Google redirect
    const error = searchParams.get('error');
    if (error) {
      toast.error(error);
    }
  }, [searchParams]);

  useEffect(() => {
    if (userInfo) {
      const isInstructorOrAdmin = userInfo.role === 'instructor' || userInfo.role === 'admin';
      navigate(isInstructorOrAdmin ? '/instructor/dashboard' : '/dashboard');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      const isInstructorOrAdmin = res.role === 'instructor' || res.role === 'admin';
      navigate(isInstructorOrAdmin ? '/instructor/dashboard' : '/dashboard');
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // --- THIS IS THE FIX ---
  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/google/login`;
  };
  // --- END OF FIX ---

  return (
    <div className="w-full max-w-sm md:max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 hidden md:flex items-center justify-center bg-primary-light rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
        <img src="/auth-illustration.png" alt="Learning Illustration" className="max-w-full h-auto" />
      </div>
      <div className="w-full md:w-1/2 p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center md:text-left">Sign in</h2>
        <form onSubmit={submitHandler} className="space-y-5">
          <div><label htmlFor="email" className="text-sm font-medium text-gray-700">Your Email</label><input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-dark focus:border-primary-dark" /></div>
          <div><label htmlFor="password"  className="text-sm font-medium text-gray-700">Password</label><input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-dark focus:border-primary-dark" /></div>
          <div><button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-primary-light text-white font-semibold rounded-md shadow-md hover:bg-opacity-90 disabled:bg-opacity-70">{isLoading ? 'Signing In...' : 'Log In'}</button></div>
        </form>
        <div className="mt-6 text-center"><p className="text-sm">Don't have an account? <Link to="/register" className="font-medium text-primary-light hover:underline">Create an account</Link></p></div>
        <div className="mt-6 relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div><div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or login with</span></div></div>
        <div className="mt-6">
          <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <svg className="w-5 h-5 mr-2 -ml-1" viewBox="0 0 48 48"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h13.07c-.6 5.33-4.66 9.2-9.67 9.2-5.73 0-10.37-4.66-10.37-10.37s4.64-10.37 10.37-10.37c3.1 0 5.76 1.17 7.76 3.1l6.4-6.4C39.2 6.13 32.5 3 24 3 11.43 3 1.62 11.12 1.62 24.1c0 12.76 9.4 23.33 22.38 23.33 12.4,0 23-9.9,23-22.88z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;