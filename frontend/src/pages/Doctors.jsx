import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";

const sampleDoctors = [
  {
    _id: 'sample-1',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiologist',
    experience: '10 Years',
    rating: '4.8',
    location: 'Hyderabad',
  },
  {
    _id: 'sample-2',
    name: 'Dr. Priya Sharma',
    specialization: 'Dermatologist',
    experience: '8 Years',
    rating: '4.7',
    location: 'Hyderabad',
  },
  {
    _id: 'sample-3',
    name: 'Dr. Arjun Reddy',
    specialization: 'Neurologist',
    experience: '12 Years',
    rating: '4.9',
    location: 'Secunderabad',
  },
  {
    _id: 'sample-4',
    name: 'Dr. Sneha Patel',
    specialization: 'Orthopedic',
    experience: '7 Years',
    rating: '4.6',
    location: 'Hyderabad',
  },
];
const formatTime = (time) => {

  const [hour, minute] = time.split(":");

  let h = parseInt(hour);

  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;

  if (h === 0) h = 12;

  return `${h}:${minute} ${ampm}`;
};

function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [nameQuery, setNameQuery] = useState(searchParams.get('name') || '');
  const [specializationQuery, setSpecializationQuery] = useState(searchParams.get('specialization') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = async (queryString = '') => {
    setLoading(true);
    setError('');

    try {
      const data = await api.get(`/doctors${queryString}`);
      setBackendAvailable(true);
      setDoctors(data || []);
    } catch (err) {
      setError('Unable to load doctors from backend. Showing sample doctors.');
      setBackendAvailable(false);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (nameQuery.trim()) params.set('name', nameQuery.trim());
    if (specializationQuery.trim()) params.set('specialization', specializationQuery.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    setSearchParams(params);
    loadDoctors(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (nameQuery.trim()) {
      params.set('name', nameQuery.trim());
    }
    if (specializationQuery.trim()) {
      params.set('specialization', specializationQuery.trim());
    }

    setSearchParams(params);
    await loadDoctors(params.toString() ? `?${params.toString()}` : '');
  };

  const handleClear = async () => {
    setNameQuery('');
    setSpecializationQuery('');
    setSearchParams({});
    await loadDoctors();
  };

  const isUsingBackend = backendAvailable && doctors.length > 0;
  const filteredSampleDoctors = sampleDoctors.filter((doctor) => {
    const matchesName = nameQuery
      ? doctor.name.toLowerCase().includes(nameQuery.toLowerCase())
      : true;
    const matchesSpecialization = specializationQuery
      ? doctor.specialization.toLowerCase().includes(specializationQuery.toLowerCase())
      : true;
    return matchesName && matchesSpecialization;
  });
  const doctorList = isUsingBackend
  ? doctors.filter(
      (doctor) =>
        doctor.availability &&
        doctor.availability.some(
          (slot) => slot.bookedCount < slot.maxAppointments
        )
    )
  : filteredSampleDoctors;

  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Available Doctors</h2>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-row">
            <input
              type="text"
              value={nameQuery}
              onChange={(event) => setNameQuery(event.target.value)}
              placeholder="Search by doctor name"
            />
            <input
              type="text"
              value={specializationQuery}
              onChange={(event) => setSpecializationQuery(event.target.value)}
              placeholder="Search by specialization"
            />
            <button type="submit" className="doctor-btn">
              Search
            </button>
            <button type="button" className="doctor-btn secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>

        {loading && <p>Loading doctors...</p>}
        {error && <p className="form-error">{error}</p>}
        {!backendAvailable && (
          <p className="form-error">Backend unavailable — showing sample doctors.</p>
        )}
        {!loading && backendAvailable && doctorList.length === 0 && (
          <p className="form-error">No doctors found matching your search.</p>
        )}

        <div className="cards">
          {doctorList.map((doctor) => (
            <div className="card" key={doctor._id}>
              <h3>{doctor.name}</h3>

             <p>{doctor.specialization}</p>

               <p>{doctor.location || doctor.city || "Hyderabad"}</p>

                 <p>
                    Rating: {doctor.rating || "4.8"}/5
                 </p>
                 <Link to={`/doctor/${doctor._id}`}>
                <button className="doctor-btn secondary">
                  View Profile
               </button>
            </Link>

        <hr />

                <hr />

              {doctor.availability && doctor.availability.length > 0 && (
  <div className="availability-preview">

    <p><strong>Available Appointments</strong></p>

    {doctor.availability.map((slot, index) => {

      const remaining =
        slot.maxAppointments - slot.bookedCount;

      let symbol = "🟢";

      if (remaining === 2) symbol = "🟡";
      if (remaining === 1) symbol = "🟠";

      return (
        <p key={index}>
          {symbol} {formatTime(slot.time)} &nbsp;&nbsp;

          {remaining === 1
            ? "Last slot"
            : `${remaining} slots left`}
        </p>
      );
    })}

  </div>
)}

             <div className="availability-box">
  <strong>Available Slots:</strong>

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
            {slot.date} • {formatTime(slot.time)}
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
    <p>No slots available</p>
  )}
</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Doctors;
