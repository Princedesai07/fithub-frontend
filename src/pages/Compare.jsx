import { useCompare } from "../context/CompareContext";

function Compare() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  if (compareProducts.length === 0) {
    return (
      <div className="page-container">
        <h1>Compare Products</h1>

        <p>Select products from the Products page to compare them.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="compare-header">
        <div>
          <h1>Compare Products</h1>

          <p>Compare products side by side.</p>
        </div>

        <button onClick={clearCompare} className="clear-compare-btn">
          Clear All
        </button>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>

              {compareProducts.map((product) => (
                <th key={product._id}>
                  <div className="compare-product-heading">
                    <h2>{product.name}</h2>

                    <button
                      onClick={() => removeFromCompare(product._id)}
                      className="remove-compare-btn"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Brand</td>

              {compareProducts.map((product) => (
                <td key={product._id}>{product.brandId?.name || "N/A"}</td>
              ))}
            </tr>

            <tr>
              <td>Price</td>

              {compareProducts.map((product) => (
                <td key={product._id}>₹{product.price}</td>
              ))}
            </tr>

            <tr>
              <td>Rating</td>

              {compareProducts.map((product) => (
                <td key={product._id}>⭐ {product.rating}</td>
              ))}
            </tr>

            <tr>
              <td>Product Type</td>

              {compareProducts.map((product) => (
                <td key={product._id}>{product.productType || "N/A"}</td>
              ))}
            </tr>

            <tr>
              <td>Subcategory</td>

              {compareProducts.map((product) => (
                <td key={product._id}>{product.subcategory || "N/A"}</td>
              ))}
            </tr>

            <tr>
              <td>Suitable For</td>

              {compareProducts.map((product) => (
                <td key={product._id}>
                  {product.suitableFor?.length
                    ? product.suitableFor.join(", ")
                    : "N/A"}
                </td>
              ))}
            </tr>

            <tr>
              <td>Experience Level</td>

              {compareProducts.map((product) => (
                <td key={product._id}>
                  {product.experienceLevels?.length
                    ? product.experienceLevels.join(", ")
                    : "N/A"}
                </td>
              ))}
            </tr>

            <tr>
              <td>Features</td>

              {compareProducts.map((product) => (
                <td key={product._id}>
                  {product.features?.length ? (
                    <ul className="compare-list">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>Benefits</td>

              {compareProducts.map((product) => (
                <td key={product._id}>
                  {product.benefits?.length ? (
                    <ul className="compare-list">
                      {product.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>Quality Evidence</td>

              {compareProducts.map((product) => (
                <td key={product._id}>
                  {product.qualityEvidence?.length > 0 ? (
                    <div className="quality-evidence">
                      {product.qualityEvidence.map((evidence, index) => (
                        <div key={index} className="quality-evidence-item">
                          <p>
                            <strong>Source:</strong> {evidence.source || "N/A"}
                          </p>

                          <p>
                            <strong>Status:</strong> {evidence.status || "N/A"}
                          </p>

                          <p>
                            <strong>Laboratory:</strong>{" "}
                            {evidence.laboratory || "N/A"}
                          </p>

                          <p>
                            <strong>Batch:</strong>{" "}
                            {evidence.batchNumber || "N/A"}
                          </p>

                          <p>
                            <strong>Published:</strong>{" "}
                            {evidence.publishedDate
                              ? new Date(
                                  evidence.publishedDate,
                                ).toLocaleDateString("en-IN")
                              : "N/A"}
                          </p>

                          {evidence.notes && (
                            <p>
                              <strong>Notes:</strong> {evidence.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>No documented quality evidence available.</span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>Specifications</td>

              {compareProducts.map((product) => (
                <td key={product._id}>
                  {product.specifications &&
                  Object.keys(product.specifications).length > 0 ? (
                    <ul className="compare-list">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {value}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>Nutrition</td>

              {compareProducts.map((product) => (
                <td key={product._id}>
                  {product.nutrition &&
                  Object.keys(product.nutrition).length > 0 ? (
                    <ul className="compare-list">
                      {Object.entries(product.nutrition).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>Official Purchase</td>

              {compareProducts.map((product) => (
                <td key={product._id}>
                  <a
                    href={product.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="purchase-link"
                  >
                    Visit Official Site
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Compare;
