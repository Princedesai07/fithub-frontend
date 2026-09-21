# FitHub — Fitness Product Discovery Platform

FitHub is a full-stack fitness product discovery platform designed to help users explore, compare and discover fitness products based on their goals, budget and experience level.

The platform combines product discovery, search and filtering, product comparison, wishlist management, quality information and AI-powered recommendations into a single web application.

---

## Overview

Finding the right fitness product can require searching across multiple brands, categories and websites.

FitHub brings useful product information together in one place and provides tools that help users:

- Discover fitness products
- Search and filter products
- Compare products
- View product details
- Save products to a wishlist
- Explore quality and certification information
- Get AI-powered recommendations
- Access official purchase links

FitHub also provides an administrative dashboard for managing products, categories and brands.

---

## Key Features

### Product Discovery

- Browse fitness products by category
- Search products using keywords
- Filter products by:
  - Brand
  - Budget
  - Rating
  - Category
  - Certification
- Sort products
- View detailed product information

### Product Comparison

Users can compare compatible products using information such as:

- Price
- Rating
- Features
- Certifications
- Brand

The comparison system allows users to evaluate multiple products together before making a decision.

### Wishlist

Authenticated users can:

- Add products to their wishlist
- Remove products from their wishlist
- View saved products

### Authentication

FitHub uses JWT-based authentication.

Users can:

- Register
- Login
- Logout
- Access protected features
- Maintain their authenticated session

### AI Assistant

FitHub includes an AI-powered assistant that can help users discover suitable products.

Recommendations can consider:

- Fitness goal
- Budget
- Experience level

The assistant can also answer product-related and general questions.

### Admin Dashboard

Administrators can manage:

- Products
- Categories
- Brands

Administrative routes are protected using role-based authorization.

### Official Purchase Links

Product pages can provide official purchase links so users can continue to the relevant seller or company website.

### About FitHub

The application includes an About Us section describing:

- FitHub's purpose
- Mission
- Features
- Technology stack
- Project work
- Development team

---

# Technology Stack

## Frontend

- React
- JavaScript
- React Router
- Axios
- Vite
- CSS

## Backend Integration

- REST APIs
- Node.js
- Express.js

## Database

- MongoDB
- MongoDB Atlas
- Mongoose

## Authentication

- JWT
- Protected routes
- Role-based authorization

## AI

- Ollama
- Qwen

---

# Frontend Architecture

FitHub follows a component-based React architecture.

The frontend communicates with the backend through REST APIs.

```text
                    FitHub Frontend
                          |
                          v
                    React Application
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
       Pages          Components       Contexts
          |               |               |
          +---------------+---------------+
                          |
                          v
                        Axios
                          |
                          v
                    REST API Backend
````

---

# Application Modules

## Public Modules

* Home
* Products
* Product Details
* About Us
* Login
* Register
* Compare
* AI Assistant

## Authenticated Modules

* Wishlist
* User-specific features

## Administrative Modules

* Admin Dashboard
* Product Management
* Category Management
* Brand Management

---

# Project Structure

```text
fithub_frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AdminRoute.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CompareContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Assistant.jsx
│   │   ├── Compare.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Products.jsx
│   │   ├── Register.jsx
│   │   ├── Wishlist.jsx
│   │   └── admin/
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

---

# Getting Started

## Prerequisites

Before running the frontend, make sure the following are installed:

* Node.js
* npm
* Git

The FitHub backend should also be configured and running.

---

## Installation

Clone the repository or obtain the project source code.

Navigate to the frontend directory:

```bash
cd fithub_frontend
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the frontend root directory.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

The `.env` file contains environment-specific configuration and should not be committed to Git.

A safe template is provided through:

```text
.env.example
```

---

# Running the Development Server

Start the development server:

```bash
npm run dev
```

The application will normally be available through the local Vite development URL shown in the terminal.

---

# Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The production build is generated in:

```text
dist/
```

---

# Application Flow

A typical FitHub user journey is:

```text
Home
  |
  v
Browse Products
  |
  v
Search / Filter / Sort
  |
  v
Product Details
  |
  +------> Wishlist
  |
  +------> Compare
  |
  +------> Official Purchase Link
  |
  v
FitHub AI
  |
  v
Personalized Recommendation
```

---

# Authentication Flow

The frontend communicates with the backend authentication APIs.

```text
User
 |
 +---- Register
 |
 +---- Login
          |
          v
     JWT Authentication
          |
          v
     Authenticated User
          |
     +---- Wishlist
     |
     +---- Protected Features
     |
     +---- Admin Access
```

Protected routes prevent unauthenticated users from accessing user-specific functionality.

Administrative routes additionally verify the user's administrative role.

---

# AI Assistant

The FitHub AI Assistant provides conversational assistance for fitness product discovery.

Users can provide information such as:

* Fitness goal
* Budget
* Experience level

The assistant can use this information to provide product recommendations.

It can also handle:

* Product questions
* General fitness-product questions
* Recommendation requests

The frontend communicates with the backend AI service rather than directly accessing the AI model.

---

# Admin Dashboard

The administrative interface provides management functionality for the FitHub product catalogue.

Administrators can manage:

### Products

* Add products
* Edit products
* Delete products

### Categories

* Add categories
* Edit categories
* Delete categories

### Brands

* Add brands
* Edit brands
* Delete brands

Administrative access is protected using authentication and role-based authorization.

---

# Security

The frontend follows several security practices:

* JWT-based authentication
* Protected routes
* Role-based admin routes
* Environment variables for configuration
* No secrets stored directly in source code
* API communication through the backend
* Production dependencies managed through npm

Environment files containing secrets are excluded through `.gitignore`.

---

# Backend Dependency

The FitHub frontend requires the FitHub backend API to provide application data and functionality.

The general architecture is:

```text
React
  |
  | REST API
  v
Node.js + Express
  |
  +------ MongoDB Atlas
  |
  +------ AI Service
```

---

# Development Scripts

The following npm scripts are available:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Previews the production build locally.

---

# Future Improvements

Potential future improvements include:

* Improved conversational context for AI follow-up queries
* More advanced product recommendation logic
* Additional product categories
* More product quality information
* Enhanced personalization
* Production deployment
* Additional automated testing
* Further UI and accessibility improvements

---

# Team

## Prince Desai

**Full-Stack Developer**

B.Tech Computer Engineering student at Dharmsinh Desai University.

Areas of work include:

* React frontend development
* Node.js and Express APIs
* MongoDB integration
* Authentication
* Product discovery
* Product comparison
* Wishlist
* Admin functionality
* AI integration

GitHub:

```text
https://github.com/Princedesai07
```

LinkedIn:

```text
https://www.linkedin.com/in/prince-p-desai
```

---

## Hetex Utadiya

**Full-Stack Developer**

B.Tech Computer Engineering student at Dharmsinh Desai University and member of the FitHub development team.

Areas of interest include:

* React
* JavaScript
* Node.js
* Express.js
* MongoDB
* REST APIs

Professional profile links can be added as they become available.

---

# Project Status

FitHub has completed its core application development and integration testing.

Major implemented areas include:

* React frontend
* REST API integration
* MongoDB Atlas integration
* Authentication
* Protected routes
* Product discovery
* Search and filtering
* Product comparison
* Wishlist
* AI assistant
* Admin dashboard
* About Us
* Production build

---

## License

This project was developed as an academic project by the FitHub development team.
