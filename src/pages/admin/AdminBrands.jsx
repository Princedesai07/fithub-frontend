import { useEffect, useMemo, useState } from "react";

import api from "../../services/api";

function AdminBrands() {
  const [brands, setBrands] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingBrand, setEditingBrand] =
    useState(null);

  const [brandName, setBrandName] =
    useState("");

  async function fetchBrands() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/brands");

      setBrands(response.data || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load brands."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return brands;
    }

    return brands.filter((brand) =>
      brand.name
        ?.toLowerCase()
        .includes(searchValue)
    );
  }, [brands, search]);

  function openAddForm() {
    setEditingBrand(null);
    setBrandName("");
    setError("");
    setSuccess("");
  }

  function openEditForm(brand) {
    setEditingBrand(brand);
    setBrandName(brand.name || "");
    setError("");
    setSuccess("");
  }

  function closeForm() {
    setEditingBrand(null);
    setBrandName("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName =
      brandName.trim();

    if (!trimmedName) {
      setError(
        "Brand name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingBrand) {
        const response =
          await api.put(
            `/brands/${editingBrand._id}`,
            {
              name: trimmedName
            }
          );

        setBrands((currentBrands) =>
          currentBrands
            .map((brand) =>
              brand._id ===
              editingBrand._id
                ? response.data
                : brand
            )
            .sort((a, b) =>
              a.name.localeCompare(b.name)
            )
        );

        setSuccess(
          "Brand updated successfully."
        );
      } else {
        const response =
          await api.post(
            "/brands",
            {
              name: trimmedName
            }
          );

        setBrands((currentBrands) =>
          [...currentBrands, response.data].sort(
            (a, b) =>
              a.name.localeCompare(b.name)
          )
        );

        setSuccess(
          "Brand created successfully."
        );
      }

      setBrandName("");
      setEditingBrand(null);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to save brand."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(brand) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${brand.name}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(brand._id);
      setError("");
      setSuccess("");

      await api.delete(
        `/brands/${brand._id}`
      );

      setBrands((currentBrands) =>
        currentBrands.filter(
          (item) =>
            item._id !== brand._id
        )
      );

      if (
        editingBrand?._id ===
        brand._id
      ) {
        closeForm();
      }

      setSuccess(
        "Brand deleted successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to delete brand."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="admin-brands-page">

      <div className="admin-page-header">

        <div>
          <p className="admin-page-eyebrow">
            CATALOGUE
          </p>

          <h1>Brands</h1>

          <p>
            Manage the brands available across
            the FitHub catalogue.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddForm}
        >
          <span>+</span>
          Add Brand
        </button>

      </div>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-success">
          {success}
        </div>
      )}


      <section className="admin-brand-management">

        <div className="admin-brand-form-card">

          <div className="admin-table-heading">

            <div>
              <h2>
                {editingBrand
                  ? "Edit Brand"
                  : "Add Brand"}
              </h2>

              <p>
                {editingBrand
                  ? "Update the brand name."
                  : "Create a new brand for your catalogue."}
              </p>
            </div>

          </div>


          <form
            className="admin-brand-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-group">

              <label htmlFor="brandName">
                Brand Name
              </label>

              <input
                id="brandName"
                type="text"
                value={brandName}
                onChange={(event) =>
                  setBrandName(
                    event.target.value
                  )
                }
                placeholder="Example: Decathlon"
                autoFocus
              />

            </div>


            <div className="admin-brand-form-actions">

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingBrand
                    ? "Update Brand"
                    : "Create Brand"}
              </button>

              {editingBrand && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>


        <div className="admin-brands-list-card">

          <div className="admin-table-heading">

            <div>
              <h2>Brand List</h2>

              <p>
                View and manage your current
                FitHub brands.
              </p>
            </div>

            <div className="admin-products-count">

              <strong>
                {brands.length}
              </strong>

              <span>
                {brands.length === 1
                  ? "brand"
                  : "brands"}
              </span>

            </div>

          </div>


          <div className="admin-search-wrapper admin-brand-search">

            <span className="admin-search-icon">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search brands..."
            />

          </div>


          {loading ? (
            <div className="admin-message">
              Loading brands...
            </div>
          ) : filteredBrands.length ===
            0 ? (
            <div className="admin-empty-state">

              <div className="admin-empty-icon">
                B
              </div>

              <h3>
                {search
                  ? "No brands found"
                  : "No brands yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "Create your first brand for the FitHub catalogue."}
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Brand Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredBrands.map(
                    (brand) => (
                      <tr key={brand._id}>

                        <td>
                          <div className="admin-brand-name-cell">

                            <div className="admin-brand-icon">
                              B
                            </div>

                            <strong>
                              {brand.name}
                            </strong>

                          </div>
                        </td>


                        <td>

                          <div className="admin-table-actions">

                            <button
                              type="button"
                              className="admin-action-button edit"
                              onClick={() =>
                                openEditForm(
                                  brand
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-action-button delete"
                              onClick={() =>
                                handleDelete(
                                  brand
                                )
                              }
                              disabled={
                                deletingId ===
                                brand._id
                              }
                            >
                              {deletingId ===
                              brand._id
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

        </div>

      </section>

    </div>
  );
}

export default AdminBrands;