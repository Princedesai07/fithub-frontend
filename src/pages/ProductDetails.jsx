import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load this product.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkWishlist = useCallback(async () => {
    if (!isLoggedIn) {
      setIsWishlisted(false);
      return;
    }

    try {
      const response = await api.get("/wishlist");
      const products = response.data.productIds || [];

      const exists = products.some(
        (product) => product._id === id
      );

      setIsWishlisted(exists);
    } catch (error) {
      console.error(error);
    }
  }, [id, isLoggedIn]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    checkWishlist();
  }, [checkWishlist]);

  async function handleWishlist() {
    if (!isLoggedIn) {
      alert("Please login to use your wishlist.");
      return;
    }

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
      } else {
        await api.post("/wishlist", {
          productId: id,
        });

        setIsWishlisted(true);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          <h2>Loading product...</h2>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          <h2>Product not found</h2>

          <p>{error || "This product does not exist."}</p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="primary-btn"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  const brandName = product.brandId?.name || "Unknown Brand";
  const categoryName = product.categoryId?.name || "Fitness";

  const hasEvidence =
    product.qualityEvidence &&
    product.qualityEvidence.length > 0;

  return (
    <main className="product-details-page">
      {/* PRODUCT HERO */}

      <section className="product-details-hero">
        <div className="product-details-container">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-products-link"
          >
            ← Back to Products
          </button>

          <div className="product-details-main">
            {/* IMAGE */}

            <div className="product-details-image">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                />
              ) : (
                <div className="product-details-no-image">
                  No Image Available
                </div>
              )}
            </div>

            {/* BASIC INFORMATION */}

            <div className="product-details-info">
              <p className="product-details-brand">
                {brandName}
              </p>

              <p className="product-details-category">
                {categoryName}
              </p>

              <h1>{product.name}</h1>

              <p className="product-details-description">
                {product.description}
              </p>

              <div className="product-details-rating">
                ⭐ {product.rating} / 5
              </div>

              <div className="product-details-price">
                ₹
                {Number(product.price).toLocaleString("en-IN")}
              </div>

              <div className="product-details-actions">
                <a
                  href={product.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="purchase-btn"
                >
                  Visit Official Store ↗
                </a>

                <button
                  onClick={handleWishlist}
                  className="wishlist-btn"
                  disabled={wishlistLoading}
                >
                  {wishlistLoading
                    ? "Updating..."
                    : isWishlisted
                    ? "♥ Remove from Wishlist"
                    : "♡ Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT INFORMATION */}

      <section className="product-information-section">
        <div className="product-details-container">
          <div className="product-section-heading">
            <p>PRODUCT INFORMATION</p>

            <h2>Everything you need to know</h2>
          </div>

          <div className="product-information-grid">
            {/* FEATURES */}

            <div className="product-info-box">
              <h3>Features</h3>

              {product.features?.length > 0 ? (
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              ) : (
                <p>No features listed.</p>
              )}
            </div>

            {/* BENEFITS */}

            <div className="product-info-box">
              <h3>Benefits</h3>

              {product.benefits?.length > 0 ? (
                <ul>
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>✓ {benefit}</li>
                  ))}
                </ul>
              ) : (
                <p>No benefits listed.</p>
              )}
            </div>

            {/* SUITABLE FOR */}

            <div className="product-info-box">
              <h3>Suitable For</h3>

              {product.suitableFor?.length > 0 ? (
                <ul>
                  {product.suitableFor.map((item, index) => (
                    <li key={index}>✓ {item}</li>
                  ))}
                </ul>
              ) : (
                <p>Information not available.</p>
              )}
            </div>

            {/* EXPERIENCE */}

            <div className="product-info-box">
              <h3>Experience Level</h3>

              {product.experienceLevels?.length > 0 ? (
                <div className="experience-tags">
                  {product.experienceLevels.map((level) => (
                    <span key={level}>{level}</span>
                  ))}
                </div>
              ) : (
                <p>Information not available.</p>
              )}
            </div>
          </div>

          {/* SPECIFICATIONS */}

          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="product-specifications">
                <h3>Specifications</h3>

                <div className="specifications-list">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        className="specification-row"
                        key={key}
                      >
                        <span>{key}</span>
                        <strong>{value}</strong>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* NUTRITION */}

          {product.nutrition && (
            <div className="nutrition-section">
              <h3>Nutrition Information</h3>

              <div className="nutrition-grid">
                {product.nutrition.servingSize && (
                  <div>
                    <span>Serving Size</span>
                    <strong>
                      {product.nutrition.servingSize}
                    </strong>
                  </div>
                )}

                {product.nutrition.calories !== undefined && (
                  <div>
                    <span>Calories</span>
                    <strong>
                      {product.nutrition.calories} kcal
                    </strong>
                  </div>
                )}

                {product.nutrition.protein !== undefined && (
                  <div>
                    <span>Protein</span>
                    <strong>
                      {product.nutrition.protein} g
                    </strong>
                  </div>
                )}

                {product.nutrition.carbohydrates !==
                  undefined && (
                  <div>
                    <span>Carbohydrates</span>
                    <strong>
                      {product.nutrition.carbohydrates} g
                    </strong>
                  </div>
                )}

                {product.nutrition.fat !== undefined && (
                  <div>
                    <span>Fat</span>
                    <strong>
                      {product.nutrition.fat} g
                    </strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QUALITY EVIDENCE */}

          <div className="quality-evidence-section">
            <div className="quality-evidence-header">
              <div>
                <p className="evidence-tag">
                  QUALITY & EVIDENCE
                </p>

                <h2>Why is this product on FitHub?</h2>

                <p>
                  We show documented quality information
                  where available instead of treating
                  every product as automatically verified.
                </p>
              </div>

              <div
                className={
                  hasEvidence
                    ? "evidence-status verified"
                    : "evidence-status unavailable"
                }
              >
                {hasEvidence
                  ? "Evidence Available"
                  : "No Evidence Added"}
              </div>
            </div>

            {hasEvidence ? (
              <div className="evidence-list">
                {product.qualityEvidence.map(
                  (evidence, index) => (
                    <div
                      className="evidence-card"
                      key={index}
                    >
                      <div className="evidence-card-top">
                        <div>
                          <h3>{evidence.source}</h3>
                          <p>{evidence.type}</p>
                        </div>

                        <span
                          className={`evidence-badge ${evidence.status}`}
                        >
                          {evidence.status}
                        </span>
                      </div>

                      <div className="evidence-details">
                        {evidence.laboratory && (
                          <div>
                            <span>Laboratory</span>
                            <strong>
                              {evidence.laboratory}
                            </strong>
                          </div>
                        )}

                        {evidence.batchNumber && (
                          <div>
                            <span>Batch</span>
                            <strong>
                              {evidence.batchNumber}
                            </strong>
                          </div>
                        )}

                        {evidence.publishedDate && (
                          <div>
                            <span>Published</span>
                            <strong>
                              {new Date(
                                evidence.publishedDate
                              ).toLocaleDateString()}
                            </strong>
                          </div>
                        )}
                      </div>

                      {evidence.notes && (
                        <p className="evidence-notes">
                          {evidence.notes}
                        </p>
                      )}

                      {evidence.reportUrl && (
                        <a
                          href={evidence.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="evidence-report-link"
                        >
                          View Evidence / Report ↗
                        </a>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="no-evidence-box">
                <strong>
                  No documented evidence has been added
                  for this product yet.
                </strong>

                <p>
                  This does not mean the product is unsafe
                  or low quality. It means FitHub currently
                  does not have documented evidence to
                  display.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;