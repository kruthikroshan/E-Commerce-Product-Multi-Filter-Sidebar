# E-Commerce Product Multi-Filter Sidebar

Marketplace browsing page with a sticky filter sidebar (category checklist, dual-handle price slider,
minimum-star radios), a live product grid, an empty state, and a **Sort By** dropdown.

## Run
```bash
npm install
npm start          # http://localhost:3000
npm test           # unit tests for the filtering/sorting logic
```
Requires Node 18+.

## Architecture
```
server/
  index.js                    Express app (API + static hosting)
  routes/products.js          HTTP layer: query parsing, validation, thumbnails
  services/filterService.js   Business logic (pure functions): filter -> sort pipeline
  data/products.js            Master inventory (42 products, 3 categories)
  tests/                      node:test unit tests
client/
  index.html, style.css       Layout: sticky sidebar + grid
  js/api.js                   fetch wrapper
  js/app.js                   UI state + rendering only (no filtering logic)
```

## How it maps to the problem statement
| Requirement | Where |
|---|---|
| Category checklist, dual price slider, min-star radios | `client/index.html`, `js/app.js` |
| Cards: thumbnail, price, stars, name | `card()` in `js/app.js` |
| Instant updates, no submit button | every control calls `refresh()`; stale requests are aborted |
| Zero matches -> "No items match your criteria. Reset filters" | `render()` + `#empty` |
| Combinatorial intersect filter | `filterProducts()` in `filterService.js` |
| Graceful null handling | empty/null criteria are bypassed -> full inventory |
| Vibe check: Sort By (Price low-high, Top Rated, ...) | `sortProducts()`; `queryProducts()` filters the original data **first**, then sorts |
| All business logic on the server | filtering, sorting, validation live in `server/`; frontend only sends state and renders |

## API
`GET /api/meta` – categories (with counts), price bounds, sort options.
`GET /api/products?categories=Electronics,Apparel&minPrice=500&maxPrice=5000&minRating=4&sort=price-asc`
Sort keys: `relevance`, `price-asc`, `price-desc`, `rating-desc`, `name-asc`.

## Suggested commit history
1. `chore: init project`  2. `feat: product inventory dataset`  3. `feat: filter service`
4. `feat: products API + validation`  5. `feat: sidebar + grid UI`  6. `feat: empty state + reset`
7. `feat: sort by dropdown (filter then sort pipeline)`  8. `test: filter service unit tests` 9. `docs: README`
