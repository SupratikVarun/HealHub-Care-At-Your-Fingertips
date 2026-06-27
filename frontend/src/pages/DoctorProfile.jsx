import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";

const formatTime = (time) => {
  const [hour, minute] = time.split(":");

  let h = parseInt(hour);

  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;

  if (h === 0) h = 12;

  return `${h}:${minute} ${ampm}`;
};

function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const data = await api.get(`/doctors/${id}`);
        setDoctor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="section">
          <p>Loading doctor profile...</p>
        </div>
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Navbar />
        <div className="section">
          <p>Doctor not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="section">

        <div className="card">

          <h2>{doctor.name}</h2>

          <p>
            <p><strong>Specialization:</strong> {doctor.specialization || "Not Provided"}</p>
          </p>

          
            <p> <strong>Experience:</strong> {doctor.experience || "Not Provided"} Years
          </p>

          
           <p><strong>Clinic:</strong> {doctor.clinic || "Not Provided"}
          </p>

          
            <p><strong>License Number:</strong> {doctor.licenseNumber || "Not Provided"}
          </p>

          
            <p><strong>City:</strong> {doctor.city || "Not Provided"}
          </p>

         <p><strong>Rating:</strong> {doctor.rating || "Not Provided"}
          </p>

          <hr />

<h3>Available Slots</h3>

{doctor.availability &&
doctor.availability.filter(
  (slot) => slot.bookedCount < slot.maxAppointments
).length > 0 ? (

  doctor.availability
    .filter(
      (slot) => slot.bookedCount < slot.maxAppointments
    )
    .map((slot, index) => (

      <div key={index} className="slot-item">

        <span className="slot-badge">
          📅 {slot.date}
          <br />
         🕒 {formatTime(slot.time)}
           </span>

        <Link
          to={`/appointment?doctorId=${doctor._id}&date=${slot.date}&time=${slot.time}`}
        >
          <button className="doctor-btn">
            Book Appointment
          </button>
        </Link>

      </div>

    ))

) : (
  <p>No available appointments.</p>
)}

        </div>

      </div>
    </>
  );
}

export default DoctorProfile;