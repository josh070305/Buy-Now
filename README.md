# 1Fi Store — Smartphones on Zero-Cost EMI Backed by Mutual Funds

> **1Fi SDE1 Internship Assignment Submission**  
> A full-stack web application that allows users to purchase flagship smartphones with dynamic EMI plans backed by mutual funds, built faithfully to the **Snapmint / 1Fi reference design** and specifications.

---

## 🌟 Overview & Domain Context

**1Fi** provides an innovative fintech solution: **"Buy Now, Pay on EMI backed by Mutual Funds"**.  
Instead of liquidating mutual fund investments or paying exorbitant credit card interest (16–24% p.a.), customers pledge eligible mutual fund units as collateral. This unlocks:
- **₹0 Down Payment** on flagship smartphones.
- **0% Interest EMIs** (or subsidized low-interest rates).
- **Compounding Growth**: The customer's mutual fund units remain invested in their folio and continue generating market returns (~12% p.a.) throughout the repayment tenure.
- **Additional Cashback**: Instant cashback incentives (e.g. ₹7,500) credited directly to the customer.

---

## 📸 Features & Reference Match

| Assignment Requirement | Implementation Detail |
| :--- | :--- |
| **Reference Design Match** | Faithful reproduction of the Snapmint product page with "NEW" badge, high-res device stage, exact price strike-through, and stacked EMI cards. |
| **Variant Switching** | Dual selector: Storage pills (`128GB`, `256GB`, `512GB`) and **"Available in X finishes"** circular color swatches with tooltips. |
| **Interactive EMI Cards** | Tabular cards with tenure, monthly amount (`₹44,967 x 3 months`), interest badges (`0% interest`), and emerald cashback badges (`Additional cashback of ₹7,500`). |
| **Dynamic Backend APIs** | No hardcoded data. Products, variants, and EMI plans are stored in MongoDB and served via RESTful endpoints. |
| **Dual Identifier Resolution** | `/api/products/:identifier` dynamically resolves by both MongoDB `_id` (assignment spec) and SEO-friendly `slug`. |
| **Unique Product URLs** | Unique routes for each device: `/products/apple-iphone-17-pro`, `/products/samsung-galaxy-s24-ultra`, `/products/google-pixel-9-pro`. |
| **Checkout Flow (No Alerts)** | Fintech checkout modal breaking down principal, interest, cashback, and mutual fund portfolio status, creating confirmed orders via `POST /api/orders`. |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, Axios, Lucide-style SVG iconography.
- **Backend**: Node.js, Express 5, Mongoose (MongoDB ODM), Helmet, CORS.
- **Database**: MongoDB (supports both cloud MongoDB Atlas and local instance).
- **Testing**: Vitest & `@testing-library/react` (Frontend), Jest & `mongodb-memory-server` (Backend).

---

## 🗄️ Database Schema & Data Modeling

The system models product data into three normalized collections:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Product     │ 1───N │     Variant     │ 1───N │     EMIPlan     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ _id (ObjectId)  │       │ _id (ObjectId)  │       │ _id (ObjectId)  │
│ name (String)   │       │ productId (Ref) │       │ variantId (Ref) │
│ slug (String)   │       │ label (String)  │       │ monthlyAmount   │
│ brand (String)  │       │ storage (String)│       │ tenureMonths    │
│ description     │       │ colorName/Hex   │       │ interestRate    │
│ category        │       │ mrp / price     │       │ cashback        │
└─────────────────┘       │ images [String] │       │ isPopular       │
                          │ stock (Number)  │       └─────────────────┘
                          └─────────────────┘
                                   │ 1
                                   │
                                   ▼ N
                          ┌─────────────────┐
                          │      Order      │
                          ├─────────────────┤
                          │ _id (ObjectId)  │
                          │ productId (Ref) │
                          │ variantId (Ref) │
                          │ emiPlanId (Ref) │
                          │ amount (Number) │
                          │ tenureMonths    │
                          │ customerName    │
                          │ customerEmail   │
                          │ status (String) │
                          └─────────────────┘
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or MongoDB Atlas connection string)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/buy-now.git
cd buy-now
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
# Copy .env.example to .env and set MONGODB_URI and PORT
cp .env.example .env

# Seed the database with sample products, variants, and EMI plans
node seed.js

# Start the backend server (Runs on port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start the Vite dev server (Runs on port 5173)
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints & Sample Responses

### 1. `GET /api/products`
Retrieves a list of all products with starting prices and thumbnail assets.

**Sample Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6a9a511ae965ae39dde8906f",
      "name": "iPhone 17 Pro",
      "slug": "apple-iphone-17-pro",
      "brand": "Apple",
      "description": "Forged in titanium with industry-leading A19 Pro chip...",
      "category": "Smartphones",
      "thumbnail": "/assets/iphone-natural.svg",
      "startingPrice": 127400
    }
  ]
}
```

### 2. `GET /api/products/:identifier`
Accepts either a **slug** (`apple-iphone-17-pro`) or a **MongoDB ObjectId** (`6a9a511ae965ae39dde8906f`).

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "_id": "6a9a511ae965ae39dde8906f",
    "name": "iPhone 17 Pro",
    "slug": "apple-iphone-17-pro",
    "brand": "Apple",
    "variants": [
      {
        "_id": "6a9a511ae965ae39dde89072",
        "label": "256GB Natural Titanium",
        "storage": "256GB",
        "colorName": "Natural Titanium",
        "colorHex": "#9A948C",
        "mrp": 134900,
        "price": 127400,
        "images": ["/assets/iphone-natural.svg"],
        "emiPlans": [
          {
            "_id": "6a9a511ae965ae39dde8907d",
            "monthlyAmount": 44967,
            "tenureMonths": 3,
            "interestRate": 0,
            "cashback": 7500,
            "isPopular": false
          },
          {
            "_id": "6a9a511ae965ae39dde8907e",
            "monthlyAmount": 22483,
            "tenureMonths": 6,
            "interestRate": 0,
            "cashback": 7500,
            "isPopular": true
          }
        ]
      }
    ]
  }
}
```

### 3. `POST /api/orders`
Creates a confirmed order with the chosen variant and EMI plan.

**Request Body:**
```json
{
  "productId": "6a9a511ae965ae39dde8906f",
  "variantId": "6a9a511ae965ae39dde89072",
  "emiPlanId": "6a9a511ae965ae39dde8907d",
  "customerName": "Rahul Sharma",
  "customerEmail": "rahul@example.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "orderId": "6a9a52bbf64a7f74c1a0d529",
    "status": "CONFIRMED"
  }
}
```

---

## 🧪 Running Automated Tests

### Frontend Unit & Component Tests (Vitest)
```bash
cd frontend
npm test -- --run
```
*Validates that `ProductCard` and `EMIPlanCard` render correct tenures, interest badges, and cashback information.*

### Backend Controller & Model Tests (Jest)
```bash
cd backend
npm test
```
*Validates database seeding, thumbnail aggregation, and dual-identifier (`_id` and `slug`) resolution.*

---

## ☁️ Deployment Instructions

### Backend (Render)
1. Push this repository to GitHub.
2. Create a **Web Service** on [Render](https://render.com).
3. Root Directory: `backend`.
4. Build Command: `npm install`.
5. Start Command: `node server.js`.
6. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `FRONTEND_ORIGIN`: `<Your Vercel Deployment URL>`

### Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com) pointing to the same repository.
2. Root Directory: `frontend`.
3. Framework Preset: `Vite`.
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: `<Your Deployed Render Backend URL>`

---

## 📹 Video Walkthrough & Demo Checklist

- [x] Product catalog with flagship smartphones on zero-cost EMI.
- [x] Responsive layout tested on desktop, tablet, and mobile.
- [x] Variant selection changing storage (`256GB`, `512GB`) and finish swatches with real-time phone preview.
- [x] Dynamic EMI plan cards matching reference amounts, tenures, and cashbacks.
- [x] Interactive checkout modal with mutual fund backing explanation and real API order creation.
- [x] Complete RESTful API documentation and automated test suite passing.
