# Product Inventory Management System

A lightweight, extensible inventory management system to track products, stock levels, suppliers and audit history. Designed as a starting point for small-to-medium applications.

## Features

- CRUD for products.
- Stock adjustments, in-stock out-of-stock
- Audit log for changes
- RESTful APIs
- Import/export CSV for bulk updates

## Tech stack (example)

- Backend: Node.js + Express
- Database: SQLITE
- frontend: React
- Testing: Nill

## Prerequisites

- Node.js >= 20
- Database server SQLite
- Git

## Installation (Node.js example)

1. Clone repository
   ```bash
   git clone https://github.com/narendrapala2210/Product-Inventory-Management-System
   cd Product-Inventory-Management-System
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create .env from template

   ```bash
   cp .env
   # Edit .env add PORT=5000
   ```

4. Start development server
   ```bash
   npm run dev
   ```

## Configuration

- Common environment variables:
  - PORT — application port (default 3000)
  - NODE_ENV — development / production

## API (example endpoints)

## API Endpoints

Base path: /api/products

- GET /api/products  
   List all products (supports ?page=&limit=&q= for pagination/search)

- GET /api/products/search?name=term  
   Search products by name

- GET /api/products/:id  
   Get a single product

- PUT /api/products/:id  
   Update product (validates duplicates)

- GET /api/products/:id/history  
   Get inventory change history for product

- POST /api/products/import  
   Import products via multipart/form-data (key: csvFile)

- GET /api/products/export  
   Download all products as CSV (products.csv)

Document full API with OpenAPI/Swagger in the repo.

## Frontend

- Provide a simple admin UI to manage products, and track history
