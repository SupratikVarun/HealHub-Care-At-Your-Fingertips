function SearchDoctor() {
  return (
    <section className="search-wrapper">
      <div className="container search-section">
        <h2>Search Doctors</h2>

        <div className="search-box">
          <input type="text" placeholder="Search by doctor name" />
          <input type="text" placeholder="Search by specialization" />
          <button>Search</button>
        </div>
      </div>
    </section>
  );
}

export default SearchDoctor;