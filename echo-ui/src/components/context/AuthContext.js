import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };

  const userIsAuthenticated = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return false;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const payload = JSON.parse(atob(parsedUser?.accessToken.split('.')[1])); 

      // Validate exp field
      if (!payload?.exp || typeof payload.exp !== 'number') {
          userLogout();
        return false;
      }

       

      // Check if token is expired
      if (Date.now() > payload.exp * 1000) {
        userLogout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      userLogout();
      return false;
    }
  };

  const userLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const userLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const contextValue = {
    user,
    getUser,
    userIsAuthenticated,
    userLogin,
    userLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider };
