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
          <h3>Today's Appointments</h3>
          {error && <p className="form-error">{error}</p>}
          {appointments.length === 0 ? (
            <p>No appointments scheduled. <Link to="/doctors">Share your profile</Link> to attract patients.</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <p><strong>Patient:</strong> {appointment.patient?.name || appointment.patient?.phone || 'Unknown'}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
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
