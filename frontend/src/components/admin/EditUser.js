import React, { useState } from 'react';
import axios from 'axios';

// Validation utility functions
const validateField = (name, value) => {
  const errors = [];

  switch (name) {
    case 'username':
      if (!value.trim()) errors.push('Username is required');
      if (value.includes(' ')) errors.push('Spaces are not allowed');
      if (value.length < 3) errors.push('Username must be at least 3 characters long');
      break;

    case 'email':
      if (!value.trim()) errors.push('Email is required');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.push('Invalid email format');
      if (!value.toLowerCase().includes('.com')) errors.push('Email must contain .com');
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

const EditUser = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone_number: user.phone_number,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent spaces in username field
    const newValue = name === 'username' ? value.replace(/\s/g, '') : value;
    
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

    // Clear API error when user starts typing
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `http://localhost:8000/api/users/admin_user/${user.id}/update/`, 
        formData, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdate(user.id, formData);
      onClose();
    } catch (err) {
      console.error(err);
      setApiError(
        err.response?.data?.message || 
        'An error occurred while updating the user. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
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
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {apiError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {apiError}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    formErrors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {renderError('username')}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {renderError('email')}
              </div>
              <div className="mb-4">
                <label htmlFor="phone_number" className="block text-gray-700 font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    formErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {renderError('phone_number')}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;