import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../misc/OrderApi';
import { handleLogError } from '../misc/Helpers';
import M from 'materialize-css';

function Signup() {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    mobileNumber: '',
  });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, name, email, mobileNumber } = formData;
    if (!(username && password && name && email && mobileNumber)) {
      setIsError(true);
      setErrorMessage('Please fill out all fields!');
      M.toast({ html: 'All fields are required!', classes: 'red' });
      return;
    }

    try {
      const response = await orderApi.signup(formData);
      const { id, name,accessToken} = response.data;
      const role =response.data.roles[0];
      const authenticatedUser = { id, name, role, accessToken };
      Auth.userLogin(authenticatedUser);
      setIsError(false);
      setErrorMessage('');
      M.toast({ html: 'Sign up successful! Redirecting...', classes: 'green' });

      // Navigate to login after a slight delay
      setTimeout(() => setIsSignedUp(true), 1000);
    } catch (error) {
      handleLogError(error);
      let errorMsg = 'Something went wrong. Please try again.';
      if (error.response?.data) {
        const { message, errors, status } = error.response.data;
        if (status === 409) {
          errorMsg = message;
        } else if (errors?.length > 0) {
          errorMsg = errors[0].defaultMessage;
        }
      }
      setIsError(true);
      setErrorMessage(errorMsg);
      M.toast({ html: errorMsg, classes: 'red' });
    }
  };

  if (isLoggedIn) return <Navigate to="/" />;
  if (isSignedUp) return <Navigate to="/login" />;

  return (
    <div className="container">
      <div className="row">
        <div className="col s12 m8 l6 offset-m2 offset-l3">
          <form
            onSubmit={handleSubmit}
            className="card-panel z-depth-3"
            style={{ padding: '30px' }}
          >
            <h4 className="center-align blue-text">Create Account</h4>

            <div className="input-field">
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="username">Username</label>
            </div>

            <div className="input-field">
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="input-field">
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="name">Full Name</label>
            </div>

            <div className="input-field">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="input-field">
              <input
                id="mobileNumber"
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="mobileNumber">Mobile Number</label>
            </div>

            <button
              type="submit"
              className="btn-large blue accent-3 waves-effect waves-light"
              style={{ width: '100%' }}
            >
              Sign Up
            </button>

            <p className="center-align" style={{ marginTop: '20px' }}>
              Already have an account?{' '}
              <NavLink to="/login" className="blue-text text-darken-2">
                Login here
              </NavLink>
            </p>

            {isError && (
              <p className="center-align red-text" style={{ marginTop: '10px' }}>
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
