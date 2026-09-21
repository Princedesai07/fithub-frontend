import { Link } from "react-router-dom";
import "./About.css";

function About() {
  const technologies = [
    "React",
    "React Router",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
    "JWT Authentication",
    "REST API",
    "Ollama",
    "Qwen",
  ];

  const features = [
    {
      icon: "🔎",
      title: "Smart Product Discovery",
      description:
        "Explore fitness products from different categories and discover options based on your needs.",
    },
    {
      icon: "⚖️",
      title: "Product Comparison",
      description:
        "Compare compatible products using price, ratings, features, certifications and other details.",
    },
    {
      icon: "🤖",
      title: "AI Recommendations",
      description:
        "Get personalized product suggestions based on your fitness goal, budget and experience level.",
    },
    {
      icon: "🛡️",
      title: "Quality Information",
      description:
        "Explore certifications and available quality evidence to make more informed product decisions.",
    },
    {
      icon: "❤️",
      title: "Wishlist",
      description:
        "Save products you are interested in and easily return to them later.",
    },
    {
      icon: "🔗",
      title: "Official Purchase Links",
      description:
        "Access official purchase links when you are ready to explore or buy a product.",
    },
  ];

  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-content">
            <span className="about-eyebrow">ABOUT FITHUB</span>

            <h1>
              Making fitness product discovery
              <span> simpler and smarter.</span>
            </h1>

            <p>
              FitHub is a fitness product discovery platform designed to help
              users explore, compare and discover products that fit their
              fitness goals, budget and experience level.
            </p>

            <div className="about-hero-actions">
              <Link to="/products" className="about-primary-btn">
                Explore Products
              </Link>

              <Link to="/assistant" className="about-secondary-btn">
                Ask FitHub AI
              </Link>
            </div>
          </div>

          <div className="about-hero-card">
            <div className="about-hero-card-icon">🏋️</div>

            <h2>One place for smarter fitness choices.</h2>

            <p>
              Discover products, compare your options and get recommendations
              tailored to your needs.
            </p>

            <div className="about-hero-stats">
              <div>
                <strong>Search</strong>
                <span>Discover</span>
              </div>

              <div>
                <strong>Compare</strong>
                <span>Evaluate</span>
              </div>

              <div>
                <strong>AI</strong>
                <span>Recommend</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About FitHub */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="about-eyebrow">WHAT IS FITHUB?</span>

            <h2>Fitness products, organized around your needs.</h2>

            <p>
              Finding the right fitness product can involve searching through
              multiple brands, categories and websites. FitHub brings useful
              product information together in one place so users can explore
              their options more conveniently.
            </p>
          </div>

          <div className="about-story-grid">
            <div className="about-story-card">
              <span>01</span>
              <h3>Discover</h3>
              <p>
                Browse fitness products across equipment, supplements,
                accessories, nutrition and other categories.
              </p>
            </div>

            <div className="about-story-card">
              <span>02</span>
              <h3>Evaluate</h3>
              <p>
                Use ratings, prices, features, certifications and quality
                information to understand your options.
              </p>
            </div>

            <div className="about-story-card">
              <span>03</span>
              <h3>Decide</h3>
              <p>
                Compare suitable products, save favorites and use FitHub AI for
                personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-container">
          <div className="about-mission-content">
            <span className="about-eyebrow">OUR MISSION</span>

            <h2>Make fitness product decisions easier.</h2>

            <p>
              Our goal is to simplify fitness product discovery by bringing
              product information, comparison tools and personalized
              recommendations together in one platform.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-section-heading centered">
            <span className="about-eyebrow">WHAT FITHUB OFFERS</span>

            <h2>Built around the fitness shopping journey.</h2>

            <p>
              FitHub combines discovery, comparison, personalization and product
              information into one experience.
            </p>
          </div>

          <div className="about-feature-grid">
            {features.map((feature) => (
              <div className="about-feature-card" key={feature.title}>
                <div className="about-feature-icon">{feature.icon}</div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Built It */}
      <section className="about-tech-section">
        <div className="about-container">
          <div className="about-section-heading centered">
            <span className="about-eyebrow">HOW WE BUILT FITHUB</span>

            <h2>Modern technologies behind the platform.</h2>

            <p>
              FitHub is built using a MERN-based architecture with AI
              integration for personalized fitness product assistance.
            </p>
          </div>

          <div className="about-tech-flow">
            <div className="about-tech-box">
              <span>Frontend</span>
              <strong>React</strong>
              <small>Interactive user experience</small>
            </div>

            <div className="about-tech-arrow">→</div>

            <div className="about-tech-box">
              <span>Backend</span>
              <strong>Node + Express</strong>
              <small>REST APIs and application logic</small>
            </div>

            <div className="about-tech-arrow">→</div>

            <div className="about-tech-box">
              <span>Database</span>
              <strong>MongoDB</strong>
              <small>Product and user data</small>
            </div>

            <div className="about-tech-arrow">→</div>

            <div className="about-tech-box">
              <span>AI</span>
              <strong>Ollama + Qwen</strong>
              <small>Conversational assistance</small>
            </div>
          </div>

          <div className="about-tech-list">
            {technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>
      </section>

      {/* What We Worked On */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-work-grid">
            <div>
              <span className="about-eyebrow">OUR WORK</span>

              <h2>From product discovery to AI-powered recommendations.</h2>

              <p>
                FitHub combines several application modules into one complete
                fitness product platform.
              </p>
            </div>

            <div className="about-work-list">
              <div>
                <strong>Product Discovery</strong>
                <span>
                  Search, categories, filters, sorting and product details.
                </span>
              </div>

              <div>
                <strong>Product Intelligence</strong>
                <span>
                  Ratings, certifications, quality evidence and comparison.
                </span>
              </div>

              <div>
                <strong>Personalization</strong>
                <span>
                  AI recommendations based on fitness goal, budget and
                  experience level.
                </span>
              </div>

              <div>
                <strong>User Features</strong>
                <span>
                  Authentication, wishlist and personalized product exploration.
                </span>
              </div>

              <div>
                <strong>Administration</strong>
                <span>
                  Product, category and brand management through an admin
                  dashboard.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team-section">
        <div className="about-container">
          <div className="about-section-heading centered">
            <span className="about-eyebrow">MEET THE TEAM</span>

            <h2>
              The people building
              <span> FitHub.</span>
            </h2>

            <p>
              FitHub is a collaborative full-stack project focused on making
              fitness product discovery, comparison and personalized
              recommendations simpler and smarter.
            </p>
          </div>

          <div className="about-team-grid">
            {/* =========================
          PRINCE DESAI
          ========================= */}

            <div className="about-team-card">
              <div className="about-team-avatar">PD</div>

              <div className="about-team-content">
                <span className="about-team-role">Full-Stack Developer</span>

                <h3>Prince Desai</h3>

                <p>
                  B.Tech Computer Engineering student at
                  <strong> Dharmsinh Desai University</strong>, focused on
                  building modern full-stack applications and practical software
                  solutions.
                </p>

                <div className="about-team-skills">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>Express.js</span>
                  <span>MongoDB</span>
                  <span>REST APIs</span>
                  <span>JWT</span>
                  <span>AI Integration</span>
                  <span>Git</span>
                </div>

                <div className="about-team-contribution">
                  <strong>FitHub Contributions</strong>

                  <ul>
                    <li>Full-stack application development</li>
                    <li>React frontend and user experience</li>
                    <li>Node.js and Express REST APIs</li>
                    <li>MongoDB database integration</li>
                    <li>Authentication and protected routes</li>
                    <li>Product discovery, search and filtering</li>
                    <li>Wishlist and product comparison</li>
                    <li>Admin management system</li>
                    <li>AI-powered recommendation integration</li>
                  </ul>
                </div>

                <div className="about-team-links">
                  <a
                    href="https://www.linkedin.com/in/prince-p-desai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn ↗
                  </a>

                  <a
                    href="https://github.com/Princedesai07"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>

                  <a href="mailto:desaiprince400@gmail.com">Email</a>
                </div>
              </div>
            </div>

            {/* =========================
          HETEX UTADIYA
          ========================= */}

            <div className="about-team-card">
              <div className="about-team-avatar">HU</div>

              <div className="about-team-content">
                <span className="about-team-role">Full-Stack Developer</span>

                <h3>Hetex Utadiya</h3>

                <p>
                  B.Tech Computer Engineering student at
                  <strong> Dharmsinh Desai University</strong> and member of the
                  FitHub development team, with an interest in full-stack
                  development, modern web technologies and building practical
                  software solutions.
                </p>

                <div className="about-team-skills">
                  <span>React</span>
                  <span>JavaScript</span>
                  <span>Node.js</span>
                  <span>Express.js</span>
                  <span>MongoDB</span>
                  <span>REST APIs</span>
                  <span>Git</span>
                </div>

                <div className="about-team-contribution">
                  <strong>FitHub Contributions</strong>

                  <ul>
                    <li>Collaborative full-stack application development</li>
                    <li>Frontend interface development with React</li>
                    <li>Integration of frontend components with REST APIs</li>
                    <li>
                      Working with product discovery and application workflows
                    </li>
                    <li>Database-driven application development</li>
                    <li>Testing and validation of application features</li>
                    <li>Responsive and user-focused interface development</li>
                    <li>Project documentation and presentation</li>
                    <li>
                      Collaborative development and project implementation
                    </li>
                  </ul>
                </div>

                <div className="about-team-links">
                  <a href="#" onClick={(event) => event.preventDefault()}>
                    LinkedIn
                  </a>

                  <a href="#" onClick={(event) => event.preventDefault()}>
                    GitHub
                  </a>

                  <a href="#" onClick={(event) => event.preventDefault()}>
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="about-team-note">
            <strong>Built with curiosity. Developed with purpose.</strong>

            <span>
              FitHub brings together full-stack web development, database
              systems, product intelligence and AI-assisted recommendations into
              one practical fitness platform.
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container">
          <div className="about-cta-content">
            <span className="about-eyebrow">START EXPLORING</span>

            <h2>Find fitness products that fit you.</h2>

            <p>
              Explore products, compare your options or ask FitHub AI for
              personalized recommendations.
            </p>

            <div className="about-hero-actions">
              <Link to="/products" className="about-primary-btn">
                Explore Products
              </Link>

              <Link to="/assistant" className="about-secondary-btn">
                Ask FitHub AI
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
