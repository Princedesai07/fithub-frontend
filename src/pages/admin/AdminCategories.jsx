import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [categoryName, setCategoryName] =
    useState("");

  async function fetchCategories() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/categories");

      setCategories(response.data || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return categories;
    }

    return categories.filter((category) =>
      category.name
        ?.toLowerCase()
        .includes(searchValue)
    );
  }, [categories, search]);

  function openAddForm() {
    setEditingCategory(null);
    setCategoryName("");
    setError("");
    setSuccess("");
  }

  function openEditForm(category) {
    setEditingCategory(category);
    setCategoryName(category.name || "");
    setError("");
    setSuccess("");
  }

  function closeForm() {
    setEditingCategory(null);
    setCategoryName("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName =
      categoryName.trim();

    if (!trimmedName) {
      setError(
        "Category name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingCategory) {
        const response =
          await api.put(
            `/categories/${editingCategory._id}`,
            {
              name: trimmedName
            }
          );

        setCategories((currentCategories) =>
          currentCategories.map(
            (category) =>
              category._id ===
              editingCategory._id
                ? response.data
                : category
          )
        );

        setSuccess(
          "Category updated successfully."
        );
      } else {
        const response =
          await api.post(
            "/categories",
            {
              name: trimmedName
            }
          );

        setCategories((currentCategories) =>
          [...currentCategories, response.data].sort(
            (a, b) =>
              a.name.localeCompare(b.name)
          )
        );

        setSuccess(
          "Category created successfully."
        );
      }

      setCategoryName("");

      setEditingCategory(null);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${category.name}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category._id);
      setError("");
      setSuccess("");

      await api.delete(
        `/categories/${category._id}`
      );

      setCategories((currentCategories) =>
        currentCategories.filter(
          (item) =>
            item._id !== category._id
        )
      );

      if (
        editingCategory?._id ===
        category._id
      ) {
        closeForm();
      }

      setSuccess(
        "Category deleted successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to delete category."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="admin-categories-page">

      <div className="admin-page-header">

        <div>
          <p className="admin-page-eyebrow">
            CATALOGUE
          </p>

          <h1>Categories</h1>

          <p>
            Manage the categories used across
            the FitHub catalogue.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddForm}
        >
          <span>+</span>
          Add Category
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


      <section className="admin-category-management">

        <div className="admin-category-form-card">

          <div className="admin-table-heading">

            <div>
              <h2>
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p>
                {editingCategory
                  ? "Update the category name."
                  : "Create a new category for your catalogue."}
              </p>
            </div>

          </div>


          <form
            className="admin-category-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-group">

              <label htmlFor="categoryName">
                Category Name
              </label>

              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(
                    event.target.value
                  )
                }
                placeholder="Example: Gym Equipment"
                autoFocus
              />

            </div>


            <div className="admin-category-form-actions">

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingCategory
                    ? "Update Category"
                    : "Create Category"}
              </button>

              {editingCategory && (
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


        <div className="admin-categories-list-card">

          <div className="admin-table-heading">

            <div>
              <h2>Category List</h2>

              <p>
                View and manage your current
                FitHub categories.
              </p>
            </div>

            <div className="admin-products-count">

              <strong>
                {categories.length}
              </strong>

              <span>
                {categories.length === 1
                  ? "category"
                  : "categories"}
              </span>

            </div>

          </div>


          <div className="admin-search-wrapper admin-category-search">

            <span className="admin-search-icon">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search categories..."
            />

          </div>


          {loading ? (
            <div className="admin-message">
              Loading categories...
            </div>
          ) : filteredCategories.length ===
            0 ? (
            <div className="admin-empty-state">

              <div className="admin-empty-icon">
                C
              </div>

              <h3>
                {search
                  ? "No categories found"
                  : "No categories yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "Create your first category for the FitHub catalogue."}
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredCategories.map(
                    (category) => (
                      <tr
                        key={category._id}
                      >

                        <td>
                          <div className="admin-category-name-cell">

                            <div className="admin-category-icon">
                              C
                            </div>

                            <strong>
                              {category.name}
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
                                  category
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
                                  category
                                )
                              }
                              disabled={
                                deletingId ===
                                category._id
                              }
                            >
                              {deletingId ===
                              category._id
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

export default AdminCategories;