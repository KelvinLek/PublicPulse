// src/components/Map.jsx

import React, { useState, useEffect } from 'react';
import { GoogleMap, Circle } from '@react-google-maps/api';
import { geocodePostcode } from '../utils/geocodePostcode';

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
  const [geoClusters, setGeoClusters] = useState([]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    async function fetchGeocodes() {
      if (!clusters || clusters.length === 0) return setGeoClusters([]);
      const results = await Promise.all(clusters.map(async (cluster) => {
        if (cluster.postcode) {
          try {
            const { lat, lng } = await geocodePostcode(cluster.postcode, apiKey);
            return { ...cluster, lat, lng };
          } catch (e) {
            console.error('Geocode error:', e);
            return { ...cluster, lat: center.lat, lng: center.lng };
          }
        }
        return cluster;
      }));
      setGeoClusters(results);
    }
    fetchGeocodes();
  }, [clusters, apiKey]);

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
          {geoClusters.map((cluster) => (
            <React.Fragment key={cluster.cluster_id || cluster.id}>
              <Circle
                center={{ lat: cluster.lat, lng: cluster.lng }}
                radius={cluster.radius}
                options={getCircleOptions(cluster.urgency)}
                onClick={() => onClusterClick(cluster.complaints)}
                onMouseOver={() => setHoveredCluster(cluster)}
                onMouseOut={() => setHoveredCluster(null)}
              />
              {hoveredCluster && (hoveredCluster.cluster_id || hoveredCluster.id) === (cluster.cluster_id || cluster.id) && (
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