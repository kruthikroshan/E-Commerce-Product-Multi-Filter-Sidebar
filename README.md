# E-Commerce Product Multi-Filter Sidebar & Enterprise Catalog Dashboard

> A high-performance browsing interface for a high-traffic marketplace store featuring a sticky multi-filter sidebar, dual-handle price slider, server-side combinatorial filtering, live sorting, KPI metrics dashboard, and product management.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-blue.svg)](https://expressjs.com/)
[![Tests](https://img.shields.io/badge/Tests-5%20Passed-brightgreen.svg)](#testing)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents
- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [How It Covers the Assessment Requirements](#how-it-covers-the-assessment-requirements)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Viva Preparation Guide](#viva-preparation-guide)
- [Git Commit History](#git-commit-history)

---

## About the Project
This project implements the core browsing interface of an e-commerce marketplace. Users can sift through an extensive product inventory across three distinct, complex filtering criteria simultaneously:
1. **Multi-Category Selection** (e.g., Electronics, Apparel, Footwear)
2. **Dual-Point Price Range Bounds** (Min and Max range sliders)
3. **Minimum Star Rating** (1★ to 5★ threshold radio buttons)

All filtering, sorting, and validation logic is strictly executed on the **server side**, following enterprise separation-of-concerns principles. The client interface acts as a thin presentation layer that captures user interaction, cancels stale requests, and renders instant updates.

---

## Tech Stack

### Backend
- **Node.js (v18+)**: High-performance runtime environment.
- **Express.js (v4.19)**: HTTP web server, routing, request parsing, and static asset delivery.
- **Node.js Native Test Runner (`node:test` & `node:assert`)**: Zero-dependency, blazing-fast unit testing.

### Frontend
- **HTML5 & Modern CSS3**:
  - CSS Custom Properties (Theme variables).
  - CSS Grid & Flexbox layouts.
  - Sticky viewport positioning (`position: sticky`).
  - Glassmorphism & elevation styling with fluid transitions.
- **Vanilla JavaScript (ES6+ Modules)**:
  - Native `fetch` with `AbortController` for stale-request cancellation.
  - `FileReader` API for local image previews and uploads.
  - No bloated frontend libraries or heavy dependencies.

---

## Key Features

### 1. Interactive Sticky Sidebar Layout
- Fixed to the left viewport while scrolling (`position: sticky; top: 20px;`).
- **Category Checklist Group**: Checkbox list populated from server metadata with item count badges.
- **Dual-Point Price Slider**: Two overlapping range handles allowing the user to select upper and lower price boundaries in real time with visual track fill.
- **Minimum Star Rating Radios**: Radio buttons allowing users to select 1★ to 5★ ratings or "Any rating".
- **Reset All Button**: Instantly restores all sidebar filters to default values.

### 2. Live Dynamic Product Grid
- Displays real high-resolution e-commerce photography, category pill badges, item titles, formatted prices in Indian Rupees (`₹`), star ratings, and total reviews.
- Products with ratings $\ge 4.5$ automatically receive a highlighted `★ Top Rated` badge.
- External product links (`Visit Store ↗`) open verified official product stores in a secure new tab.
- Integrated image fallback handler (`img.onerror`) that gracefully defaults to dynamic SVG thumbnails if an external image link is unreachable.

### 3. Instant State Feedback (No Submit Button)
- Every single click or slider drag updates the catalog instantly without requiring a manual "Submit" button click.
- Utilizes an `AbortController` pipeline: whenever a fast slider drag or click event occurs, any in-flight slow request is immediately cancelled, preventing race conditions.

### 4. Zero-Match Empty State
- When filters are tuned so tightly that zero items match, the catalog grid disappears and renders a helpful empty state screen:
  > *"No items match your criteria. Try widening the price range or removing an active filter."*
  Includes an instant **Reset filters** button.

### 5. "Sort By" Dropdown (Filter-Then-Sort Pipeline)
- Situated at the top right of the catalog grid.
- Choices:
  - `Featured` (Relevance / original order)
  - `Price: Low to High`
  - `Price: High to Low`
  - `Top Rated First`
  - `Name: A to Z`
- **Pipeline Order**: The server filters the original inventory array **first**, and then sorts the remaining items.

### 6. Interactive Catalog Dashboard & Active Filter Chips
- **4 Live KPI Cards**: Total Inventory, Current Matches, Active Price Bounds, and Average Catalog Rating.
- **Active Filter Chips**: Visual tags above the grid representing each active filter (e.g., `Apparel ✕`, `₹500 – ₹5,000 ✕`, `4★ & up ✕`). Users can dismiss any single filter dimension with one click.

### 7. "+ Add Product" Modal (Full End-to-End Flow)
- Compact, viewport-safe dialog that never clips or overflows the screen.
- Supports **3 Flexible Media Modes**:
  1. 📁 **Local Image Upload**: Drag & drop or file browse (`PNG, JPG, WebP, SVG`) converted into a data URI.
  2. 🌐 **Image URL**: Direct image link input with real-time avatar preview.
  3. 🎨 **Preset Icons**: High-res emoji selector (🎧, ⌚, 📱, 💻, 👕, 👗, 👟, 🥾, 🎒, 📷).
- Form inputs for Name, Category, Price (₹), Rating, Reviews count, and optional Product URL.
- Complete **server-side validation** (`POST /api/products`), updating the catalog without full page reload.

---

## System Architecture

```text
ecommerce-filter-sidebar/
├── client/                     # Presentation Layer (Vanilla JS, HTML5, CSS3)
│   ├── index.html              # Sticky sidebar, dashboard metrics, modal, catalog grid
│   ├── style.css               # Responsive design, sticky positioning, glassmorphism
│   └── js/
│       ├── api.js              # Thin client API layer (fetch + AbortController)
│       └── app.js              # State management, DOM rendering, UI event handlers
│
├── server/                     # Backend Application Layer (Node.js & Express)
│   ├── index.js                # Express app initialization, JSON parser, static server
│   ├── data/
│   │   └── products.js         # Master product inventory dataset (43 realistic items)
│   ├── routes/
│   │   └── products.js         # HTTP layer: query parsing, route validation, SVG generator
│   ├── services/
│   │   └── filterService.js    # Pure business logic: combinatorial filter & sort pipeline
│   └── tests/
│       └── filterService.test.js # Unit tests for pure business logic functions
│
├── package.json                # Project manifest and scripts
├── .gitignore                  # Excludes node_modules, .env, and system files
└── README.md                   # Comprehensive project documentation
```

### Layer Responsibility & Separation of Concerns
1. **HTTP / Route Layer (`server/routes/products.js`)**:
   - Parses incoming query parameters and JSON payloads.
   - Enforces validation contracts (e.g. valid types, positive numbers, rating limits).
   - Returns structured HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
2. **Service Layer (`server/services/filterService.js`)**:
   - Contains **pure functions** without Express or I/O dependencies.
   - Easily unit-testable and reusable.
   - Implements the combinatorial intersect filter and sorting comparator pipeline.
3. **Frontend Layer (`client/js/`)**:
   - Never performs filtering or sorting computations locally.
   - Captures user input, dispatches HTTP requests to the server, and renders received payloads.

---

## How It Covers the Assessment Requirements

| PDF Requirement | Project Implementation | File Reference |
| :--- | :--- | :--- |
| **Sticky Sidebar Panel** | CSS sticky positioning (`top: 20px; align-self: start;`) | `client/style.css` |
| **Category Checklist** | Multi-checkbox list dynamically populated from server metadata | `client/js/app.js` (`buildCategories`) |
| **Dual-Point Price Slider** | Dual overlapping sliders with active track fill visualization | `client/js/app.js` (`setupPriceSlider`) |
| **Minimum Star Rating** | Radio group supporting thresholds from 1★ to 5★ | `client/js/app.js` (`buildRatings`) |
| **Dynamic Inventory Grid** | Cards with image, price, star rating, reviews, title, and link | `client/js/app.js` (`card`) |
| **Instant Updates (No Submit)** | Event listeners call `refresh()` on input; stale requests aborted | `client/js/app.js` (`refresh`) |
| **Zero Matches Screen** | Grid hidden, `#empty` container displayed with Reset action | `client/js/app.js` (`render`) |
| **Combinatorial Intersect** | AND intersection across categories, price bounds, and rating | `server/services/filterService.js` |
| **Graceful Null Handling** | Missing/cleared filters bypass filtering to return full catalog | `server/services/filterService.js` |
| **Vibe Check: Sort By** | Top-right dropdown; filters original dataset first, then sorts | `server/services/filterService.js` |
| **Server-Side Logic** | All calculations, filters, sorts, and validations on Express backend | `server/routes/products.js` |

---

## API Reference

### 1. `GET /api/meta`
Returns dynamic metadata required to construct the sidebar controls and dashboard KPIs.
- **Response `200 OK`**:
  ```json
  {
    "categories": [
      { "name": "Apparel", "count": 15 },
      { "name": "Electronics", "count": 16 },
      { "name": "Footwear", "count": 12 }
    ],
    "priceMin": 299,
    "priceMax": 13499,
    "ratingOptions": [1, 2, 3, 4, 5],
    "sortOptions": [
      { "value": "relevance", "label": "Featured" },
      { "value": "price-asc", "label": "Price: Low to High" },
      { "value": "price-desc", "label": "Price: High to Low" },
      { "value": "rating-desc", "label": "Top Rated First" },
      { "value": "name-asc", "label": "Name: A to Z" }
    ],
    "total": 43,
    "avgRating": 4.1
  }
  ```

### 2. `GET /api/products`
Retrieves products matching the filter and sort criteria.
- **Query Parameters**:
  - `categories` *(string, optional)*: Comma-separated categories (e.g. `Electronics,Footwear`).
  - `minPrice` *(number, optional)*: Minimum price boundary.
  - `maxPrice` *(number, optional)*: Maximum price boundary.
  - `minRating` *(number, optional)*: Minimum star rating threshold (0 to 5).
  - `sort` *(string, optional)*: One of `relevance`, `price-asc`, `price-desc`, `rating-desc`, `name-asc`.
- **Response `200 OK`**:
  ```json
  {
    "count": 1,
    "total": 43,
    "items": [
      {
        "id": 1,
        "name": "Wireless Earbuds Pro with ANC",
        "category": "Electronics",
        "price": 2499,
        "rating": 4.5,
        "reviews": 210,
        "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        "productUrl": "https://www.amazon.in/dp/B0BDHWDR12"
      }
    ]
  }
  ```

### 3. `POST /api/products`
Creates and publishes a new item into the catalog.
- **Request Body**:
  ```json
  {
    "name": "Sony WH-1000XM5 Wireless Headphones",
    "category": "Electronics",
    "price": 26990,
    "rating": 4.8,
    "reviews": 1250,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "productUrl": "https://electronics.sony.com/audio/headphones"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "message": "Product created successfully",
    "product": { ... }
  }
  ```

### 4. `GET /api/images/:id.svg`
Generates an on-the-fly, resolution-independent SVG thumbnail based on product metadata (emoji and hue). Serves as an instant fallback image if an external URL is unavailable.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) version **18.0.0 or higher**
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation & Running
1. Clone the repository:
   ```bash
   git clone https://github.com/kruthikroshan/E-Commerce-Product-Multi-Filter-Sidebar.git
   cd E-Commerce-Product-Multi-Filter-Sidebar
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Testing

The project includes unit tests covering all core business logic functions in `server/services/filterService.js`.

To execute the test suite:
```bash
npm test
```

### Test Coverage Summary:
- ✔ **Null Handling**: Returns full inventory when criteria are missing or empty.
- ✔ **Combinatorial Intersect**: Correctly computes the AND intersection of category, price, and rating.
- ✔ **Impossible Criteria**: Accurately yields an empty array when no products match.
- ✔ **Immutability & Ordering**: Verifies sorting does not mutate the original array and sorts correctly.
- ✔ **Pipeline Execution**: Confirms that filtering executes first, followed by sorting the remaining items.

---

## Viva Preparation Guide

Be prepared to answer these three core design questions:

### 1. Why does the filter run before the sort?
- **Computational Complexity**: Filtering is an $O(N)$ linear reduction that shrinks the dataset from $N$ items to $K$ matching items ($K \le N$). Sorting requires $O(K \log K)$ comparisons. Sorting only the filtered subset is dramatically faster and avoids wasting CPU cycles sorting items that will simply be discarded.
- **Pipeline Integrity**: Running the filter first ensures downstream operations (such as pagination, slicing, and metrics) operate on a clean, valid subset.

### 2. How are empty or missing filters skipped in `filterService.js`?
- **Presence Flags**: Boolean flags detect whether each filter dimension is active:
  ```javascript
  const hasCategories = Array.isArray(categories) && categories.length > 0;
  const hasMin = !isNil(minPrice);
  const hasMax = !isNil(maxPrice);
  const hasRating = !isNil(minRating) && minRating > 0;
  ```
- **Short-Circuit**: If all flags are false, `inventory.slice()` is returned immediately.
- **Non-Restrictive Loop**: Inside the loop, inactive filters are bypassed using `continue` guards:
  ```javascript
  if (catSet && !catSet.has(p.category.toLowerCase())) continue;
  if (hasMin && p.price < minPrice) continue;
  if (hasMax && p.price > maxPrice) continue;
  if (hasRating && p.rating < minRating) continue;
  result.push(p);
  ```
  If a criterion is absent, its guard condition is never triggered, allowing products to pass freely along that dimension.

### 3. Why does validation live in the route and not in the service?
- **Separation of Concerns**: 
  - The **Route Layer** handles the HTTP interface, parsing raw query strings, validating data types, and returning appropriate HTTP status codes (e.g., `400 Bad Request`).
  - The **Service Layer** consists of **pure business functions** that operate on clean, typed in-memory objects.
- **Reusability & Testability**: Decoupling validation from the service layer allows `filterService.js` to be tested with standard unit tests without mocking Express `req` and `res` objects, and allows the business logic to be reused across different transports (REST, GraphQL, WebSockets, CLI).

---

## Git Commit History

The repository maintains an incremental, meaningful commit history reflecting each phase of development:

1. `chore: init project` – Initialized package manifest, `.gitignore`, and lockfile.
2. `feat: product inventory dataset` – Added the master product catalog.
3. `feat: filter service` – Implemented pure business logic filtering and sorting functions.
4. `feat: products API + validation` – Added Express routes, query parsing, and SVG thumbnail generation.
5. `feat: sidebar + grid UI` – Built sticky layout, category checklist, and dual-handle price slider.
6. `feat: empty state + reset` – Added zero-match screen and reset action handlers.
7. `feat: sort by dropdown (filter then sort pipeline)` – Integrated live sorting dropdown above the grid.
8. `test: filter service unit tests` – Added unit tests verifying pipeline correctness and edge cases.
9. `docs: README` – Comprehensive documentation, architecture guide, and API reference.
10. `feat: add interactive dashboard metrics, add product UI, and active filter tags` – Added live KPI cards, modal product creation, and filter chips.
11. `feat: add uploaded image option, image URL input, and product link in add product modal` – Added tabbed media picker (Upload, URL, Emoji) and store link support.
12. `feat: compact modal sizing, real product images and store URLs, and responsive card design` – Viewport-safe modal styling, curated Unsplash photography, and store URLs.

---

## License
This project is open-source and available under the [MIT License](LICENSE).
