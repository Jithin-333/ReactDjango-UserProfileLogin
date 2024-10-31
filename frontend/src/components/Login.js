import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import axios from 'axios';
import neontropicallogin from '../components/images/neontropicallogin.jpg'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Get user data
      const userResponse = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      dispatch(loginSuccess({
        user: userResponse.data,
        token: access,
      }));

      
      //navigate if the user is superuser
      
      if (userResponse.data.is_superuser){
        navigate('/admin')
      }else{
        navigate('/dashboard');
      }

    } catch (error) {
      dispatch(loginFailure(
        error.response?.data?.detail || 'Login failed. Please try again.'
      ));
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${neontropicallogin})`, backgroundSize: 'cover',  backgroundPosition: 'center', backgroundRepeat: 'no-repeat', 
    }} className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-orange-300 bg-opacity-25 rounded-lg shadow">
        <div className='mb-14'>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-orange-500">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 mb-10 py-2 border border-gray-300 placeholder-white text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}  // Adjust the opacity here
                placeholder="Username"
              />

            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 mb-20 py-2 border border-gray-300 placeholder-white text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className='text-center'> 
          <p className='font-bold text-orange-100'>New user?    <Link to={'/register'} className='font-bold text-blue-300 hover:text-red-500 '>Register here.</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
