import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [redirect, setRedirect] = useState(false);

  // --- THIS IS THE DEFINITIVE FIX ---
  // We use a useEffect hook to manage the redirect side-effect.
  useEffect(() => {
    // This effect runs only if the user is logged in but is NOT an admin.
    if (userInfo && userInfo.role !== 'admin') {
      // First, show the error toast message.
      toast.error('Not authorized. Admin access only.');
      // Then, set a state to trigger the redirect on the next render.
      setRedirect(true);
    }
  }, [userInfo]); // The effect depends on userInfo.
  // --- END OF DEFINITIVE FIX ---

  // If redirect state is true, navigate away.
  if (redirect) {
    return <Navigate to="/" replace />;
  }

  // If userInfo exists and the role is 'admin', render the nested admin pages.
  // Otherwise (e.g., still loading userInfo), render nothing to prevent a flash of content.
  return userInfo && userInfo.role === 'admin' ? <Outlet /> : null;
};

export default AdminRoute;