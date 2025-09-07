
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import ManagementView from './ManagementView';
import ComplaintForm from '../components/ComplaintForm';
import UserComplaintsTable from '../components/UserComplaintsTable';

const Home = () => {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage
    const saved = localStorage.getItem('sessionUser');
    return saved ? JSON.parse(saved) : null;
  });
  // Helper: check if user is management
  const isManagement = user && user.role === 'management_user';
  // Add state to refresh complaints table after submission
  const [refreshComplaints, setRefreshComplaints] = useState(false);


  // Handle login
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      // Save user/session
  setUser(data.user || data.session?.user || data);
  localStorage.setItem('sessionUser', JSON.stringify(data));
      // If management, redirect
      if ((data.user || data.session?.user || data).role === 'management_user') {
        setActivePage('management');
      } else {
        setActivePage('home');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle register
  const handleRegister = async (name, email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      // Optionally auto-login after register
      setUser(data.user);
      localStorage.setItem('sessionUser', JSON.stringify(data.user));
      setActivePage('home');
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sessionUser');
    setActivePage('home');
  };

  // Navbar buttons
  const navButtons = [
    { label: 'Home', page: 'home', show: true },
    // Only show Management button for management users
    { label: 'Management', page: 'management', show: isManagement },
    { label: 'About', page: 'about', show: true },
    { label: 'Login', page: 'login', show: !user },
    { label: 'Register', page: 'register', show: !user },
    { label: 'Logout', page: 'logout', show: !!user },
  ];

  return (
    <div className="main-content">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">PublicPulse</div>
          <div className="nav-menu" id="nav-menu">
            {navButtons.filter(btn => btn.show).map(btn => (
              <a
                key={btn.label}
                href="#"
                className="nav-link"
                onClick={e => {
                  e.preventDefault();
                  if (btn.page === 'logout') handleLogout();
                  else setActivePage(btn.page);
                }}
              >{btn.label}</a>
            ))}
          </div>
        </div>
      </nav>

      {activePage === 'home' && (
        <section className="hero-section">
          <h1>Welcome to Public Pulse</h1>
          <p>Your platform for community feedback and management.</p>
          {user && (
            <>
              <ComplaintForm userId={user.id} onSubmitted={() => setRefreshComplaints(prev => !prev)} />
              <UserComplaintsTable userId={user.id} refreshKey={refreshComplaints} />
            </>
          )}
        </section>
      )}

      {activePage === 'login' && (
        <Login
          onSwitchToRegister={() => setActivePage('register')}
          onLogin={handleLogin}
        />
      )}

      {activePage === 'register' && (
        <Register
          onSwitchToLogin={() => setActivePage('login')}
          onRegister={handleRegister}
        />
      )}

      {activePage === 'management' && isManagement && (
        <ManagementView />
      )}

      {/* You can add About and other pages as needed */}
    </div>
  );
};

export default Home;
