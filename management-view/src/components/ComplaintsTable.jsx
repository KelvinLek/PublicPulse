import React from 'react';

const ComplaintsTable = ({ complaints }) => {
  if (!complaints || complaints.length === 0) {
    return null; // Don't render anything if there are no selected complaints
  }

  return (
    <div id="complaints-table" className="table-container">
      <h2>Selected Complaints</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Complaint</th>
            <th>Location</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.text}</td>
              <td>{complaint.location}</td>
              <td>{complaint.submittedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsTable;