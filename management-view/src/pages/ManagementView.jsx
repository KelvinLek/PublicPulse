import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MapComponent from '../components/Map';
import ComplaintsTable from '../components/ComplaintsTable';
import AllComplaintsPage from './AllComplaintsPage';
import { LoadScript, useJsApiLoader } from '@react-google-maps/api';

const ManagementView = ({ onLogout }) => {
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('map');

  // Mock data for clusters - replace this with data from your backend
  const clusters = [
    {
      id: 1,
      lat: 1.3521,
      lng: 103.8198,
      radius: 500,
      urgency: 80,
      complaints: [
        { id: 101, text: 'Broken streetlight', location: 'Street A', submittedAt: '2024-01-15' },
        { id: 102, text: 'Pothole', location: 'Street B', submittedAt: '2024-01-14' },
      ],
    },
    {
      id: 2,
      lat: 1.36,
      lng: 103.83,
      radius: 300,
      urgency: 45,
      complaints: [
        { id: 201, text: 'Overflowing dustbin', location: 'Park Connector', submittedAt: '2024-01-16' },
      ],
    },
     {
      id: 3,
      lat: 1.34,
      lng: 103.80,
      radius: 400,
      urgency: 25,
      complaints: [
        { id: 301, text: 'Faded paint on bench', location: 'Playground', submittedAt: '2024-01-12' },
        { id: 302, text: 'Scuff marks on wall', location: 'Void Deck', submittedAt: '2024-01-11' },
      ],
    },
  ];

  const handleClusterClick = (complaints) => {
    setSelectedComplaints(complaints);
    // Use a short timeout to ensure the table is rendered before scrolling
    setTimeout(() => {
      document.getElementById('complaints-table')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // Use isLoaded to prevent duplicate script loads
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });

  return (
    <div>
      <Navbar onLogout={onLogout} onTabChange={setActiveTab} activeTab={activeTab} />
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