import Navbar from "../components/Navbar";

function DoctorDashboard() {
  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Doctor Dashboard</h2>

        <div className="card">
          <h3>Doctor Information</h3>
          <p><strong>Name:</strong> Dr. Rajesh Kumar</p>
          <p><strong>Specialization:</strong> Cardiologist</p>
          <p><strong>Experience:</strong> 10 Years</p>
        </div>

        <br />

        <div className="card">
          <h3>Today&apos;s Appointments</h3>
          <p><strong>Patient:</strong> Supratik Varun</p>
          <p><strong>Time:</strong> 10:00 AM</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>
      </div>
    </>
  );
}

export default DoctorDashboard;