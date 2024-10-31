import React from 'react';
import { useSelector } from 'react-redux';


const ProfileDetail = () => {
    const { user } = useSelector((state) => state.auth);


  return (
    <div className=" flex items-center justify-center mb-3 ">
      <div className="max-w-4xl w-full bg-orange-100 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">{user.first_name} {user.last_name}</h2>
          <p className="text-gray-500">Welcome to your profile dashboard</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="mt-4 border-t border-blue-300 pt-6 px-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-blue-500 font-bold text-md mb-1">First Name:</label>
                <input
                  type="text"
                  value={user.first_name}
                  readOnly
                  className="bg-orange-200 text-blue-900 font-semibold px-3 py-1 rounded-md shadow-md focus:outline-none pointer-events-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-blue-500 font-bold text-md mb-1">Last Name:</label>
                <input
                  type="text"
                  value={user.last_name}
                  readOnly
                  className="bg-orange-200 text-blue-900 font-semibold px-3 py-1 rounded-md shadow-md focus:outline-none pointer-events-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-blue-500 font-bold text-md mb-1">Email:</label>
                <input
                  type="text"
                  value={user.email}
                  readOnly
                  className="bg-orange-200 text-blue-900 font-semibold px-3 py-1 rounded-md shadow-md focus:outline-none pointer-events-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-blue-500 font-bold text-md mb-1">Address:</label>
                <input
                  type="text"
                  value={user.address}
                  readOnly
                  className="bg-orange-200 text-blue-900 font-semibold px-3 py-1 rounded-md shadow-md focus:outline-none pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-blue-500 font-bold text-md mb-1">Phone Number:</label>
              <input
                type="text"
                value={user.phone_number}
                readOnly
                className="bg-orange-200 text-blue-900 font-semibold px-3 py-1 rounded-md shadow-md focus:outline-none pointer-events-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileDetail;
