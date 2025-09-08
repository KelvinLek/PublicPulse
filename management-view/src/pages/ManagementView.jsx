import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MapComponent from '../components/Map';
import ComplaintsTable from '../components/ComplaintsTable';
import AllComplaintsPage from './AllComplaintsPage';
import { LoadScript, useJsApiLoader } from '@react-google-maps/api';

const ManagementView = ({ onLogout }) => {
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('map');


  // Fetch clusters from backend
  const [clusters, setClusters] = useState([]);
  useEffect(() => {
    async function fetchClusters() {
      try {
  const res = await fetch('http://localhost:3001/api/clusters');
        const data = await res.json();
        setClusters(data.clusters || []);
      } catch (e) {
        console.error('Failed to fetch clusters:', e);
        setClusters([]);
      }
    }
    fetchClusters();
  }, []);


  // Fetch complaint details by ID from backend
  const handleClusterClick = async (complaints) => {
    if (!complaints || complaints.length === 0) return setSelectedComplaints([]);
    try {
      // complaints is array of {id}
      const ids = complaints.map(c => c.id);
      const res = await fetch('http://localhost:3001/api/complaints/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      setSelectedComplaints(data.complaints || []);
    } catch (e) {
      console.error('Failed to fetch complaints:', e);
      setSelectedComplaints([]);
    }
    setTimeout(() => {
      document.getElementById('complaints-table')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // Use isLoaded to prevent duplicate script loads
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });

  // Enhanced logout: clear local/session storage
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    if (onLogout) onLogout();
    window.location.reload();
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} onTabChange={setActiveTab} activeTab={activeTab} />
      {activeTab === 'map' && (
        <>
          <div className="map-container">
            {!apiKey ? (
              <div className="map-error">
                <span style={{ color: 'red', fontWeight: 'bold', padding: '2em', textAlign: 'center' }}>
                  Map API key is missing or invalid.<br />Please set a valid key in your .env file.
                </span>
              </div>
            ) : loadError ? (
              <div className="map-error">
                <span style={{ color: 'red', fontWeight: 'bold', padding: '2em', textAlign: 'center' }}>
                  Failed to load Google Maps API.
                </span>
              </div>
            ) : isLoaded ? (
              <MapComponent clusters={clusters} onClusterClick={handleClusterClick} />
            ) : (
              <div className="map-error">
                <span style={{ color: '#222', fontWeight: 'bold', padding: '2em', textAlign: 'center' }}>
                  Loading map...
                </span>
              </div>
            )}
          </div>
          <ComplaintsTable complaints={selectedComplaints} />
        </>
      )}
      {activeTab === 'all-complaints' && <AllComplaintsPage />}
    </div>
  );
};

export default ManagementView;