import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Doctors() {
  const doctors = [
    {
      name: "Dr. Rajesh Kumar",
      specialization: "Cardiologist",
      experience: "10 Years",
      rating: "4.8",
      location: "Hyderabad",
    },
    {
      name: "Dr. Priya Sharma",
      specialization: "Dermatologist",
      experience: "8 Years",
      rating: "4.7",
      location: "Hyderabad",
    },
    {
      name: "Dr. Arjun Reddy",
      specialization: "Neurologist",
      experience: "12 Years",
      rating: "4.9",
      location: "Secunderabad",
    },
    {
      name: "Dr. Sneha Patel",
      specialization: "Orthopedic",
      experience: "7 Years",
      rating: "4.6",
      location: "Hyderabad",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Available Doctors</h2>

        <div className="cards">
          {doctors.map((doctor, index) => (
            <div className="card" key={index}>
              <h3>{doctor.name}</h3>

              <p>
                <strong>Specialization:</strong> {doctor.specialization}
              </p>

              <p>
                <strong>Experience:</strong> {doctor.experience}
              </p>

              <p>
                <strong>Rating:</strong> ⭐ {doctor.rating}
              </p>

              <p>
                <strong>Location:</strong> {doctor.location}
              </p>

             <Link to="/appointment">
  <button className="doctor-btn">
    Book Appointment
  </button>
</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Doctors;