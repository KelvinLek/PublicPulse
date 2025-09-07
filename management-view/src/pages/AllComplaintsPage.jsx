import React, { useEffect, useState } from 'react';

const AllComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all complaints from backend
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
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.complaint || '-'}</td>
              <td>{complaint.postcode || '-'}</td>
              <td>{complaint.urgency != null ? complaint.urgency : '-'}</td>
              <td>{complaint.cleared === true ? 'Yes' : complaint.cleared === false ? 'No' : '-'}</td>
              <td>{complaint.created_at ? new Date(complaint.created_at).toLocaleString() : '-'}</td>
              <td>{complaint.user_id || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllComplaintsPage;
