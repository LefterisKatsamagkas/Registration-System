import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom'; // Import Navigate
import FormContainer from '../components/FormContainer';
import { toast } from 'react-hot-toast';
import { login } from '../Api/userApi.js';
import { useAuth } from '../context/authContext.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userInfo, updateUserContext } = useAuth(); // Use the userInfo

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/event-page';

  // If user is already logged in, redirect to the desired destination
  if (userInfo) {
    return <Navigate to="/" replace />;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      updateUserContext(response); // Update user info in context and localStorage
      toast.success('You logged in successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Wrong email or password');
    }
  };

  return (
    <div className='login-register-page'>
      <div className='login-register-card'>
      <FormContainer xs={12} md={10}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', padding: '30px' }}>Sign In</h1>
        <form onSubmit={submitHandler}>
          <div className='my-3'>
            <label htmlFor='email'>Email Address</label>
            <br />
            <input
              type='email'
              id='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='my-3'>
            <label htmlFor='password'>Password</label>
            <br />
            <input
              type='password'
              id='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type='submit' className='login-btn'>
            Sign In
          </button>
        </form>
        <div className='py-3'>
          <div className='redirect-link'>
            New User? <br/>
            <Link className='login-register-link' to={redirect ? `/register?redirect=${redirect}` : '/register'}>
              Register
            </Link>
          </div>
        </div>
      </FormContainer>
    </div>
    </div>
  );
}

export default LoginPage;