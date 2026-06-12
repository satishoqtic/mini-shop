# Mini E-Commerce App

## Live Demo
https://satish-mini-ecommerce.vercel.app/

## Tech Stack
- Vue 3 (Composition API)
- Vite
- Pinia (Global State Management)
- Vue Router
- Scoped SCSS (SFC Styles)

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Features

- **Product Listing Page**: Grid layout of products with hover animations, pulsing skeleton loaders, and a "Quick Add" action.
- **Product Detail Page**: Deep-linked routing by product slug, dynamic image filtering to simulate color variants, and rating badges.
- **Variant Selection**: Synchronization of selected color and size options to URL query parameters.
- **Cart Drawer**: Sliding side panel displaying cart items, inline quantity adjusters, subtotal calculations, and a success popup modal on checkout.
- **Cart Persistence**: Automatically saves and loads the cart items using browser `localStorage`.
- **Responsive Design**: Mobile-friendly grids and drawers styled with custom SCSS breakpoints.

## Design Decisions

### Why Pinia?
Pinia was chosen because it provides a simple, boilerplate-free, and scalable way to manage global state (cart items list, cart drawer open state, totals) across distant components like the Navbar, ProductCard, and CartDrawer.

### Why localStorage?
The assignment explicitly requires cart persistence across page refreshes, which was achieved by synchronizing the Pinia store with browser `localStorage`.

### Product Data Enrichment
Fake Store API does not provide brand, variants, stock information, or multiple images. A lightweight local enrichment layer (via `stockData.js` and CSS brightness/contrast/grayscale filters) was used to satisfy these requirements.

### Component Modularization
The checkout success modal (`SuccessModal.vue`) and individual cart item rows (`CartItem.vue`) were extracted into self-contained, reusable components to keep `CartDrawer.vue` clean and easy to maintain.

## Trade-offs

- Product variants (color and size) are mocked locally because the fake API does not provide variant options.
- Product image galleries are generated locally using CSS filter effects since the API only returns a single image per product.
