import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../misc/OrderApi';
import { handleLogError } from '../misc/Helpers';
import M from 'materialize-css';

function Login() {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(username && password)) {
      setIsError(true);
      return;
    }

    try {
      const response = await orderApi.authenticate(username, password);
      const { id, name,accessToken} = response.data;
      const role =response.data.roles[0];
     // const authdata = window.btoa(`${username}:${password}`);
      const authenticatedUser = { id, name, role, accessToken };
     M.toast({ html: 'Login successful!', classes: 'green' });
      Auth.userLogin(authenticatedUser);

      setUsername('');
      setPassword('');
      setIsError(false);
    } catch (error) {
      handleLogError(error);
      setIsError(true);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Login</h2>
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
        <p style={styles.message}>
          Don't have an account? <NavLink to="/signup" style={styles.link}>Sign Up</NavLink>
        </p>
        {isError && (
          <p style={styles.errorMessage}>The username or password provided are incorrect!</p>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    backgroundColor: '#f9f9f9',
  },
  form: {
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  errorMessage: {
    marginTop: '15px',
    color: '#ff4d4d',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default Login;
