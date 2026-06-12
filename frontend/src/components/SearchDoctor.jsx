import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchDoctor() {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (name.trim()) params.set('name', name.trim());
    if (specialization.trim()) params.set('specialization', specialization.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    navigate(`/doctors${queryString}`);
  };

  return (
    <section className="search-wrapper">
      <div className="container search-section">
        <h2>Search Doctors</h2>

        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Search by doctor name"
          />
          <input
            type="text"
            value={specialization}
            onChange={(event) => setSpecialization(event.target.value)}
            placeholder="Search by specialization"
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </section>
  );
}

export default SearchDoctor;