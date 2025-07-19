import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const InstructorRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  if (userInfo && (userInfo.role === 'instructor' || userInfo.role === 'admin')) {
    return <Outlet />;
  } else if (userInfo) {
    toast.error('You are not authorized to access this page.');
    return <Navigate to="/" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default InstructorRoute;