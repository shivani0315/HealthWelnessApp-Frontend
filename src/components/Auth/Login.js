// frontend/src/components/Auth/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth from your context

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure login from the AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

      // Extract the token from the response
      const token = response.data.token; 
      localStorage.setItem('token', token); // Store the token

      // Assuming your backend returns user info in response.data.user
      const userInfo = response.data.user; // Get user info (adjust based on your API response)

      // Use the login function to set the user in AuthContext
      login({ token, ...userInfo }); 

      console.log('Login successful, token:', token); // Log the token
      console.log('Redirecting to dashboard...');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.'; // Display more detailed error message
      console.error('Error during login:', errorMessage); // Log detailed error info
      setError(errorMessage); // Set error message
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
