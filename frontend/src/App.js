// src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Navbar from './components/Navbar';
import AdminMenuBar from './components/admin/Admin';
import UserRoute from './ProtectRoute/userRoute';
import PublicRoute from './ProtectRoute/publicRoute';
import AdminRoute from './ProtectRoute/adminRoute';
import Footer from './components/Footer';




function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute> <Login/> </PublicRoute> } />
      <Route path="/Register" element={<PublicRoute> <Register/> </PublicRoute> } />
      <Route path="/admin" element={ <AdminRoute> <AdminMenuBar /> </AdminRoute>} />
      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <Navbar />
            <Dashboard />
            <Footer />
          </UserRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;


