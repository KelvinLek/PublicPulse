// src/components/Map.jsx
import React, { useState } from 'react';
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
  const [hoveredCluster, setHoveredCluster] = useState(null);
  // For testing: show cluster descriptions in console
  React.useEffect(() => {
    if (clusters && clusters.length > 0) {
      clusters.forEach((cluster, idx) => {
        console.log(`Test Cluster ${idx + 1}: Description =`, cluster.description || 'No description');
      });
    }
  }, [clusters]);
  // apiKey is now handled by parent
  const getCircleOptions = (urgency) => {
    const color = urgency > 70 ? 'red' : (urgency > 40 ? 'orange' : 'yellow');
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
            <React.Fragment key={cluster.id}>
              <Circle
                center={{ lat: cluster.lat, lng: cluster.lng }}
                radius={cluster.radius}
                options={getCircleOptions(cluster.urgency)}
                onClick={() => onClusterClick(cluster.complaints)}
                onMouseOver={() => setHoveredCluster(cluster)}
                onMouseOut={() => setHoveredCluster(null)}
              />
              {hoveredCluster && hoveredCluster.id === cluster.id && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '20px',
                    transform: 'translateX(-50%)',
                    background: 'rgba(34,34,34,0.95)',
                    color: '#fff',
                    padding: '1em 1.5em',
                    borderRadius: '10px',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    fontSize: '1.1em',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  {cluster.description || 'No description'}
                </div>
              )}
            </React.Fragment>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapComponent;