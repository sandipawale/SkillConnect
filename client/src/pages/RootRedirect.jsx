import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/common/Loader';

const RootRedirect = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo === undefined) {
    return <Loader />;
  }

  if (userInfo) {
    const isInstructorOrAdmin = userInfo.role === 'instructor' || userInfo.role === 'admin';
    return <Navigate to={isInstructorOrAdmin ? '/instructor/dashboard' : '/dashboard'} replace />;
  } else {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;