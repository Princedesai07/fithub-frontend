import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wishlist");

      const products = response.data.productIds || [];

      setWishlist(products);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Unable to load your wishlist.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(productId) {
    try {
      await api.delete(`/wishlist/${productId}`);

      setWishlist((currentWishlist) =>
        currentWishlist.filter((product) => product._id !== productId),
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to remove product from wishlist.",
      );
    }
  }

  return (
    <main className="wishlist-page">
      <section className="wishlist-header">
        <div>
          <p className="page-tag">YOUR COLLECTION</p>

          <h1>My Wishlist</h1>

          <p>Save fitness products you want to compare or explore later.</p>
        </div>
      </section>

      <section className="wishlist-container">
        {loading && (
          <div className="wishlist-message">
            <h2>Loading wishlist...</h2>
          </div>
        )}

        {!loading && error && (
          <div className="wishlist-message error-message">
            <h2>Something went wrong</h2>
            <p>{error}</p>

            <button onClick={fetchWishlist} className="primary-btn">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && wishlist.length === 0 && (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">♡</div>

            <h2>Your wishlist is empty</h2>

            <p>
              Save products you are interested in and they will appear here.
            </p>

            <Link to="/products" className="primary-btn">
              Explore Products
            </Link>
          </div>
        )}

        {!loading && !error && wishlist.length > 0 && (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div className="wishlist-card" key={product._id}>
                <div className="wishlist-card-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>

                <div className="wishlist-card-info">
                  <p className="product-brand">
                    {product.brandId?.name || "Brand"}
                  </p>

                  <h3>{product.name}</h3>

                  <div className="product-rating">⭐ {product.rating}</div>

                  <p className="product-price">₹{product.price}</p>

                  <div className="wishlist-card-actions">
                    <Link
                      to={`/products/${product._id}`}
                      className="view-product-btn"
                    >
                      View Product
                    </Link>

                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="remove-wishlist-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Wishlist;
