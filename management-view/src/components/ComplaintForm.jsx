import React, { useState } from 'react';

const ComplaintForm = ({ userId, onSubmitted }) => {
  const [complaint, setComplaint] = useState('');
  const [postcode, setPostcode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Get postcode from location (simple browser geolocation)
  const handleGetPostcode = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      // Use a free API for reverse geocoding (example: Nominatim)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setPostcode(data.address.postcode || '');
      } catch {
        setError('Failed to get postcode');
      }
    }, () => setError('Failed to get location'));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    // Get JWT from localStorage
    const token = localStorage.getItem('access_token') || '';
    try {
  const res = await fetch('http://localhost:3001/api/complaints/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
  body: JSON.stringify({ description: complaint, postcode: Number(postcode) })
      });
      if (!res.ok) throw new Error('Failed to submit complaint');
      setComplaint('');
      setPostcode('');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  return (
    <form className="complaint-form section-card" onSubmit={handleSubmit}>
      <h3>Submit a Complaint</h3>
      <div className="form-group">
        <label style={{ fontSize: '1.35em', fontWeight: 700, marginBottom: '0.75em' }}>Description</label>
        <textarea
          style={{ fontSize: '1.25em', padding: '1.25em', marginBottom: '1.25em', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', color: '#222' }}
          value={complaint}
          onChange={e => setComplaint(e.target.value)}
          required
          placeholder="Describe your complaint"
        />
      </div>
      <div className="form-group">
        <label style={{ fontSize: '1.35em', fontWeight: 700, marginBottom: '0.75em' }}>Postcode</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
          <input
            style={{ fontSize: '1.25em', padding: '1.25em', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', marginBottom: 0, flex: 1 }}
            type="text"
            value={postcode}
            onChange={e => setPostcode(e.target.value)}
            required
            placeholder="Enter postcode"
          />
          <button type="button" onClick={handleGetPostcode} disabled={submitting} style={{ fontSize: '0.95em', padding: '0.5em 0.75em', borderRadius: '6px', marginLeft: 0 }}>
            Get
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <button type="submit" disabled={submitting} style={{ fontSize: '1.25em', padding: '1em 2em', borderRadius: '8px', marginTop: '1em', background: '#e11d48', color: '#fff', border: 'none' }}>Submit</button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default ComplaintForm;
