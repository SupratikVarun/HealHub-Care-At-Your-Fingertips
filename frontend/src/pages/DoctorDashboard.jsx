import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function DoctorDashboard() {
  const { user, token, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [responseMessages, setResponseMessages] = useState({});
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityTime, setAvailabilityTime] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [maxAppointments, setMaxAppointments] = useState(1);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadAppointments = async () => {
      try {
        const data = await api.get('/appointments', token);
        setAppointments(data || []);
      } catch (err) {
        setError('Unable to load your appointments.');
      }
    };

    loadAppointments();
  }, [user, token]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="section">
          <p>Loading your dashboard...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="section">
          <h2>Doctor Dashboard</h2>
          <p>
            Please <Link to="/login">login</Link> to view your dashboard.
          </p>
        </div>
      </>
    );
  }

  const handleResponseChange = (appointmentId, value) => {
    setResponseMessages((prev) => ({ ...prev, [appointmentId]: value }));
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    setError('');

    try {
      const responseMessage = responseMessages[appointmentId]?.trim() || '';

      if (status === 'declined' && !responseMessage) {
        setError('Please provide a reason when declining an appointment.');
        return;
      }

      const data = await api.patch(
        `/appointments/${appointmentId}/status`,
        { status, responseMessage },
        token,
      );

      setAppointments((prev) => prev.map((appointment) => (
        appointment._id === appointmentId ? data : appointment
      )));
      setResponseMessages((prev) => ({ ...prev, [appointmentId]: '' }));
    } catch (err) {
      setError(err.message || 'Unable to update appointment status.');
    }
  };
  const handleAddAvailability = async (event) => {
  event.preventDefault();
  const today = new Date();
today.setHours(0, 0, 0, 0);

const selectedDate = new Date(availabilityDate);

if (selectedDate < today) {
  setAvailabilityMessage(
    "You cannot add availability for a past date."
  );
  return;
}

  setAvailabilityMessage("");
  setError("");

  if (!availabilityDate || !availabilityTime) {
    setAvailabilityMessage("Please select both date and time.");
    return;
  }

  try {
    const data = await api.post(
      "/doctors/availability",
      {
        date: availabilityDate,
        time: availabilityTime,
        maxAppointments,
      },
      token
    );

    setAvailabilityMessage(
      data.message || "Availability added successfully."
    );

    setAvailabilityDate("");
    setAvailabilityTime("");
    setMaxAppointments(1);
  } catch (err) {
    setAvailabilityMessage(
      err.message || "Unable to add availability."
    );
  }
};

  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Doctor Dashboard</h2>

        <div className="card">
          <h3>Doctor Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Specialization:</strong> {user.specialization || 'Not provided'}</p>
          <p><strong>Experience:</strong> {user.experience ? `${user.experience} Years` : 'Not provided'}</p>
        </div>

        <br />

<div className="card">
  <h3>Add Availability</h3>
  <p>Select the date and time when you are available for appointments.</p>

  {availabilityMessage && (
    <p className="form-error">{availabilityMessage}</p>
  )}

  <form onSubmit={handleAddAvailability}>
    <input
  type="date"
  min={new Date().toISOString().split("T")[0]}
  value={availabilityDate}
  onChange={(event) => setAvailabilityDate(event.target.value)}
/>

<input
  type="time"
  value={availabilityTime}
  onChange={(event) => setAvailabilityTime(event.target.value)}
/>

    <input
  type="number"
  min="1"
  placeholder="Maximum appointments for this slot"
  value={maxAppointments}
  onChange={(event) => setMaxAppointments(event.target.value)}
/>

    <button type="submit" className="doctor-btn">
      Add Availability
    </button>
  </form>
</div>

        <br />

        <div className="card">
          <h3>Appointment Requests</h3>
          {error && <p className="form-error">{error}</p>}
          {appointments.length === 0 ? (
            <p>No appointments scheduled. <Link to="/doctors">Share your profile</Link> to attract patients.</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <p><strong>Patient:</strong> {appointment.patient?.name || appointment.patient?.phone || 'Unknown'}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p>
  <strong>Status:</strong>{" "}
  <span
    className={
      appointment.status === "confirmed"
        ? "status-confirmed"
        : appointment.status === "declined"
        ? "status-declined"
        : "status-pending"
    }
  >
    {appointment.status.charAt(0).toUpperCase() +
      appointment.status.slice(1)}
  </span>
</p>
                <p><strong>Reason:</strong> {appointment.reason || 'N/A'}</p>
                {appointment.status === 'pending' ? (
                  <>
                    <textarea
                      rows="3"
                      placeholder="Reason for declining (required if declining)"
                      value={responseMessages[appointment._id] || ''}
                      onChange={(event) => handleResponseChange(appointment._id, event.target.value)}
                    />
                    <div className="button-row">
                      <button type="button" onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}>
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(appointment._id, 'declined')}
                        disabled={!responseMessages[appointment._id]?.trim()}
                        className={!responseMessages[appointment._id]?.trim() ? 'disabled-button' : ''}
                      >
                        Decline
                      </button>
                    </div>
                  </>
                ) : (
                  appointment.status === 'declined' && appointment.responseMessage ? (
                    <p><strong>Decline Message:</strong> {appointment.responseMessage}</p>
                  ) : null
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}


export default DoctorDashboard;
