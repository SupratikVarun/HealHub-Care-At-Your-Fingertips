import Navbar from "../components/Navbar";

function PatientDashboard() {
  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Patient Dashboard</h2>

        <div className="card">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> Supratik Varun</p>
          <p><strong>Phone:</strong> 9876543210</p>
        </div>

        <br />

        <div className="card">
          <h3>My Appointments</h3>

          <p>Dr. Rajesh Kumar</p>
          <p>15 June 2026</p>
          <p>10:00 AM</p>
          <p>✅ Confirmed</p>
        </div>
      </div>
    </>
  );
}

export default PatientDashboard;