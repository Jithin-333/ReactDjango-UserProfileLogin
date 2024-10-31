import React  from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';


//protected route for admin user
const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user){
    return <Navigate to = '/login' />;
  }
  if (!user.is_superuser){
    return <Navigate to = '/dashboard' />
  }
  return children
 };

export default AdminRoute;
