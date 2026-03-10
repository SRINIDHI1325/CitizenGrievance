import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
        <Link to="/admin/create-user">
          <button>Create User</button>
        </Link>

        <Link to="/admin/manage-departments">
          <button>Manage Departments</button>
        </Link>

        <Link to="/admin/assign-complaints">
          <button>Assign Complaints</button>
        </Link>

        <Link to="/admin/generate-reports">
          <button>Generate Reports</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;