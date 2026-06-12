import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [nameQuery, setNameQuery] = useState('');
  const [specializationQuery, setSpecializationQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = async (queryString = '') => {
    setLoading(true);
    setError('');

    try {
      const data = await api.get(`/doctors${queryString}`);
      setDoctors(data || []);
    } catch (err) {
      setError('Unable to load doctors from backend. Showing sample doctors.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
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

    await loadDoctors(params.toString() ? `?${params.toString()}` : '');
  };

  const handleClear = async () => {
    setNameQuery('');
    setSpecializationQuery('');
    await loadDoctors();
  };

  const hasBackendDoctors = doctors.length > 0;
  const filteredSampleDoctors = sampleDoctors.filter((doctor) => {
    const matchesName = nameQuery
      ? doctor.name.toLowerCase().includes(nameQuery.toLowerCase())
      : true;
    const matchesSpecialization = specializationQuery
      ? doctor.specialization.toLowerCase().includes(specializationQuery.toLowerCase())
      : true;
    return matchesName && matchesSpecialization;
  });
  const doctorList = hasBackendDoctors ? doctors : filteredSampleDoctors;

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

        <div className="cards">
          {doctorList.map((doctor) => (
            <div className="card" key={doctor._id}>
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
                <strong>Location:</strong> {doctor.location || doctor.city || 'Unknown'}
              </p>

              {hasBackendDoctors ? (
                <Link to={`/appointment?doctorId=${doctor._id}`}>
                  <button className="doctor-btn">Book Appointment</button>
                </Link>
              ) : (
                <button className="doctor-btn" disabled>
                  Login to book
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Doctors;
