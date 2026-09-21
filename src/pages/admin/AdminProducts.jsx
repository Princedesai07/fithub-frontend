import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products", {
        params: {
          page: 1,
          limit: 100
        }
      });

      setProducts(
        response.data.products || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return products;
    }

    return products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const brandName =
        product.brandId?.name?.toLowerCase() || "";

      const categoryName =
        product.categoryId?.name?.toLowerCase() || "";

      return (
        productName.includes(searchValue) ||
        brandName.includes(searchValue) ||
        categoryName.includes(searchValue)
      );
    });
  }, [products, search]);

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product._id);
      setError("");

      await api.delete(
        `/products/${product._id}`
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) =>
            item._id !== product._id
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="admin-products-page">

      <div className="admin-page-header">

        <div>
          <p className="admin-page-eyebrow">
            CATALOGUE
          </p>

          <h1>Products</h1>

          <p>
            Manage the products available in the
            FitHub catalogue.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="admin-primary-button"
        >
          <span>+</span>
          Add Product
        </Link>

      </div>


      <section className="admin-products-toolbar">

        <div className="admin-products-count">

          <strong>
            {products.length}
          </strong>

          <span>
            {products.length === 1
              ? "product"
              : "products"}
          </span>

        </div>

        <div className="admin-search-wrapper">

          <span className="admin-search-icon">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products, brands or categories..."
          />

        </div>

      </section>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      <section className="admin-products-table-card">

        <div className="admin-table-heading">

          <div>
            <h2>Product Catalogue</h2>

            <p>
              View and manage your current FitHub
              products.
            </p>
          </div>

          {search && (
            <span className="admin-search-result">
              {filteredProducts.length} result
              {filteredProducts.length === 1
                ? ""
                : "s"}
            </span>
          )}

        </div>


        {loading ? (
          <div className="admin-message">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              P
            </div>

            <h3>
              {search
                ? "No products found"
                : "No products yet"}
            </h3>

            <p>
              {search
                ? "Try a different search term."
                : "Add your first product to the FitHub catalogue."}
            </p>

            {!search && (
              <Link
                to="/admin/products/new"
                className="admin-primary-button"
              >
                + Add Product
              </Link>
            )}

          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => (
                    <tr key={product._id}>

                      <td>
                        <div className="admin-product-name-cell">

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="admin-product-thumb"
                            />
                          ) : (
                            <div className="admin-product-thumb-placeholder">
                              P
                            </div>
                          )}

                          <div>

                            <strong>
                              {product.name}
                            </strong>

                            {product.productType && (
                              <span>
                                {product.productType}
                              </span>
                            )}

                          </div>

                        </div>
                      </td>


                      <td>
                        {product.brandId?.name ||
                          "—"}
                      </td>


                      <td>
                        {product.categoryId?.name ||
                          "—"}
                      </td>


                      <td>
                        <strong>
                          ₹{product.price}
                        </strong>
                      </td>


                      <td>
                        <span className="admin-rating">
                          ★ {product.rating}
                        </span>
                      </td>


                      <td>

                        <div className="admin-table-actions">

                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="admin-action-button edit"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="admin-action-button delete"
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                            disabled={
                              deletingId ===
                              product._id
                            }
                          >
                            {deletingId ===
                            product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default AdminProducts;