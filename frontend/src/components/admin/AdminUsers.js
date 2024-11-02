import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUser from './EditUser';
import { Pencil, Trash2, UserRoundPen } from 'lucide-react';


const AdminUsers = ({refreshTrigger, searchTerm}) => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    //fetching the user
    const fetchUsers = async () => {
        try{
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8000/api/users/admin_user/', {
        headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchUsers();
    },[refreshTrigger]);

     // Filter users based on search term
     const filteredUsers = users.filter(user => {
        if (!searchTerm) return true; // If no search term, return all users
        
        const searchLower = searchTerm.toLowerCase();
        
        // Safely check each field with null/undefined handling
        const usernameMatch = user.username?.toLowerCase().includes(searchLower) || false;
        const emailMatch = user.email?.toLowerCase().includes(searchLower) || false;
        const phoneMatch = user.phone_number ? user.phone_number.toString().includes(searchLower) : false;
        
        return usernameMatch || emailMatch || phoneMatch;
      });
    
    console.log(users)

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const handleUpdateUser = (userId, updatedData) =>{
        console.log('handleUpdateUser called');
        console.log('userId:', userId);
        console.log('updatedData:', updatedData);
        setUsers(
            users.map((user)=>
                user.id === userId ? {...user, username:updatedData.username, email: updatedData.email, phone_number: updatedData.phone_number } : user
            )
        );
    }




    // Delete handlers
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/users/admin_user/${userToDelete.id}/delete/`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Remove user from state
        setUsers(users.filter(user => user.id !== userToDelete.id));
        setDeleteSuccess(true);
        
        // Reset states
        setShowDeleteDialog(false);
        setUserToDelete(null);
        setDeleteError(null);

        // Clear success message after 3 seconds
        setTimeout(() => {
            setDeleteSuccess(false);
        }, 3000);

        } catch (err) {
        setDeleteError(err.response?.data?.message || 'Failed to delete user. Please try again.');
        setShowDeleteDialog(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setUserToDelete(null);
        setDeleteError(null);
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }


  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Success Message */}
        {deleteSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <div className="ml-3">
                <p className="text-sm text-green-700">User successfully deleted</p>
                </div>
            </div>
            </div>
        )}

        {/* Error Message */}
        {deleteError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                </div>
                <div className="ml-3">
                <p className="text-sm text-red-700">{deleteError}</p>
                </div>
            </div>
            </div>
        )}



        <table className="w-full text-left border-collapse">
        <thead>
            <tr className="bg-teal-700 text-white uppercase text-sm leading-normal">
            <th className="py-4 px-6">ID</th>
            <th className="py-4 px-6">Username</th>
            <th className="py-4 px-6">Email</th>
            <th className="py-4 px-6">FullName</th>
            <th className="py-4 px-6">Phone</th>
            <th className="py-4 px-6">Actions</th>
            </tr>
        </thead>
        <tbody>
            {filteredUsers.map((user,key) =>(
                
            
            <tr  className="bg-teal-50 hover:bg-teal-100 border-b border-gray-200">
            <td className="py-4 px-6">{key+1}</td>
            <td className="py-4 px-6">{user.username}</td>
            <td className="py-4 px-6">{user.email}</td>
            <td className="py-4 px-6">{user.first_name} {user.last_name}</td>
            <td className="py-4 px-6">{user.phone_number}</td>

            {user.is_superuser?<td></td>:

                <td className="py-4 px-6">
                    <button className="text-teal-700 font-semibold hover:text-teal-900 mr-7" onClick={()=> handleEdit(user)}><UserRoundPen size={25} /></button>
                    <button className="text-red-500 font-semibold hover:text-red-700" onClick={()=> handleDeleteClick(user)}><Trash2 size={25} /></button>
                </td>
            }
            </tr>

            ))}
            
        </tbody>
        </table>

        {showEditModal && selectedUser && (
        <EditUser user={selectedUser} onClose={handleCloseModal} onUpdate={handleUpdateUser} />
        )}


         {/* Delete Confirmation Modal */}
        {showDeleteDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                Are you sure?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                This will permanently delete the user "{userToDelete?.username}". This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                    Delete
                </button>
                </div>
            </div>
            </div>
        )}


    </div>
  )
};

export default AdminUsers;

