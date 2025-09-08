import React from 'react';

const ComplaintsTable = ({ complaints }) => {
  if (!complaints || complaints.length === 0) {
    return null; // Don't render anything if there are no selected complaints
  }

  return (
    <div id="complaints-table" className="table-container">
  <h2 className="selected-complaints-heading">Selected Complaints</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Postcode</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.description}</td>
              <td>{complaint.postcode}</td>
              <td>{complaint.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsTable;