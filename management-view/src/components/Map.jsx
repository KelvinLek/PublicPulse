// src/components/Map.jsx
import React from 'react';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';

// Define the map's container style
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Define the map's starting position (center of Singapore)
const center = {
  lat: 1.3521,
  lng: 103.8198
};

const MapComponent = ({ clusters, onClusterClick }) => {
  // Function to set the options for each circle
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
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {/* Map over your clusters to create a Circle for each one */}
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
  );
};

export default MapComponent;