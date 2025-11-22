# Inventory Management System — Backend

Node.js · Express · SQLite  
Async/await-based REST API for managing products, CSV import/export, and inventory history.

## Key Features

- Product CRUD with validation and duplicate-name prevention
- Search products by name and pagination support
- CSV import/export with duplicate skipping and report
- Inventory logging: records stock changes (who, old/new, timestamp)
- Centralized error handling with consistent response format
- Lightweight SQLite DB with automatic table creation
- Simple file upload support for CSV and product images

## Response Formats

Success:
{
"status": "success",
"message": "Message here",
"data": { }
}

Error:
{
"status": "error",
"message": "Human readable error message"
}

## Project Structure

```
server/
├── controllers/
│   └── product.controller.js  # business login product CRUD, CSV import/export, history
│
├── middleware/
│   ├── errorhandler.js        # global error handler + CustomError class
│   ├── upload.js              # multer config for CSV file uploads
│   └── validators.js          # input validators (if used)
│
├── routes/
│   └── product.routes.js      # products api endpoints
│
├── uploads/                   # pploaded CSV files
│   └── <csv files>
│
├── .env                       # env variables
├── .gitignore
├── app.js                     # main app file
├── database.js                # db file
├── index.js                   # entry file
├── inventory.db               # database file
├── package.json
└── readme.md
```

## Installation & Setup

1. Clone and enter backend directory:
   cd backend

2. Install dependencies:
   npm install

3. Environment (create `.env` in backend root):
   NODE_ENV=development // production
   PORT=5000

4. Start server:
   npm run dev // for development
   npm start // for production

Server will be available at: http://localhost:5000

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

## CSV Import Format

CSV columns (header row required):
name,unit,category,brand,stock,status,image

Example rows:
A4 Paper Pack,pack,Stationery,JK Paper,120,In Stock,
Ballpoint Pen Blue,piece,Stationery,Reynolds,350,In Stock,
Notebook Hardbound,piece,Stationery,Classmate,500,In Stock,

Import behavior:

- Duplicate product names are skipped.
- The response reports counts of added, skipped, and duplicates.
- Inventory logs are created for imported stock values.

## Database Schema (SQLite)

products

- id INTEGER PRIMARY KEY AUTOINCREMENT
- name TEXT UNIQUE NOT NULL
- unit TEXT
- category TEXT
- brand TEXT
- stock INTEGER DEFAULT 0
- status TEXT
- image TEXT
- created_at TEXT
- updated_at TEXT

inventory_logs

- id INTEGER PRIMARY KEY AUTOINCREMENT
- productId INTEGER NOT NULL
- oldStock INTEGER
- newStock INTEGER
- changedBy TEXT
- timestamp TEXT

dbInit.js will create these tables on first run if missing.

## Error Handling

All errors are routed through a centralized middleware that returns JSON:
{
"status": "error",
"message": "Something went wrong"
}

Use structured logging (winston/pino recommended) for production.

## Testing & Mock Data

- nill

## Deployment Notes

- Ensure NODE_ENV=production for production builds
- Persist the SQLite file (inventory.db) on the host or use a managed volume
- Build/start:
  npm install
  npm start
- For process management: use pm2 or run in a container with a persistent volume
