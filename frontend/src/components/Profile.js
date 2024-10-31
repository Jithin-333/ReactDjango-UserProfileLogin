import React, { useState,useEffect } from 'react';
import { Upload } from 'lucide-react';
import { authService } from '../services/api';


const Profile = () => {

  const [user,setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


   // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getUserProfile();
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);


  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    if (file) {
      setError(null);
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    if (!profilePicture) {
      setError('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    try {
      const response = await authService.uploadProfileImage(profilePicture);

      // Update local user state with new profile image
      setUser(response.data);

      // Clear the preview URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      setProfilePicture(null);
      setError(null);

    } catch (err) {
      setError('Failed to update profile picture. Please try again.');
      console.log(err)
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 flex justify-center items-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }
  if (error && !user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
          {error}
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 rounded-md p-4">
          No user data available. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-3">
      <div className="bg-orange-100 shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-1 justify-center">
          <div className="relative w-24 h-24">
            <img
              src={previewUrl || user.profile_image || '/api/placeholder/96/96'}
              alt="Profile img"
              className="w-full h-full rounded-full object-cover border-2 border-gray-300"
            />
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-300"
            >
              <Upload className="w-5 h-5 text-gray-600" />
            </label>
          </div>
            
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
          
          {previewUrl && (
            <button
              onClick={handleUpdateProfile}
              disabled={isUploading}
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

    </div>

  );
};

export default Profile;