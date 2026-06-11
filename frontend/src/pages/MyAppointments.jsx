import Navbar from "../components/Navbar";

function MyAppointments() {
  return (
    <>
      <Navbar />

      <div className="section">
        <h2>My Appointments</h2>

        <div className="cards">
          <div className="card">
            <h3>Dr. Rajesh Kumar</h3>
            <p><strong>Specialization:</strong> Cardiologist</p>
            <p><strong>Date:</strong> 15 June 2026</p>
            <p><strong>Time:</strong> 10:00 AM</p>
            <p><strong>Status:</strong> ✅ Confirmed</p>
          </div>

          <div className="card">
            <h3>Dr. Priya Sharma</h3>
            <p><strong>Specialization:</strong> Dermatologist</p>
            <p><strong>Date:</strong> 18 June 2026</p>
            <p><strong>Time:</strong> 11:30 AM</p>
            <p><strong>Status:</strong> ⏳ Pending</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyAppointments;