import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "☀️ Good Morning";
    if (hour < 17) return "🌤️ Good Afternoon";
    return "🌙 Good Evening";
  };

  const handleButtonClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/doctors");
    }
  };

  return (
    <section className="hero">
      <div className="container hero-content">

        {user ? (
          <>
           <h1>{getGreeting()}!</h1>

<h2 className="welcome-name">
  Welcome back, {user.role === "doctor" ? `Dr. ${user.name}` : user.name}
</h2>

            <p>
              {user.role === "doctor"
                ? "Manage your appointments and help your patients today."
                : "Ready to take care of your health today? Find the right doctor in just a few clicks."}
            </p>

            <button onClick={handleButtonClick}>
              {user.role === "doctor"
                ? "Go to Dashboard"
                : "Find Doctors"}
            </button>
          </>
        ) : (
          <>
            <h1>Find Trusted Doctors Near You</h1>

            <p>
              Book appointments with verified doctors and manage your healthcare
              easily with HealHub.
            </p>

            <button onClick={handleButtonClick}>
              Book Appointment
            </button>
          </>
        )}

      </div>
    </section>
  );
}

export default Hero;