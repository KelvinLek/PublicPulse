import React from 'react';
import Home from './pages/Home';
import ManagementView from './pages/ManagementView';
import './App.css';

function App() {
  return (
    <div className="App" lang="en">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <main id="main-content" tabIndex="-1">
        <Home />
        {/* You can add navigation to ManagementView if needed */}
      </main>
    </div>
  );
}

export default App;