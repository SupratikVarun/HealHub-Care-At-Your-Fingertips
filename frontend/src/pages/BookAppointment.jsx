import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const formatTime = (time) => {
  const [hour, minute] = time.split(":");

  let h = parseInt(hour);

  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;

  if (h === 0) h = 12;

  return `${h}:${minute} ${ampm}`;
};

function Appointment() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  const selectedDoctorData = doctors.find(
  (doctor) => doctor._id === selectedDoctor
);

const consultationFee = selectedDoctorData?.consultationFee || 0;
const platformFee = 0;
const totalAmount = consultationFee + platformFee;

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await api.get('/doctors');
        console.log(data);
        setDoctors(data || []);
        const doctorId = searchParams.get('doctorId');
const selectedDate = searchParams.get('date');
const selectedTime = searchParams.get('time');

setSelectedDoctor(doctorId || (data?.[0]?._id) || '');

if (selectedDate) {
  setDate(selectedDate);
}

if (selectedTime) {
  setTime(selectedTime);
}
      } catch (err) {
        setError('Unable to load doctors from backend.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must log in as a patient to book an appointment.');
      return;
    }

    if (user.role !== "patient") {
  return (
    <>
      <Navbar />
      <div className="section">
        <h2>Access Denied</h2>
        <p>Only patients can book appointments.</p>
      </div>
    </>
  );
}

    if (!selectedDoctor || !date || !time) {
      setError('Please choose a doctor, date, and time.');
      return;
    }

    try {
      await api.post(
        '/appointments',
        {
          doctorId: selectedDoctor,
          date,
          time,
          reason,
        },
        token,
      );

      setSuccess('Appointment booked successfully. Redirecting...');
      setTimeout(() => navigate('/my-appointments'), 1200);
    } catch (err) {
      setError(err.message || 'Unable to book appointment');
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="section">
          <h2>Book Appointment</h2>
          <p>Please login as a patient before booking an appointment.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Book Appointment</h2>
          <p>Fill in your details to schedule your doctor visit.</p>

          <form onSubmit={handleSubmit}>
            <p><strong>Patient:</strong> {user.name} ({user.phone})</p>

           <div className="appointment-summary">

  <h3>Booking Summary</h3>

  <p>
    <strong>Doctor:</strong> {selectedDoctorData?.name}
  </p>

  <p>
    <strong>Specialization:</strong>{" "}
    {selectedDoctorData?.specialization}
  </p>

  <p>
    <strong>Date:</strong> {date}
  </p>

  <p>
    <strong>Time:</strong> {formatTime(time)}
  </p>

  <hr />

  <p>
    <strong>Consultation Fee:</strong> ₹{consultationFee}
  </p>

  <p>
    <strong>Platform Fee:</strong> ₹{platformFee}
  </p>

  <h3>Total Amount: ₹{totalAmount}</h3>

</div>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Reason for visit (optional)"
            />

            <button type="submit">
  Proceed to Payment
</button>
          </form>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}
          {loading && <p>Loading doctors...</p>}
        </div>
      </div>
    </>
  );
}

export default Appointment;
