import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import M from 'materialize-css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { getUser, userIsAuthenticated, userLogout } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication and initialize sidenav
    const checkAuthentication = async () => {
      const isAuthenticated = await userIsAuthenticated();
      setAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const userData = await getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    checkAuthentication();

    const sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);

    // Cleanup
    return () => {
      sidenav.forEach(instance => instance?.M_Sidenav?.destroy());
    };
  }, [getUser, userIsAuthenticated]);

  const handleLoginLogout = () => {
    if (authenticated) {
      userLogout(); // Logout the user
       M.toast({ html: 'Logout successful!', classes: 'green' });
    } else {
      window.location.href = '/login'; // Redirect to login page
    }
  };

  const username = authenticated && user ? user.name : 'Guest';
  const logInOutText = authenticated ? 'Logout' : 'Login';
  const linkVisibility = authenticated && user.role==='ADMIN' ? { "display": "block" } : { "display": "none" }

  return (
    <div>
      <div className="navbar-fixed">
        <nav className="light-blue darken-4">
          <div className="nav-wrapper container">
            <Link to="/" className="brand-logo">Echo Portal</Link>
            <a href="/" data-target="mobile-menu" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul id="nav" className="right hide-on-med-and-down">
              <li>Hi {username}</li>
              <li><NavLink exact to="/">Home</NavLink></li>
              <li><NavLink exact to="/customer">Service</NavLink></li>
              <li><NavLink exact to="/staff" style={linkVisibility}>Staff</NavLink></li>
              <li><NavLink exact to="/admin" style={linkVisibility}>Admin</NavLink></li>
              <li>
                <Link to="#" onClick={handleLoginLogout}>
                  {logInOutText}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <ul id="mobile-menu" className="sidenav">
        <li><Link to="/" className="sidenav-close">Home</Link></li>
        <li><Link to="/customer" className="sidenav-close">Service</Link></li>
        <li><Link to="/staff" className="sidenav-close">Staff</Link></li>
        <li><Link to="/admin" className="sidenav-close">Admin</Link></li>
        <li>
          <Link to="#" onClick={handleLoginLogout}>
            {logInOutText}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
