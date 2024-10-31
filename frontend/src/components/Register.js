import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerStart, registerSuccess, registerFailure } from '../features/auth/authSlice';
import axios from 'axios';
import neontropicallogin from '../components/images/neontropicallogin.jpg';

// Validation utility functions
const validateField = (name, value) => {
  const errors = [];

  switch (name) {
    case 'username':
      if (!value.trim()) errors.push('Username is required');
      if (value.includes(' ')) errors.push('Spaces are not allowed');
      if (value.length < 3) errors.push('Username must be at least 3 characters long');
      break;

    case 'first_name':
    case 'last_name':
      if (!value.trim()) errors.push(`${name.replace('_', ' ')} is required`);
      if (!/^[A-Za-z]+$/.test(value)) errors.push('Only letters are allowed');
      break;

    case 'email':
      if (!value.trim()) errors.push('Email is required');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.push('Invalid email format');
      if (!value.toLowerCase().includes('.com')) errors.push('Email must contain .com');
      break;

    case 'password':
      if (!value) errors.push('Password is required');
      if (value.length < 8) errors.push('Password must be at least 8 characters');
      if (!/(?=.*[a-z])/.test(value)) errors.push('Password must contain at least one lowercase letter');
      if (!/(?=.*[A-Z])/.test(value)) errors.push('Password must contain at least one uppercase letter');
      if (!/(?=.*\d)/.test(value)) errors.push('Password must contain at least one number');
      if (!/(?=.*[@$!%*?&])/.test(value)) errors.push('Password must contain at least one special character');
      break;

    case 'password2':
      if (!value) errors.push('Please confirm your password');
      break;

    case 'phone_number':
      if (value && !/^\d{10}$/.test(value)) errors.push('Phone number must be exactly 10 digits');
      if (value && /[^0-9]/.test(value)) errors.push('Only numbers are allowed');
      break;

    default:
      break;
  }

  return errors;
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const { isLoading, error, registrationSuccess } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    });

    // Special case for password confirmation
    if (formData.password !== formData.password2) {
      errors.password2 = ['Passwords do not match'];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent spaces in all fields except address
    const newValue = name !== 'address' ? value.replace(/\s/g, '') : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time validation
    const fieldErrors = validateField(name, newValue);
    setFormErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(registerStart());

    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/register/',
        formData
      );

      dispatch(registerSuccess());
      navigate('/login');
    } catch (error) {
      dispatch(
        registerFailure(
          error.response?.data || 'Registration failed. Please try again.'
        )
      );
    }
  };

  const renderError = (fieldName) => {
    if (formErrors[fieldName] && formErrors[fieldName].length > 0) {
      return (
        <div className="text-red-500 text-xs mt-1">
          {formErrors[fieldName].map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      backgroundImage: `url(${neontropicallogin})`, backgroundSize: 'cover',  backgroundPosition: 'center', backgroundRepeat: 'no-repeat', 
    }} className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 shadow p-8 bg-orange-300 bg-opacity-25 rounded-lg">
        <div>
          <h2 className="text-orange-500 mt-6 text-center text-3xl font-extrabold">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {typeof error === 'object' 
                ? Object.entries(error).map(([key, value]) => (
                    <div key={key}>{`${key}: ${value}`}</div>
                  ))
                : error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="grid grid-cols-2 gap-1 my-2">
              <div>
                <label htmlFor="first_name" className="sr-only">First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
                />
                {renderError('first_name')}
              </div>
              <div>
                <label htmlFor="last_name" className="sr-only">Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
                />
                {renderError('last_name')}
              </div>
            </div>
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm my-2"
                placeholder="Username"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
              />
              {renderError('username')}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm my-2"
                placeholder="Email"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
              />
              {renderError('email')}
            </div>
            <div>
              <label htmlFor="phone_number" className="sr-only">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm my-2"
                placeholder="Phone Number"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
              />
              {renderError('phone_number')}
            </div>
            <div>
              <label htmlFor="address" className="sr-only">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm my-2"
                placeholder="Address"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
              />
              {renderError('address')}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm my-2"
                placeholder="Password"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
              />
              {renderError('password')}
            </div>
            <div>
              <label htmlFor="password2" className="sr-only">Confirm Password</label>
              <input
                id="password2"
                name="password2"
                type="password"
                required
                value={formData.password2}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm my-2"
                placeholder="Confirm Password"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} 
              />
              {renderError('password2')}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <div>
          <p className='text-center font-bold text-orange-100'>Already a User? <Link to={"/login"} className='font-bold text-blue-300 hover:text-red-500'>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;