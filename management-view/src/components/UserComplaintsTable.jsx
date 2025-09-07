import React, { useState, useEffect } from 'react';

const UserComplaintsTable = ({ userId, refreshKey }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    // Get JWT from localStorage
    const token = localStorage.getItem('access_token') || '';
    fetch('http://localhost:3001/api/complaints/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // Filter complaints by user_id client-side if needed
        const filtered = Array.isArray(data) ? data.filter(c => c.user_id === userId) : [];
        setComplaints(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch complaints');
        setLoading(false);
      });
  }, [userId, refreshKey]);

  if (!userId) return null;
  if (loading) return <div>Loading your complaints...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="complaints-table-container section-card">
      <h3>Your Complaints</h3>
      <table className="complaints-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Postcode</th>
            <th>Urgency</th>
            <th>Cleared</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                No complaints to be shown.
              </td>
            </tr>
          ) : (
            complaints.map(complaint => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.description || '-'}</td>
                <td>{complaint.postcode || '-'}</td>
                <td>{complaint.urgency != null ? complaint.urgency : '-'}</td>
                <td>{complaint.is_cleared === true ? 'Yes' : complaint.is_cleared === false ? 'No' : '-'}</td>
                <td>{complaint.created_at ? new Date(complaint.created_at).toLocaleString() : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserComplaintsTable;
