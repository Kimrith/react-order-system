import React, { useState, useEffect } from 'react';
import { getAllUsers, registerManagement, updateUser, resetPassword, deleteUser } from '../../../auth/api/authService';
import { Users, Plus, Loader2, Edit, KeyRound, Trash2 } from 'lucide-react';

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'Staff'
  });
  
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    fullName: ''
  });

  const [resetPasswordValue, setResetPasswordValue] = useState('');

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const clearMessages = () => {
    setFormError('');
    setFormSuccess('');
  };

  // CREATE USER
  const handleCreateUser = async (e) => {
    e.preventDefault();
    clearMessages();
    setFormLoading(true);

    try {
      await registerManagement(formData);
      setFormSuccess('User successfully created!');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({ username: '', email: '', fullName: '', password: '', role: 'Staff' });
        fetchUsers();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  // EDIT USER
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.userName || user.username || '',
      email: user.email || '',
      fullName: user.fullName || ''
    });
    clearMessages();
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    clearMessages();
    setFormLoading(true);

    try {
      await updateUser(selectedUser.id, editFormData);
      setFormSuccess('User successfully updated!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        fetchUsers();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetClick = (user) => {
    setSelectedUser(user);
    setResetPasswordValue('');
    clearMessages();
    setIsResetModalOpen(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    setFormLoading(true);

    try {
      const response = await resetPassword(selectedUser.id, resetPasswordValue);
      setFormSuccess(response.message || 'Password reset successfully!');
      setTimeout(() => {
        setIsResetModalOpen(false);
      }, 2000);
    } catch (err) {
      setFormError(err.message || 'Failed to reset password');
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE USER
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    clearMessages();
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    clearMessages();
    setFormLoading(true);

    try {
      await deleteUser(selectedUser.id);
      setFormSuccess('User successfully deleted!');
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        fetchUsers();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to delete user');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="text-[#1E65FF]" />
            User Management
          </h1>
          <p className="text-gray-400 mt-2">Manage staff and admin users.</p>
        </div>
        <button
          onClick={() => {
            clearMessages();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E65FF] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Create User
        </button>
      </div>

      <div className="bg-[#1C2536] rounded-xl border border-gray-800/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-[#1E65FF]" size={40} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2A3441] border-b border-gray-800 text-gray-300">
                <th className="p-4 font-semibold">Full Name</th>
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Roles</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-[#2A3441]/50 transition-colors">
                  <td className="p-4 text-white font-medium">{user.fullName || 'N/A'}</td>
                  <td className="p-4 text-white font-medium">{user.userName || user.username}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    {Array.isArray(user.roles) ? (
                      <div className="flex gap-2">
                        {user.roles.map((r, i) => (
                          <span key={i} className="px-2 py-1 bg-[#1E65FF]/20 text-[#1E65FF] text-xs font-semibold rounded-md">
                            {r}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        title="Edit User"
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#1E65FF]/20 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleResetClick(user)}
                        title="Reset Password"
                        className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-400/20 rounded-lg transition-colors"
                      >
                        <KeyRound size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        title="Delete User"
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1C2536] p-8 rounded-2xl w-full max-w-md border border-gray-800/50 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Create New User</h2>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              {formError && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">{formError}</div>}
              {formSuccess && <div className="p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm">{formSuccess}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleCreateInputChange}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1E65FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleCreateInputChange}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1E65FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleCreateInputChange}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1E65FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleCreateInputChange}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1E65FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleCreateInputChange}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1E65FF] focus:outline-none"
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-[#1E65FF] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex justify-center items-center"
                >
                  {formLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1C2536] p-8 rounded-2xl w-full max-w-md border border-gray-800/50 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Edit User Profile</h2>
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
              {formError && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">{formError}</div>}
              {formSuccess && <div className="p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm">{formSuccess}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={editFormData.fullName}
                  onChange={handleEditInputChange}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1E65FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  value={editFormData.username}
                  onChange={handleEditInputChange}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1E65FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1E65FF] focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-[#1E65FF] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex justify-center items-center"
                >
                  {formLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1C2536] p-8 rounded-2xl w-full max-w-md border border-gray-800/50 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-sm text-gray-400 mb-6">Enter a new secure password for <span className="text-white font-semibold">{selectedUser.userName || selectedUser.username}</span>.</p>
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              {formError && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">{formError}</div>}
              {formSuccess && <div className="p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm">{formSuccess}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={resetPasswordValue}
                  onChange={(e) => setResetPasswordValue(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex justify-center items-center"
                >
                  {formLoading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1C2536] p-8 rounded-2xl w-full max-w-md border border-gray-800/50 shadow-2xl">
            <div className="flex justify-center mb-6 text-red-500">
              <Trash2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">Delete User?</h2>
            <p className="text-center text-gray-400 mb-6">
              Are you sure you want to permanently delete the account <span className="text-white font-semibold">{selectedUser.userName || selectedUser.username}</span>? This action cannot be undone.
            </p>
            
            {formError && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">{formError}</div>}
            {formSuccess && <div className="p-3 mb-4 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm">{formSuccess}</div>}

            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={formLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex justify-center items-center"
              >
                {formLoading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
