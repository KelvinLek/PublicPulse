// src/components/Map.jsx
import React from 'react';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 1.3521,
  lng: 103.8198
};

const MapComponent = ({ clusters, onClusterClick }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const getCircleOptions = (urgency) => {
    const color = urgency > 70 ? 'darkred' : (urgency > 40 ? 'red' : 'yellow');
    return {
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      clickable: true,
    };
  };

  return (
    <div className="map-wrapper">
      {!apiKey ? (
        <div className="map-error">
          <span style={{ color: 'red', fontWeight: 'bold', padding: '2em', textAlign: 'center' }}>
            Map API key is missing or invalid.<br />Please set a valid key in your .env file.
          </span>
        </div>
      ) : (
        <div className="map-frame">
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
            >
              {clusters.map((cluster) => (
                <Circle
                  key={cluster.id}
                  center={{ lat: cluster.lat, lng: cluster.lng }}
                  radius={cluster.radius}
                  options={getCircleOptions(cluster.urgency)}
                  onClick={() => onClusterClick(cluster.complaints)}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </div>
  );
};

export default MapComponent;