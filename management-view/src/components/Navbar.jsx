import React from 'react';

const Navbar = ({ onLogout, onTabChange, activeTab }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <span className="nav-logo">Public Pulse - Management Dashboard</span>
        <ul>
          <li>
            <a
              href="#map"
              className={activeTab === 'map' ? 'active' : ''}
              onClick={e => {
                e.preventDefault();
                onTabChange && onTabChange('map');
              }}
            >Map View</a>
          </li>
          <li>
            <a
              href="#all-complaints"
              className={activeTab === 'all-complaints' ? 'active' : ''}
              onClick={e => {
                e.preventDefault();
                onTabChange && onTabChange('all-complaints');
              }}
            >All Complaints</a>
          </li>
          {onLogout && (
            <li>
              <a href="#logout" onClick={e => { e.preventDefault(); onLogout(); }}>Logout</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;