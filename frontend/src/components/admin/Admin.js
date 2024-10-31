import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import AdminUsers from './AdminUsers';
import CreateUser from './CreateUser';
import { Search } from 'lucide-react'; 
 

const AdminMenuBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
   //modal configurations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefreshUsers, setShouldRefreshUsers] = useState(false);
  //Search configuration
  const [searchTerm, setSearchTerm] = useState();



  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  
  };

  const handleUserCreated = () => {
    setShouldRefreshUsers(prev => !prev); // Toggle to trigger useEffect in AdminUsers
    setIsModalOpen(false);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-teal-50 to-teal-100">
      {/* Sidebar */}
      <div className="w-72 bg-teal-700 text-white flex flex-col z-10">
        <div className="py-6 text-center font-bold text-3xl border-b border-teal-500">Admin Panel</div>
        <nav className="mt-10 flex-grow">
          <ul>
            <li className="px-6 py-4 text-lg hover:bg-red-500 cursor-pointer transition">
              <a href="/dashboard" className="block">Dashboard</a>
            </li>

            <li onClick={()=>setIsModalOpen(!isModalOpen)} className="px-6 py-4 text-lg hover:bg-red-500 cursor-pointer transition">
              <p className="block">Create User</p>
            </li>

            <li className="px-6 py-4 text-lg hover:bg-red-500 cursor-pointer transition">
              <p onClick={handleLogout} className="block">Logout</p>
            </li>
          </ul>
        </nav>
        <div className="text-center py-6 text-sm border-t border-teal-500">
          Welcome, {user.username}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-teal-600 p-6 -m-8 mb-8">

          <h1 className="text-center text-4xl font-bold text-white mb-8 bg-teal-600 p-6 -m-8">User List</h1>
          {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </div>

      <AdminUsers refreshTrigger={shouldRefreshUsers} searchTerm={searchTerm} />
        
      </div>
      {isModalOpen && <CreateUser setIsModalOpen={setIsModalOpen} onUserCreated={handleUserCreated} />}
      
    </div>
    
  )
};

export default AdminMenuBar;
