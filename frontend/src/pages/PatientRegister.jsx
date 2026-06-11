import Navbar from "../components/Navbar";

function Register() {
  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Create Your HealHub Account</h2>
          <p>Register to book and manage your appointments easily.</p>

          <form>
            <input type="text" placeholder="Full Name" />
            <input type="tel" placeholder="Phone Number" />
            <input type="number" placeholder="Age" />

            <select>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input type="text" placeholder="City" />

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;