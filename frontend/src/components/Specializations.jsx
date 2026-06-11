function Specializations() {
  const specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
  ];

  return (
    <section className="section">
      <h2>Specializations</h2>

      <div className="cards">
        {specializations.map((item) => (
          <div className="card" key={item}>
            <h3>{item}</h3>
            <p>Find experienced {item} doctors near you.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Specializations;