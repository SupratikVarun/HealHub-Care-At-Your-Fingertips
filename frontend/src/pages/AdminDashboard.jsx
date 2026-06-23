import Navbar from "../components/Navbar";

function AdminDashboard() {
  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Admin Dashboard</h2>

        <div className="cards">
          <div className="card">
            <h3>Total Patients</h3>
            <p>25</p>
          </div>

          <div className="card">
            <h3>Total Doctors</h3>
            <p>12</p>
          </div>

          <div className="card">
            <h3>Total Appointments</h3>
            <p>40</p>
          </div>

          <div className="card">
            <h3>Pending Doctors</h3>
            <p>3</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;