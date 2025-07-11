import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useUpdateProfileMutation } from '../services/userService';
import { useLogoutMutation } from '../services/authService';
import { setCredentials, logout } from '../store/slices/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const updateData = { _id: userInfo._id, name, email };
      if (password) {
        updateData.password = password;
      }

      const res = await updateProfile(updateData).unwrap();
      
      // If a password was newly set, force a re-login for security
      if (password) {
        toast.success('Password updated! Please log in again to continue.');
        await logoutApiCall().unwrap();
        dispatch(logout());
        navigate('/login');
      } else {
        // Otherwise, just update the local state
        dispatch(setCredentials({ ...userInfo, ...res }));
        toast.success('Profile updated successfully!');
      }

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
              <input type="text" id="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
              <input type="email" id="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
              <label htmlFor="new-password" className="block text-gray-700 font-bold mb-2">New Password</label>
              <input type="password" id="new-password" name="new-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Leave blank to keep the same" />
            </div>
            <div className="mb-6">
              <label htmlFor="confirm-new-password" className="block text-gray-700 font-bold mb-2">Confirm New Password</label>
              <input type="password" id="confirm-new-password" name="confirm-new-password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <button type="submit" disabled={isUpdating} className="w-full bg-primary-light text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 disabled:bg-opacity-70">
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;