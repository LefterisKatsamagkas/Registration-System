import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/authContext.js';
import { register } from '../Api/userApi.js'; 

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { updateUserContext } = useAuth(); // Use the userInfo

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/event-page';

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const response = await register(name, email, password); // Call your API's register function
        updateUserContext(response);
        toast.success('Your registration was successful!');
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };


    return( 
      <div className='login-register-page'>
        <div className='login-register-card'>
        <FormContainer xs={12} md={10}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold', padding: '30px' }}>Sign Up</h1>
          <form onSubmit={submitHandler}>
            <div className='my-3'>
              <label htmlFor='name'>Name</label>
              <br />
              <input
                type='text'
                id='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div className='my-3'>
              <label htmlFor='confirmPassword'>Confirm password</label>
              <br />
              <input
                type='password'
                id='confirmPassword'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type='submit' className='login-btn'>
              Register
            </button>
          </form>
          <div className='py-3'>
            <div className='redirect-link'>
              Already have an account? <br />
              <Link className='login-register-link' to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                Login
              </Link>
            </div>
          </div>
    </FormContainer>
    </div>
  </div>
)}


export default RegisterPage