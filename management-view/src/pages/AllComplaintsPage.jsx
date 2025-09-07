import React, { useEffect, useState } from 'react';

const AllComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get JWT
  const getToken = () => {
    return localStorage.getItem('access_token') || '';
  };

  const fetchComplaints = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/complaints/')
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch complaints');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleClearComplaint = async (id) => {
    const token = getToken();
    await fetch(`http://localhost:3001/api/complaints/${id}/clear`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    fetchComplaints();
  };

  if (loading) return <div>Loading complaints...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="complaints-table-container">
      <h2>All Complaints</h2>
      <table className="complaints-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Postcode</th>
            <th>Urgency</th>
            <th>Cleared</th>
            <th>Submitted At</th>
            <th>User ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.description || '-'}</td>
              <td>{complaint.postcode || '-'}</td>
              <td>{complaint.urgency != null ? complaint.urgency : '-'}</td>
              <td>{complaint.is_cleared === true ? 'Yes' : complaint.is_cleared === false ? 'No' : '-'}</td>
              <td>{complaint.created_at ? new Date(complaint.created_at).toLocaleString() : '-'}</td>
              <td>{complaint.user_id || '-'}</td>
              <td>
                {complaint.is_cleared ? null : (
                  <button
                    style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5em 1em', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => handleClearComplaint(complaint.id)}
                  >Mark Cleared</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllComplaintsPage;
