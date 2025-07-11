import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../services/userService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const UserEditPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  const { data: user, isLoading, error, refetch } = useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, role }).unwrap();
      toast.success('User updated successfully');
      refetch(); // Refetch user data to ensure UI is up to date if needed elsewhere
      navigate('/admin/users');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto">
      <Link to="/admin/users" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
        ← Back to Users
      </Link>
      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Edit User</h1>
          {isLoading || isLoadingUpdate ? <Loader /> : error ? (
            <Message variant="danger">{error?.data?.message || error.error}</Message>
          ) : (
            <form onSubmit={submitHandler}>
              {/* --- THIS IS THE GUARANTEED FIX --- */}
              <div className="mb-4">
                <label htmlFor="user-name-edit" className="block text-gray-700 font-bold mb-2">Name</label>
                <input type="text" id="user-name-edit" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="user-email-edit" className="block text-gray-700 font-bold mb-2">Email Address</label>
                <input type="email" id="user-email-edit" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-6">
                <label htmlFor="user-role-edit" className="block text-gray-700 font-bold mb-2">Role</label>
                <select id="user-role-edit" name="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded bg-white">
                  <option value="user">User</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {/* --- END OF FIX --- */}
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                Update
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;