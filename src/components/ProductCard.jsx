import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

function ProductCard({ product }) {
  const { addToCompare, removeFromCompare, isInCompare, compareProducts } =
    useCompare();

  const selected = isInCompare(product._id);

  const canCompare =
    compareProducts.length === 0 ||
    compareProducts[0].comparisonGroup === product.comparisonGroup;

  function handleCompare() {
    if (selected) {
      removeFromCompare(product._id);
      return;
    }

    if (compareProducts.length >= 5) {
      alert("You can compare up to 5 products.");
      return;
    }

    addToCompare(product);
  }

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brandId?.name || "Brand"}</p>

        <h3>{product.name}</h3>

        <div className="product-rating">⭐ {product.rating}</div>

        <p className="product-price">₹{product.price}</p>

        <div className="product-card-actions">
          <Link to={`/products/${product._id}`} className="view-product-btn">
            View Product
          </Link>

          <button
            onClick={handleCompare}
            disabled={!selected && !canCompare}
            className={`compare-select-btn ${selected ? "selected" : ""}`}
          >
            {selected
              ? "✓ Selected"
              : !canCompare
                ? "Not compatible"
                : "⚖ Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
