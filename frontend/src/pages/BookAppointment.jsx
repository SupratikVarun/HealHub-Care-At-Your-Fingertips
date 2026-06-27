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

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await api.get('/doctors');
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

    if (user.role !== 'patient') {
      setError('Only patients can book appointments from this page.');
      return;
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

  <p>
    <strong>Doctor:</strong>{" "}
    {doctors.find((doctor) => doctor._id === selectedDoctor)?.name}
  </p>

  <p>
    <strong>Date:</strong> {date}
  </p>

  <p>
    <strong>Time:</strong> {formatTime(time)}
  </p>

</div>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Reason for visit (optional)"
            />

            <button type="submit">Confirm Appointment</button>
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
