import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <h2 className="logo">HealHub</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/login">Login</Link>
         <Link to="/register-patient">
  <button>Patient Register</button>
</Link>

<Link to="/register-doctor">
  <button>Doctor Register</button>
</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;