import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-logo">
              Fit<span>Hub</span>
            </div>

            <p className="footer-description">
              Discover fitness products, compare your options,
              explore quality evidence and find products that
              fit your goals and budget.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>

            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/compare">Compare</Link>
            <Link to="/assistant">FitHub AI</Link>
          </div>

          <div className="footer-column">
            <h3>Your FitHub</h3>

            <Link to="/wishlist">Wishlist</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Create Account</Link>
          </div>

          <div className="footer-column">
            <h3>Company</h3>

            <Link to="/about">About Us</Link>
            <Link to="/products?evidence=verified">
              Quality Evidence
            </Link>
            <Link to="/products">Fitness Products</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 FitHub. All rights reserved.</span>
          <span>Built for smarter fitness decisions.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;