import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const categoryFromUrl =
    searchParams.get("category") || "All";

  const evidenceFromUrl =
    searchParams.get("evidence") || "All";

  const searchFromUrl =
    searchParams.get("search") || "";

  const brandFromUrl =
    searchParams.get("brand") || "All";

  const ratingFromUrl =
    searchParams.get("rating") || "All";

  const sortFromUrl =
    searchParams.get("sort") || "default";

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState(searchFromUrl);

  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromUrl);

  const [selectedBrand, setSelectedBrand] =
    useState(brandFromUrl);

  const [selectedRating, setSelectedRating] =
    useState(ratingFromUrl);

  const [selectedEvidence, setSelectedEvidence] =
    useState(
      evidenceFromUrl === "verified"
        ? "Verified"
        : evidenceFromUrl === "no-evidence"
        ? "No Evidence"
        : "All"
    );

  const [sortBy, setSortBy] =
    useState(sortFromUrl);

  /*
   * FETCH PRODUCTS
   */
  useEffect(() => {
    fetchProducts();
  }, []);

  /*
   * SYNC FILTER STATE WITH URL
   */
  useEffect(() => {
    setSearch(searchFromUrl);
    setSelectedCategory(categoryFromUrl);
    setSelectedBrand(brandFromUrl);
    setSelectedRating(ratingFromUrl);
    setSortBy(sortFromUrl);

    if (evidenceFromUrl === "verified") {
      setSelectedEvidence("Verified");
    } else if (evidenceFromUrl === "no-evidence") {
      setSelectedEvidence("No Evidence");
    } else {
      setSelectedEvidence("All");
    }
  }, [
    searchFromUrl,
    categoryFromUrl,
    brandFromUrl,
    ratingFromUrl,
    evidenceFromUrl,
    sortFromUrl,
  ]);

  /*
   * UPDATE URL WHEN FILTERS CHANGE
   */
  useEffect(() => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (selectedCategory !== "All") {
      params.category = selectedCategory;
    }

    if (selectedBrand !== "All") {
      params.brand = selectedBrand;
    }

    if (selectedRating !== "All") {
      params.rating = selectedRating;
    }

    if (selectedEvidence === "Verified") {
      params.evidence = "verified";
    }

    if (selectedEvidence === "No Evidence") {
      params.evidence = "no-evidence";
    }

    if (sortBy !== "default") {
      params.sort = sortBy;
    }

    const currentParams =
      searchParams.toString();

    const newParams =
      new URLSearchParams(params).toString();

    if (currentParams !== newParams) {
      setSearchParams(params, {
        replace: true,
      });
    }
  }, [
    search,
    selectedCategory,
    selectedBrand,
    selectedRating,
    selectedEvidence,
    sortBy,
    searchParams,
    setSearchParams,
  ]);

  /*
   * FETCH PRODUCTS
   */
  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/products?limit=100"
        );

      setProducts(
        response.data.products || []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load products. Please make sure the FitHub backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * CATEGORY OPTIONS
   */
  const categories =
    useMemo(() => {
      const names =
        products
          .map(
            (product) =>
              product.categoryId?.name
          )
          .filter(Boolean);

      return [
        "All",
        ...new Set(names),
      ];
    }, [products]);

  /*
   * BRAND OPTIONS
   */
  const brands =
    useMemo(() => {
      const names =
        products
          .map(
            (product) =>
              product.brandId?.name
          )
          .filter(Boolean);

      return [
        "All",
        ...new Set(names),
      ];
    }, [products]);

  /*
   * FILTER + SORT PRODUCTS
   */
  const filteredProducts =
    useMemo(() => {
      let result = [...products];

      if (search.trim()) {
        const searchText =
          search.toLowerCase();

        result =
          result.filter(
            (product) => {
              return (
                product.name
                  ?.toLowerCase()
                  .includes(searchText) ||
                product.description
                  ?.toLowerCase()
                  .includes(searchText) ||
                product.productType
                  ?.toLowerCase()
                  .includes(searchText) ||
                product.subcategory
                  ?.toLowerCase()
                  .includes(searchText) ||
                product.brandId?.name
                  ?.toLowerCase()
                  .includes(searchText) ||
                product.categoryId?.name
                  ?.toLowerCase()
                  .includes(searchText) ||
                product.tags?.some(
                  (tag) =>
                    tag
                      .toLowerCase()
                      .includes(searchText)
                )
              );
            }
          );
      }

      if (selectedCategory !== "All") {
        result =
          result.filter(
            (product) =>
              product.categoryId?.name ===
              selectedCategory
          );
      }

      if (selectedBrand !== "All") {
        result =
          result.filter(
            (product) =>
              product.brandId?.name ===
              selectedBrand
          );
      }

      if (selectedRating !== "All") {
        const rating =
          Number(selectedRating);

        result =
          result.filter(
            (product) =>
              product.rating >= rating
          );
      }

      if (selectedEvidence === "Verified") {
        result =
          result.filter(
            (product) =>
              product.qualityEvidence &&
              product.qualityEvidence.length > 0
          );
      }

      if (selectedEvidence === "No Evidence") {
        result =
          result.filter(
            (product) =>
              !product.qualityEvidence ||
              product.qualityEvidence.length === 0
          );
      }

      if (sortBy === "price-low") {
        result.sort(
          (a, b) =>
            a.price - b.price
        );
      }

      if (sortBy === "price-high") {
        result.sort(
          (a, b) =>
            b.price - a.price
        );
      }

      if (sortBy === "rating") {
        result.sort(
          (a, b) =>
            b.rating - a.rating
        );
      }

      if (sortBy === "name") {
        result.sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );
      }

      return result;
    }, [
      products,
      search,
      selectedCategory,
      selectedBrand,
      selectedRating,
      selectedEvidence,
      sortBy,
    ]);

  /*
   * GROUP PRODUCTS BY CATEGORY
   */
  const groupedProducts =
    useMemo(() => {
      const groups = {};

      filteredProducts.forEach(
        (product) => {
          const category =
            product.categoryId?.name ||
            "Other";

          if (!groups[category]) {
            groups[category] = [];
          }

          groups[category].push(product);
        }
      );

      return groups;
    }, [filteredProducts]);

  /*
   * CLEAR FILTERS
   */
  function clearFilters() {
    setSearch("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedRating("All");
    setSelectedEvidence("All");
    setSortBy("default");
  }

  return (
    <main className="products-page">
      <section className="products-header">
        <div>
          <p className="page-tag">
            FITNESS PRODUCTS
          </p>

          <h1>
            Explore Products
          </h1>

          <p>
            Discover fitness products
            from different brands for
            training, nutrition,
            recovery and everyday
            fitness.
          </p>
        </div>
      </section>

      <section className="products-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Category</label>

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
            >
              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>Brand</label>

            <select
              value={selectedBrand}
              onChange={(event) =>
                setSelectedBrand(
                  event.target.value
                )
              }
            >
              {brands.map(
                (brand) => (
                  <option
                    key={brand}
                    value={brand}
                  >
                    {brand}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>Rating</label>

            <select
              value={selectedRating}
              onChange={(event) =>
                setSelectedRating(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Ratings
              </option>

              <option value="4">
                4.0+ ⭐
              </option>

              <option value="4.5">
                4.5+ ⭐
              </option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              Quality Evidence
            </label>

            <select
              value={selectedEvidence}
              onChange={(event) =>
                setSelectedEvidence(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Products
              </option>

              <option value="Verified">
                With Evidence
              </option>

              <option value="No Evidence">
                No Evidence
              </option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort</label>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
              }
            >
              <option value="default">
                Default
              </option>

              <option value="rating">
                Rating: High to Low
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name">
                Name: A-Z
              </option>
            </select>
          </div>
        </div>

        <div className="products-results-row">
          <p>
            Showing{" "}
            <strong>
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            {products.length}{" "}
            products
          </p>

          {(search ||
            selectedCategory !== "All" ||
            selectedBrand !== "All" ||
            selectedRating !== "All" ||
            selectedEvidence !== "All" ||
            sortBy !== "default") && (
            <button
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      <section className="products-container">
        {loading && (
          <div className="products-message">
            <h2>
              Loading products...
            </h2>
          </div>
        )}

        {!loading &&
          error && (
            <div className="products-message error-message">
              <h2>
                Something went wrong
              </h2>

              <p>
                {error}
              </p>

              <button
                onClick={fetchProducts}
                className="primary-btn"
              >
                Try Again
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="products-message">
              <h2>
                No products found
              </h2>

              <p>
                Try changing your
                search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="primary-btn"
              >
                Clear Filters
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="category-product-sections">
              {Object.entries(
                groupedProducts
              ).map(
                ([
                  category,
                  categoryProducts,
                ]) => (
                  <section
                    className="product-category-section"
                    key={category}
                  >
                    <div className="category-section-header">
                      <div>
                        <p className="category-section-tag">
                          CATEGORY
                        </p>

                        <h2>
                          {category}
                        </h2>
                      </div>

                      <span>
                        {categoryProducts.length}{" "}
                        {categoryProducts.length === 1
                          ? "product"
                          : "products"}
                      </span>
                    </div>

                    <div className="products-grid">
                      {categoryProducts.map(
                        (product) => (
                          <ProductCard
                            key={
                              product._id
                            }
                            product={
                              product
                            }
                          />
                        )
                      )}
                    </div>
                  </section>
                )
              )}
            </div>
          )}
      </section>
    </main>
  );
}

export default Products;
