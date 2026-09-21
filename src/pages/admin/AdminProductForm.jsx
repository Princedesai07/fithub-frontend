import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  rating: "",

  comparisonGroup: "",
  productType: "",
  subcategory: "",
  certification: "",

  features: "",
  suitableFor: "",
  experienceLevels: "",
  tags: "",
  benefits: "",

  image: "",
  purchaseLink: "",

  categoryId: "",
  brandId: "",

  specifications: "",

  servingSize: "",
  calories: "",
  protein: "",
  carbohydrates: "",
  fat: "",

  evidenceSource: "",
  evidenceType: "",
  evidenceStatus: "",
  evidenceLaboratory: "",
  evidenceBatchNumber: "",
  evidencePublishedDate: "",
  evidenceReportUrl: "",
  evidenceNotes: ""
};

function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialForm);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const requests = [
        api.get("/brands"),
        api.get("/categories")
      ];

      if (isEditMode) {
        requests.push(api.get(`/products/${id}`));
      }

      const responses = await Promise.all(requests);

      setBrands(responses[0].data || []);
      setCategories(responses[1].data || []);

      if (isEditMode) {
        populateForm(responses[2].data);
      }
    } catch (error) {
      console.error(
        "Unable to load product form data:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load product information."
      );
    } finally {
      setLoading(false);
    }
  }

  function populateForm(product) {
    const specifications =
      product.specifications || {};

    const specificationText =
      Object.entries(specifications)
        .map(
          ([key, value]) =>
            `${key}: ${value}`
        )
        .join("\n");

    const nutrition =
      product.nutrition || {};

    const qualityEvidence =
      product.qualityEvidence?.[0] || {};

    setForm({
      name: product.name || "",

      description:
        product.description || "",

      price:
        product.price !== undefined
          ? product.price
          : "",

      rating:
        product.rating !== undefined
          ? product.rating
          : "",

      comparisonGroup:
        product.comparisonGroup || "",

      productType:
        product.productType || "",

      subcategory:
        product.subcategory || "",

      certification:
        product.certification || "",

      features:
        Array.isArray(product.features)
          ? product.features.join(", ")
          : "",

      suitableFor:
        Array.isArray(product.suitableFor)
          ? product.suitableFor.join(", ")
          : "",

      experienceLevels:
        Array.isArray(product.experienceLevels)
          ? product.experienceLevels.join(", ")
          : "",

      tags:
        Array.isArray(product.tags)
          ? product.tags.join(", ")
          : "",

      benefits:
        Array.isArray(product.benefits)
          ? product.benefits.join(", ")
          : "",

      image:
        product.image || "",

      purchaseLink:
        product.purchaseLink || "",

      categoryId:
        product.categoryId?._id ||
        product.categoryId ||
        "",

      brandId:
        product.brandId?._id ||
        product.brandId ||
        "",

      specifications:
        specificationText,

      servingSize:
        nutrition.servingSize || "",

      calories:
        nutrition.calories !== undefined
          ? nutrition.calories
          : "",

      protein:
        nutrition.protein !== undefined
          ? nutrition.protein
          : "",

      carbohydrates:
        nutrition.carbohydrates !== undefined
          ? nutrition.carbohydrates
          : "",

      fat:
        nutrition.fat !== undefined
          ? nutrition.fat
          : "",

      evidenceSource:
        qualityEvidence.source || "",

      evidenceType:
        qualityEvidence.type || "",

      evidenceStatus:
        qualityEvidence.status || "",

      evidenceLaboratory:
        qualityEvidence.laboratory || "",

      evidenceBatchNumber:
        qualityEvidence.batchNumber || "",

      evidencePublishedDate:
        qualityEvidence.publishedDate
          ? qualityEvidence.publishedDate.substring(
              0,
              10
            )
          : "",

      evidenceReportUrl:
        qualityEvidence.reportUrl || "",

      evidenceNotes:
        qualityEvidence.notes || ""
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  function buildArray(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function buildSpecifications(value) {
    const specifications = {};

    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const separatorIndex =
          line.indexOf(":");

        if (separatorIndex === -1) {
          return;
        }

        const key = line
          .substring(0, separatorIndex)
          .trim();

        const specificationValue =
          line
            .substring(separatorIndex + 1)
            .trim();

        if (key && specificationValue) {
          specifications[key] =
            specificationValue;
        }
      });

    return specifications;
  }

  function buildNutrition() {
    const hasNutrition =
      form.servingSize ||
      form.calories !== "" ||
      form.protein !== "" ||
      form.carbohydrates !== "" ||
      form.fat !== "";

    if (!hasNutrition) {
      return undefined;
    }

    return {
      servingSize:
        form.servingSize.trim(),

      calories:
        form.calories === ""
          ? undefined
          : Number(form.calories),

      protein:
        form.protein === ""
          ? undefined
          : Number(form.protein),

      carbohydrates:
        form.carbohydrates === ""
          ? undefined
          : Number(form.carbohydrates),

      fat:
        form.fat === ""
          ? undefined
          : Number(form.fat)
    };
  }

  function buildQualityEvidence() {
    const hasEvidence =
      form.evidenceSource ||
      form.evidenceType ||
      form.evidenceStatus ||
      form.evidenceLaboratory ||
      form.evidenceBatchNumber ||
      form.evidencePublishedDate ||
      form.evidenceReportUrl ||
      form.evidenceNotes;

    if (!hasEvidence) {
      return [];
    }

    return [
      {
        source:
          form.evidenceSource.trim(),

        type:
          form.evidenceType.trim(),

        status:
          form.evidenceStatus.trim(),

        laboratory:
          form.evidenceLaboratory.trim(),

        batchNumber:
          form.evidenceBatchNumber.trim(),

        publishedDate:
          form.evidencePublishedDate
            ? new Date(
                `${form.evidencePublishedDate}T00:00:00`
              )
            : undefined,

        reportUrl:
          form.evidenceReportUrl.trim(),

        notes:
          form.evidenceNotes.trim()
      }
    ];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const productData = {
        name: form.name.trim(),

        description:
          form.description.trim(),

        price:
          Number(form.price),

        rating:
          Number(form.rating),

        comparisonGroup:
          form.comparisonGroup.trim(),

        productType:
          form.productType.trim(),

        subcategory:
          form.subcategory.trim(),

        certification:
          form.certification.trim(),

        qualityEvidence:
          buildQualityEvidence(),

        specifications:
          buildSpecifications(
            form.specifications
          ),

        nutrition:
          buildNutrition(),

        features:
          buildArray(form.features),

        suitableFor:
          buildArray(form.suitableFor),

        experienceLevels:
          buildArray(
            form.experienceLevels
          ),

        tags:
          buildArray(form.tags),

        benefits:
          buildArray(form.benefits),

        image:
          form.image.trim(),

        purchaseLink:
          form.purchaseLink.trim(),

        categoryId:
          form.categoryId,

        brandId:
          form.brandId
      };

      if (isEditMode) {
        await api.put(
          `/products/${id}`,
          productData
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        await api.post(
          "/products",
          productData
        );

        setSuccess(
          "Product created successfully."
        );
      }

      setTimeout(() => {
        navigate("/admin/products");
      }, 700);
    } catch (error) {
      console.error(
        "Unable to save product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-form-page">
        <div className="admin-message">
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-form-page">

      <div className="admin-page-header">

        <div>
          <p className="admin-page-eyebrow">
            CATALOGUE
          </p>

          <h1>
            {isEditMode
              ? "Edit Product"
              : "Add Product"}
          </h1>

          <p>
            {isEditMode
              ? "Update the information for this FitHub product."
              : "Add a new product to the FitHub catalogue."}
          </p>
        </div>

        <Link
          to="/admin/products"
          className="admin-secondary-button"
        >
          ← Back to Products
        </Link>

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

      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >

        <section className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-number">
              01
            </div>

            <div>
              <h2>Basic Information</h2>

              <p>
                Add the main information customers
                will see about this product.
              </p>
            </div>

          </div>

          <div className="admin-form-group">

            <label htmlFor="name">
              Product Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Example: Optimum Nutrition Gold Standard Whey"
              required
            />

          </div>

          <div className="admin-form-group">

            <label htmlFor="description">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the product..."
              rows="5"
              required
            />

          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="price">
                Price (₹) *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="2499"
                required
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="rating">
                Rating *
              </label>

              <input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                placeholder="4.5"
                required
              />

            </div>

          </div>

        </section>


        <section className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-number">
              02
            </div>

            <div>
              <h2>Classification</h2>

              <p>
                Organise the product for filtering,
                comparison and discovery.
              </p>
            </div>

          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="categoryId">
                Category *
              </label>

              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="admin-form-group">

              <label htmlFor="brandId">
                Brand *
              </label>

              <select
                id="brandId"
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select brand
                </option>

                {brands.map(
                  (brand) => (
                    <option
                      key={brand._id}
                      value={brand._id}
                    >
                      {brand.name}
                    </option>
                  )
                )}
              </select>

            </div>

          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="productType">
                Product Type
              </label>

              <input
                id="productType"
                name="productType"
                type="text"
                value={form.productType}
                onChange={handleChange}
                placeholder="Example: Protein"
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="subcategory">
                Subcategory
              </label>

              <input
                id="subcategory"
                name="subcategory"
                type="text"
                value={form.subcategory}
                onChange={handleChange}
                placeholder="Example: Whey Protein"
              />

            </div>

          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="comparisonGroup">
                Comparison Group *
              </label>

              <input
                id="comparisonGroup"
                name="comparisonGroup"
                type="text"
                value={form.comparisonGroup}
                onChange={handleChange}
                placeholder="Example: Whey Protein"
                required
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="certification">
                Certification
              </label>

              <input
                id="certification"
                name="certification"
                type="text"
                value={form.certification}
                onChange={handleChange}
                placeholder="Example: FSSAI"
              />

            </div>

          </div>

        </section>


        <section className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-number">
              03
            </div>

            <div>
              <h2>Product Details</h2>

              <p>
                Add features, benefits, suitability
                and product specifications.
              </p>
            </div>

          </div>

          <div className="admin-form-group">

            <label htmlFor="features">
              Features
            </label>

            <input
              id="features"
              name="features"
              type="text"
              value={form.features}
              onChange={handleChange}
              placeholder="Example: 25g Protein, Low Sugar, Easy Mixing"
            />

            <small>
              Separate multiple values with commas.
            </small>

          </div>

          <div className="admin-form-group">

            <label htmlFor="benefits">
              Benefits
            </label>

            <textarea
              id="benefits"
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              placeholder="Example: Supports muscle recovery, Convenient daily protein intake"
              rows="3"
            />

            <small>
              Separate multiple values with commas.
            </small>

          </div>

          <div className="admin-form-group">

            <label htmlFor="suitableFor">
              Suitable For
            </label>

            <input
              id="suitableFor"
              name="suitableFor"
              type="text"
              value={form.suitableFor}
              onChange={handleChange}
              placeholder="Example: Muscle Gain, Strength Training"
            />

            <small>
              Separate multiple values with commas.
            </small>

          </div>

          <div className="admin-form-group">

            <label htmlFor="experienceLevels">
              Experience Levels
            </label>

            <input
              id="experienceLevels"
              name="experienceLevels"
              type="text"
              value={form.experienceLevels}
              onChange={handleChange}
              placeholder="Example: beginner, intermediate, advanced"
            />

            <small>
              Separate multiple values with commas.
            </small>

          </div>

          <div className="admin-form-group">

            <label htmlFor="tags">
              Tags
            </label>

            <input
              id="tags"
              name="tags"
              type="text"
              value={form.tags}
              onChange={handleChange}
              placeholder="Example: whey, protein, muscle gain"
            />

            <small>
              Separate multiple values with commas.
            </small>

          </div>

          <div className="admin-form-group">

            <label htmlFor="specifications">
              Specifications
            </label>

            <textarea
              id="specifications"
              name="specifications"
              value={form.specifications}
              onChange={handleChange}
              placeholder={
                "Example:\nPack Size: 1 kg\nFlavour: Chocolate\nProtein Type: Whey Protein"
              }
              rows="6"
            />

            <small>
              Enter one specification per line using:
              Key: Value
            </small>

          </div>

        </section>


        <section className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-number">
              04
            </div>

            <div>
              <h2>Nutrition</h2>

              <p>
                Add nutritional information where
                applicable.
              </p>
            </div>

          </div>

          <div className="admin-form-group">

            <label htmlFor="servingSize">
              Serving Size
            </label>

            <input
              id="servingSize"
              name="servingSize"
              type="text"
              value={form.servingSize}
              onChange={handleChange}
              placeholder="Example: 30 g"
            />

          </div>

          <div className="admin-nutrition-grid">

            <div className="admin-form-group">

              <label htmlFor="calories">
                Calories
              </label>

              <input
                id="calories"
                name="calories"
                type="number"
                min="0"
                step="0.1"
                value={form.calories}
                onChange={handleChange}
                placeholder="120"
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="protein">
                Protein (g)
              </label>

              <input
                id="protein"
                name="protein"
                type="number"
                min="0"
                step="0.1"
                value={form.protein}
                onChange={handleChange}
                placeholder="24"
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="carbohydrates">
                Carbohydrates (g)
              </label>

              <input
                id="carbohydrates"
                name="carbohydrates"
                type="number"
                min="0"
                step="0.1"
                value={form.carbohydrates}
                onChange={handleChange}
                placeholder="3"
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="fat">
                Fat (g)
              </label>

              <input
                id="fat"
                name="fat"
                type="number"
                min="0"
                step="0.1"
                value={form.fat}
                onChange={handleChange}
                placeholder="2"
              />

            </div>

          </div>

        </section>


        <section className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-number">
              05
            </div>

            <div>
              <h2>Quality Evidence</h2>

              <p>
                Add available third-party testing or
                certification evidence.
              </p>
            </div>

          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="evidenceSource">
                Source
              </label>

              <input
                id="evidenceSource"
                name="evidenceSource"
                type="text"
                value={form.evidenceSource}
                onChange={handleChange}
                placeholder="Example: Trustified"
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="evidenceType">
                Evidence Type
              </label>

              <input
                id="evidenceType"
                name="evidenceType"
                type="text"
                value={form.evidenceType}
                onChange={handleChange}
                placeholder="Example: third-party-testing"
              />

            </div>

          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="evidenceStatus">
                Status
              </label>

              <input
                id="evidenceStatus"
                name="evidenceStatus"
                type="text"
                value={form.evidenceStatus}
                onChange={handleChange}
                placeholder="Example: passed"
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="evidenceLaboratory">
                Laboratory
              </label>

              <input
                id="evidenceLaboratory"
                name="evidenceLaboratory"
                type="text"
                value={form.evidenceLaboratory}
                onChange={handleChange}
                placeholder="Example: Eurofins"
              />

            </div>

          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="evidenceBatchNumber">
                Batch Number
              </label>

              <input
                id="evidenceBatchNumber"
                name="evidenceBatchNumber"
                type="text"
                value={form.evidenceBatchNumber}
                onChange={handleChange}
                placeholder="Example: ABC-123"
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="evidencePublishedDate">
                Published Date
              </label>

              <input
                id="evidencePublishedDate"
                name="evidencePublishedDate"
                type="date"
                value={form.evidencePublishedDate}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="admin-form-group">

            <label htmlFor="evidenceReportUrl">
              Report URL
            </label>

            <input
              id="evidenceReportUrl"
              name="evidenceReportUrl"
              type="url"
              value={form.evidenceReportUrl}
              onChange={handleChange}
              placeholder="https://example.com/report"
            />

          </div>

          <div className="admin-form-group">

            <label htmlFor="evidenceNotes">
              Evidence Notes
            </label>

            <textarea
              id="evidenceNotes"
              name="evidenceNotes"
              value={form.evidenceNotes}
              onChange={handleChange}
              placeholder="Add notes about the quality evidence..."
              rows="4"
            />

          </div>

        </section>


        <section className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-number">
              06
            </div>

            <div>
              <h2>Media & Purchase</h2>

              <p>
                Add the product image and official
                purchase destination.
              </p>
            </div>

          </div>

          <div className="admin-form-group">

            <label htmlFor="image">
              Product Image URL
            </label>

            <input
              id="image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
            />

          </div>

          <div className="admin-form-group">

            <label htmlFor="purchaseLink">
              Official Purchase Link *
            </label>

            <input
              id="purchaseLink"
              name="purchaseLink"
              type="url"
              value={form.purchaseLink}
              onChange={handleChange}
              placeholder="https://official-company-website.com/product"
              required
            />

          </div>

        </section>


        <div className="admin-form-actions">

          <Link
            to="/admin/products"
            className="admin-secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={saving}
          >
            {saving
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Product"
                : "Create Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminProductForm;