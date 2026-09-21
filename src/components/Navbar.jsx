import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    await logout();
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          Fit<span>Hub</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/assistant">FitHub AI</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/wishlist">Wishlist</Link>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <span className="user-name">Hi, {user?.name}</span>

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/register" className="register-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
