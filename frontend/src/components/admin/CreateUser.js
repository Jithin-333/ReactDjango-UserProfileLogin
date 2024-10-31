import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerStart, registerSuccess, registerFailure } from '../../features/auth/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const CreateUser = ({setIsModalOpen, onUserCreated}) => {
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
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
      });
      onUserCreated();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Create your account
          </h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {typeof error === 'object'
                ? Object.entries(error).map(([key, value]) => (
                    <div key={key}>{`${key}: ${value}`}</div>
                  ))
                : error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="First Name"
              />
              {renderError('first_name')}
            </div>
            <div>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Last Name"
              />
              {renderError('last_name')}
            </div>
          </div>
          <div>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Username"
            />
            {renderError('username')}
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email"
            />
            {renderError('email')}
          </div>
          <div>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Phone Number"
            />
            {renderError('phone_number')}
          </div>
          <div>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Address"
            />
            {renderError('address')}
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
            />
            {renderError('password')}
          </div>
          <div>
            <input
              id="password2"
              name="password2"
              type="password"
              required
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm Password"
            />
            {renderError('password2')}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;