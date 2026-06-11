import Navbar from "../components/Navbar";

function DoctorRegister() {
  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Doctor Registration</h2>
          <p>Join HealHub and connect with patients.</p>

          <form>
            <input type="text" placeholder="Full Name" />
            <input type="tel" placeholder="Phone Number" />

            <select>
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>

            <input type="number" placeholder="Years of Experience" />
            <input type="text" placeholder="Hospital / Clinic Name" />
            <input type="text" placeholder="Medical License Number" />

            <button type="submit">Register as Doctor</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default DoctorRegister;