import Navbar from "../components/Navbar";

function Appointment() {
  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Book Appointment</h2>
          <p>Fill in your details to schedule your doctor visit.</p>

          <form>
            <input type="text" placeholder="Patient Name" />
            <input type="tel" placeholder="Phone Number" />

            <select>
              <option value="">Select Doctor</option>
              <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar - Cardiologist</option>
              <option value="Dr. Priya Sharma">Dr. Priya Sharma - Dermatologist</option>
              <option value="Dr. Arjun Reddy">Dr. Arjun Reddy - Neurologist</option>
              <option value="Dr. Sneha Patel">Dr. Sneha Patel - Orthopedic</option>
            </select>

            <input type="date" />

            <select>
              <option value="">Select Time Slot</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="04:30 PM">04:30 PM</option>
            </select>

            <button type="submit">Confirm Appointment</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Appointment;