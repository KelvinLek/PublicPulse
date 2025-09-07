// src/components/Map.jsx
import React from 'react';
import { GoogleMap, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 1.3521,
  lng: 103.8198
};

const MapComponent = ({ clusters, onClusterClick }) => {
  // apiKey is now handled by parent
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
      <div className="map-frame">
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
      </div>
    </div>
  );
};

export default MapComponent;