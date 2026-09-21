import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";

import api from "../services/api";

import AdminProducts from "./admin/AdminProducts";
import AdminProductForm from "./admin/AdminProductForm";
import AdminCategories from "./admin/AdminCategories";
import AdminBrands from "./admin/AdminBrands";

import "../styles/admin.css";
import "./AdminLayout.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          productsResponse,
          categoriesResponse,
          brandsResponse
        ] = await Promise.all([
          api.get("/products", {
            params: {
              page: 1,
              limit: 100
            }
          }),
          api.get("/categories"),
          api.get("/brands")
        ]);

        setStats({
          products:
            productsResponse.data.products?.length || 0,

          categories:
            categoriesResponse.data?.length || 0,

          brands:
            brandsResponse.data?.length || 0
        });
      } catch (error) {
        console.error(
          "Unable to load admin statistics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="admin-dashboard-page">

      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">
            OVERVIEW
          </p>

          <h1>Dashboard</h1>

          <p>
            Manage your FitHub fitness catalogue from
            one place.
          </p>
        </div>
      </div>

      <section className="admin-stats-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            P
          </div>

          <div>
            <span>Catalogue</span>

            <strong>
              {loading ? "—" : stats.products}
            </strong>

            <p>Products</p>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            C
          </div>

          <div>
            <span>Organisation</span>

            <strong>
              {loading
                ? "—"
                : stats.categories}
            </strong>

            <p>Categories</p>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            B
          </div>

          <div>
            <span>Catalogue</span>

            <strong>
              {loading
                ? "—"
                : stats.brands}
            </strong>

            <p>Brands</p>
          </div>

        </div>

      </section>


      <section className="admin-quick-section">

        <div className="admin-section-title">

          <p className="admin-page-eyebrow">
            QUICK ACTIONS
          </p>

          <h2>Manage FitHub</h2>

          <p>
            Choose an area to manage your fitness
            catalogue.
          </p>

        </div>


        <div className="admin-quick-grid">

          <NavLink
            to="/admin/products"
            className="admin-quick-card"
          >

            <div className="admin-quick-icon">
              P
            </div>

            <div>

              <h3>Products</h3>

              <p>
                Add, edit and manage products in
                the FitHub catalogue.
              </p>

            </div>

            <span className="admin-card-arrow">
              →
            </span>

          </NavLink>


          <NavLink
            to="/admin/categories"
            className="admin-quick-card"
          >

            <div className="admin-quick-icon">
              C
            </div>

            <div>

              <h3>Categories</h3>

              <p>
                Organise products into useful
                fitness categories.
              </p>

            </div>

            <span className="admin-card-arrow">
              →
            </span>

          </NavLink>


          <NavLink
            to="/admin/brands"
            className="admin-quick-card"
          >

            <div className="admin-quick-icon">
              B
            </div>

            <div>

              <h3>Brands</h3>

              <p>
                Manage the brands available in
                the FitHub catalogue.
              </p>

            </div>

            <span className="admin-card-arrow">
              →
            </span>

          </NavLink>

        </div>

      </section>

    </div>
  );
}


function AdminPlaceholder({
  title,
  description,
  type
}) {
  return (
    <div className="admin-placeholder-page">

      <div className="admin-page-header">

        <div>

          <p className="admin-page-eyebrow">
            {type}
          </p>

          <h1>{title}</h1>

          <p>{description}</p>

        </div>

      </div>


      <div className="admin-coming-card">

        <div className="admin-coming-icon">
          {type === "CATEGORIES"
            ? "C"
            : "B"}
        </div>

        <h2>
          {title} Management
        </h2>

        <p>
          This management section will be added next.
        </p>

      </div>

    </div>
  );
}


function Admin() {
  return (
    <main className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-sidebar-header">

          <div className="admin-logo-mark">
            F
          </div>

          <div>
            <strong>FitHub</strong>
            <span>Admin Panel</span>
          </div>

        </div>


        <nav className="admin-sidebar-nav">

          <p className="admin-nav-label">
            MAIN
          </p>


          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="admin-nav-icon">
              ▦
            </span>

            <span>Dashboard</span>

          </NavLink>


          <p className="admin-nav-label">
            CATALOGUE
          </p>


          <NavLink
            to="/admin/products"
            end
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="admin-nav-icon">
              P
            </span>

            <span>Products</span>

          </NavLink>


          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="admin-nav-icon">
              C
            </span>

            <span>Categories</span>

          </NavLink>


          <NavLink
            to="/admin/brands"
            className={({ isActive }) =>
              `admin-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="admin-nav-icon">
              B
            </span>

            <span>Brands</span>

          </NavLink>

        </nav>


        <div className="admin-sidebar-bottom">

          <NavLink
            to="/"
            className="admin-back-link"
          >

            <span>←</span>

            <span>
              Back to FitHub
            </span>

          </NavLink>

        </div>

      </aside>


      <section className="admin-content">

        <Routes>

          <Route
            index
            element={<AdminDashboard />}
          />


          <Route
            path="products"
            element={<AdminProducts />}
          />


          <Route
            path="products/new"
            element={<AdminProductForm />}
          />


          <Route
            path="products/:id/edit"
            element={<AdminProductForm />}
          />


          <Route
            path="categories"
            element={<AdminCategories />}
          />


          <Route
            path="brands"
            element={<AdminBrands />}
          />

        </Routes>

      </section>

    </main>
  );
}

export default Admin;