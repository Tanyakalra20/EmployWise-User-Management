import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
      
        try {
          const response = await loginUser(email, password);
          if (response.token) {
            localStorage.setItem("token", response.token); // Store token
            toast.success("Login Successful!");
            setTimeout(() => navigate("/dashboard"), 2000);
          } else {
            toast.error("Invalid credentials");
          }
        } catch (err) {
          toast.error("Login failed. Please try again.");
        }
      };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={submitHandler}>
      <div className="mb-4">
      <label className="block mb-1">Email</label>
      <input
       type='email'
       value={email}
       className="w-full px-3 py-2 border rounded"
       onChange={(e) => setEmail(e.target.value)}
       required
      />
      </div>
      <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Login
          </button>
      </form>
      </div>
    </div>
  )
}

export default Login
