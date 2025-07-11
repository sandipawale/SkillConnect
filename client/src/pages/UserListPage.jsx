import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGetUsersQuery, useDeleteUserMutation } from '../services/userService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

// A reusable component for rendering a table for a specific role
const UserTable = ({ title, users, deleteHandler, isLoadingDelete }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-4 text-gray-700">{title}</h2>
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{user._id}</td>
              <td className="py-3 px-6 text-left">{user.name}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <Link to={`/admin/user/${user._id}/edit`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                  </Link>
                  <button onClick={() => deleteHandler(user._id)} disabled={isLoadingDelete || user.role === 'admin'} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UserListPage = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // --- THIS IS THE NEW LOGIC ---
  // Filter users into separate arrays based on their role
  const admins = users?.filter(user => user.role === 'admin') || [];
  const instructors = users?.filter(user => user.role === 'instructor') || [];
  const students = users?.filter(user => user.role === 'user') || [];
  // --- END OF NEW LOGIC ---

  return (
    <div className="container mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        {isLoading ? <Loader /> : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <div>
            {/* Render a separate table for each role */}
            <UserTable title="Administrators" users={admins} deleteHandler={deleteHandler} isLoadingDelete={isLoadingDelete} />
            <UserTable title="Instructors" users={instructors} deleteHandler={deleteHandler} isLoadingDelete={isLoadingDelete} />
            <UserTable title="Students" users={students} deleteHandler={deleteHandler} isLoadingDelete={isLoadingDelete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;