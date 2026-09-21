import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">
            YOUR FITNESS. YOUR GOAL. YOUR CHOICE.
          </p>

          <h1>
            Find the right products
            <br />
            for your fitness journey.
          </h1>

          <p className="hero-description">
            Discover fitness products from trusted brands, compare your
            options and get personalized recommendations based on your
            goals and budget.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="primary-btn">
              Explore Products
            </Link>

            <Link to="/assistant" className="secondary-btn">
              Ask FitHub AI
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>Shop by Category</h2>
        </div>

        <div className="category-grid">
          <Link
            to="/products?category=Protein%20%26%20Supplements"
            className="category-card"
          >
            <div className="category-icon">🥤</div>
            <h3>Protein & Supplements</h3>
            <p>Protein, creatine and more</p>
          </Link>

          <Link
            to="/products?category=Gym%20Equipment"
            className="category-card"
          >
            <div className="category-icon">🏋️</div>
            <h3>Gym Equipment</h3>
            <p>Dumbbells, bands and equipment</p>
          </Link>

          <Link
            to="/products?category=Cardio"
            className="category-card"
          >
            <div className="category-icon">🏃</div>
            <h3>Cardio</h3>
            <p>Products for cardio workouts</p>
          </Link>

          <Link
            to="/products?category=Recovery"
            className="category-card"
          >
            <div className="category-icon">🧘</div>
            <h3>Recovery</h3>
            <p>Recovery and mobility products</p>
          </Link>

          <Link
            to="/products?category=Gym%20Accessories"
            className="category-card"
          >
            <div className="category-icon">🧤</div>
            <h3>Gym Accessories</h3>
            <p>Useful workout accessories</p>
          </Link>

          <Link
            to="/products?category=Nutrition%20%26%20Diet"
            className="category-card"
          >
            <div className="category-icon">💧</div>
            <h3>Nutrition & Diet</h3>
            <p>Hydration and nutrition essentials</p>
          </Link>
        </div>
      </section>

      <section className="ai-section">
        <div>
          <p className="ai-tag">SMART FITNESS SHOPPING</p>

          <h2>Not sure what you need?</h2>

          <p>
            Tell FitHub AI about your fitness goal, budget and experience
            level. It can help you discover suitable products from the
            FitHub catalogue.
          </p>

          <Link to="/assistant" className="primary-btn">
            Try FitHub AI
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;