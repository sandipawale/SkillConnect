import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { setCredentials } from '../store/slices/authSlice';
import Loader from '../components/common/Loader';

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      const userInfo = { ...decodedUser, token };
      
      // Step 1: Save the user's credentials to the state
      dispatch(setCredentials(userInfo));

      // --- THIS IS THE GUARANTEED FIX ---
      // Step 2: Always redirect directly to the correct dashboard.
      const isInstructorOrAdmin = userInfo.role === 'instructor' || userInfo.role === 'admin';
      navigate(isInstructorOrAdmin ? '/instructor/dashboard' : '/dashboard', { replace: true });
      // --- END OF GUARANTEED FIX ---
      
    } else {
      // If there's no token, go back to the login page.
      navigate('/login');
    }
  }, [location, navigate, dispatch]);

  // Show a loader while the redirect is happening
  return <div className="flex justify-center items-center h-screen"><Loader /></div>;
};

export default AuthCallbackPage;