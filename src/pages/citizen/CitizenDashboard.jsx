import React from "react";
import { Link } from "react-router-dom";

function CitizenDashboard() {
  return (
    <div>
      <h2>Citizen Dashboard</h2>

      <ul>
        <li>
          <Link to="/submit-complaint">Submit Complaint</Link>
        </li>

        <li>
          <Link to="/complaint-history">View Complaint History</Link>
        </li>

        <li>
          <Link to="/track-complaint">Track Complaint Status</Link>
        </li>
      </ul>
    </div>
  );
}

export default CitizenDashboard;