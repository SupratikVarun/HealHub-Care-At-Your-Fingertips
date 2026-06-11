import Navbar from "../components/Navbar";

function Login() {
  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Login to HealHub</h2>
          <p>Enter your phone number to receive an OTP.</p>

          <form>
            <input type="tel" placeholder="Enter phone number" />
            <button type="button">Send OTP</button>

            <input type="text" placeholder="Enter OTP" />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;