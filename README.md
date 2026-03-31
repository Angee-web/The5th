# 5thJohnson

A full-stack e-commerce platform for women's fashion, built with Next.js 14, MongoDB, and Paystack payments. Designed for the Nigerian market.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Customer-Facing](#customer-facing)
  - [Admin Dashboard](#admin-dashboard)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Flow](#payment-flow)
- [Email System](#email-system)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

5thJohnson is a curated women's fashion store with a complete e-commerce experience — product browsing, wishlists, cart, checkout with Paystack, order tracking, reviews, a blog, and a full admin dashboard with analytics.

**Key characteristics:**
- Nigerian market focus (NGN pricing, Nigerian state-based shipping rates)
- Real-time stock management — stock decrements automatically on successful payment
- Admin alert panel for out-of-stock products
- Email verification and OTP-based password reset

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.5 (App Router) |
| Language | TypeScript |
| Database | MongoDB via Mongoose 8.5.0 |
| Authentication | NextAuth.js 4.24.7 |
| Payments | Paystack |
| Styling | Tailwind CSS 3.4.1 |
| State Management | Zustand 4.5.4 |
| Image Hosting | Cloudinary |
| Email | Nodemailer |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | Framer Motion |
| Carousel | Swiper |
| Toasts | React Hot Toast |

---

## Features

### Customer-Facing

#### Shop & Discovery
- Product listing with pagination (12 per page)
- Filter by category, size, price range, new arrivals, featured, and sale items
- Sort by newest, oldest, price (asc/desc), and rating
- Full-text product search
- Product detail page with image gallery, size selector, quantity picker, and stock status
- "Only X left!" warning when stock is 5 or fewer
- "Sold Out" overlay and disabled cart button when stock is 0

#### Cart & Checkout
- Persistent cart stored in `localStorage` via Zustand (per user)
- Checkout requires authentication
- Shipping address collection with Nigerian state selector
- Shipping fee calculated per state (₦2,500–₦5,000; free over ₦100,000)
- Promo code support (percentage or fixed-amount discounts)
- Order summary with subtotal, shipping, discount, and total
- Paystack payment integration with redirect flow

#### Orders & Account
- Order history with status tracking (Processing → Confirmed → Shipped → Delivered)
- Order detail page with item breakdown and shipping info
- User profile page
- Wishlist (requires sign-in)

#### Authentication
- Email/password registration with OTP email verification
- Google OAuth sign-in
- Forgot password with OTP reset flow
- Secure sessions via NextAuth.js

#### Content Pages
- Blog with categories and full post view
- Lookbook
- About, Contact, FAQ
- Size Guide, Shipping Info, Returns Policy, Privacy Policy, Terms & Conditions

---

### Admin Dashboard

Access at `/admin` — restricted to users with `role: "admin"`.

#### Dashboard (`/admin`)
- Total revenue, total orders, total customers at a glance
- Revenue over the last 12 months (area chart)
- Orders by status breakdown (bar chart)
- Top 5 selling products by units and revenue
- **Out-of-stock alert panel** — lists every product with zero stock and links directly to the products page for restocking

#### Products (`/admin/products`)
- Full product table with stock indicators (green > 5, yellow 1–5, red 0)
- Create, edit, and delete products
- Image upload to Cloudinary (multiple images per product)
- Fields: name, description, price, compare price, category, stock, sizes, colors, tags, featured toggle, new arrival toggle

#### Orders (`/admin/orders`)
- View all orders with customer, date, total, payment status, and order status
- Update order status and add tracking number

#### Analytics (`/admin/analytics`)
- Extended revenue and sales data

#### Blog (`/admin/blog`)
- Create, edit, and delete blog posts
- Slug auto-generation, cover image upload

#### Promos (`/admin/promos`)
- Create and manage promo codes (percentage or fixed)
- Track usage count

---

## Project Structure

```
5thjohnson/
├── app/
│   ├── (shop)/                  # Public storefront (App Router group)
│   │   ├── page.tsx             # Homepage
│   │   ├── shop/                # Product listing & detail
│   │   ├── cart/                # Cart page
│   │   ├── checkout/            # Checkout & payment init
│   │   ├── orders/              # Order history & detail
│   │   ├── wishlist/            # Saved items
│   │   ├── blog/                # Blog listing & posts
│   │   ├── lookbook/            # Lookbook page
│   │   ├── profile/             # User account
│   │   ├── login/               # Sign in
│   │   ├── register/            # Sign up
│   │   ├── verify-email/        # OTP email verification
│   │   ├── forgot-password/     # Password reset request
│   │   ├── reset-password/      # OTP password reset
│   │   └── [about, contact, faq, shipping, returns, privacy, terms, size-guide]/
│   ├── admin/                   # Admin dashboard (protected)
│   │   ├── page.tsx             # Dashboard overview
│   │   ├── products/            # Product CRUD
│   │   ├── orders/              # Order management
│   │   ├── analytics/           # Analytics view
│   │   ├── blog/                # Blog management
│   │   └── promos/              # Promo code management
│   ├── api/                     # Next.js API routes
│   │   ├── auth/                # NextAuth endpoints
│   │   ├── products/            # Product CRUD
│   │   ├── orders/              # Order creation & listing
│   │   ├── paystack/verify/     # Payment verification + stock deduction
│   │   ├── reviews/             # Product reviews
│   │   ├── wishlist/            # Wishlist toggle
│   │   ├── promos/validate/     # Promo code validation
│   │   ├── blog/                # Blog CRUD
│   │   ├── upload/              # Cloudinary upload
│   │   └── admin/analytics/     # Admin analytics aggregation
│   └── layout.tsx               # Root layout
├── models/                      # Mongoose schemas
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   ├── Review.ts
│   ├── PromoCode.ts
│   └── Blog.ts
├── components/
│   ├── shop/                    # ProductCard, ProductFilters, etc.
│   ├── admin/                   # ProductForm, Sidebar, etc.
│   └── ui/                      # Shared UI components
├── lib/
│   ├── db.ts                    # MongoDB connection
│   ├── auth.ts                  # NextAuth config
│   ├── paystack.ts              # Paystack API helpers
│   └── email.ts                 # Nodemailer + email templates
├── store/
│   └── cartStore.ts             # Zustand cart store
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
├── middleware.ts                 # Route protection via NextAuth
└── public/                      # Static assets
```

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| name | String | Required |
| email | String | Unique, required |
| password | String | Hashed with bcryptjs; absent for OAuth users |
| role | String | `customer` (default) or `admin` |
| image | String | Profile picture URL |
| isVerified | Boolean | Email verification status |
| verifyOtp / verifyOtpExpiry | String / Date | Email OTP (30 min) |
| resetOtp / resetOtpExpiry | String / Date | Password reset OTP (15 min) |
| wishlist | ObjectId[] | Refs to Product |
| addresses | Object[] | Saved shipping addresses |

### Product
| Field | Type | Notes |
|---|---|---|
| name | String | Required |
| slug | String | Unique, auto-generated |
| description | String | Required |
| price | Number | Required |
| comparePrice | Number | Original price (for sale display) |
| images | String[] | Cloudinary URLs |
| category | String | `dresses`, `tops`, `bottoms`, `outerwear`, `accessories`, `sets`, `sale` |
| sizes | String[] | XS, S, M, L, XL, XXL, One Size |
| colors | String[] | |
| stock | Number | Min: 0; decremented on successful payment |
| featured / newArrival | Boolean | |
| tags | String[] | Full-text searchable |
| averageRating / totalReviews | Number | Computed from reviews |

### Order
| Field | Type | Notes |
|---|---|---|
| user | ObjectId | Ref to User |
| items | Object[] | product ref, name, image, size, color, quantity, price (snapshot) |
| shippingAddress | Object | fullName, street, city, state, country, phone |
| subtotal / shippingFee / discount / total | Number | NGN amounts |
| promoCode | String | Applied promo code |
| paymentReference | String | Unique Paystack reference |
| paymentStatus | String | `pending`, `paid`, `failed` |
| orderStatus | String | `processing`, `confirmed`, `shipped`, `delivered`, `cancelled` |
| trackingNumber | String | Optional |

### Review
| Field | Type | Notes |
|---|---|---|
| product | ObjectId | Ref to Product |
| user | ObjectId | Ref to User |
| rating | Number | 1–5 |
| comment | String | Min 10 characters |

### PromoCode
| Field | Type | Notes |
|---|---|---|
| code | String | Unique, uppercase |
| type | String | `percentage` or `fixed` |
| value | Number | Discount amount or percentage |
| minOrder | Number | Minimum order subtotal |
| maxUses | Number | Usage limit |
| usedCount | Number | Auto-incremented on use |
| expiresAt | Date | Expiry date |
| isActive | Boolean | Enable/disable toggle |

### Blog
| Field | Type | Notes |
|---|---|---|
| title | String | Required |
| slug | String | Unique, auto-generated |
| content | String | Full post body |
| excerpt | String | Short summary |
| coverImage | String | Cloudinary URL |
| category | String | |
| author | ObjectId | Ref to User |
| published | Boolean | Draft/published toggle |

---

## API Reference

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List products with filters & pagination |
| POST | `/api/products` | Admin | Create a product |
| GET | `/api/products/[id]` | Public | Get product by ID or slug |
| PUT | `/api/products/[id]` | Admin | Update a product |
| DELETE | `/api/products/[id]` | Admin | Delete a product |

**Query params for GET `/api/products`:**
`page`, `limit`, `category`, `newArrival`, `featured`, `minPrice`, `maxPrice`, `size`, `search`, `sort`

---

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/orders` | User | List own orders (admin sees all) |
| POST | `/api/orders` | User | Create order & initialise Paystack payment |
| GET | `/api/orders/[id]` | User | Get order detail |
| PATCH | `/api/orders/[id]` | Admin | Update order status / tracking number |

---

### Payments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/paystack/verify?reference=` | Public | Verify Paystack payment, mark order paid, decrement stock |

---

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/verify-email` | Verify email with OTP |
| POST | `/api/auth/forgot-password` | Send password reset OTP |
| POST | `/api/auth/reset-password` | Reset password with OTP |
| * | `/api/auth/[...nextauth]` | NextAuth (login, session, OAuth) |

---

### Other

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reviews?productId=` | Public | Get reviews for a product |
| POST | `/api/reviews` | User | Submit a review |
| POST | `/api/wishlist` | User | Toggle wishlist item |
| POST | `/api/promos/validate` | Public | Validate a promo code |
| GET | `/api/admin/analytics` | Admin | Dashboard analytics + out-of-stock products |
| POST | `/api/upload` | Admin | Upload image to Cloudinary |

---

## Authentication & Authorization

- **NextAuth.js** handles sessions with JWT strategy
- Two providers: **Credentials** (email + password) and **Google OAuth**
- New email/password accounts require OTP verification before sign-in
- Route protection is handled in `middleware.ts`:
  - `/admin/*` — requires `role: "admin"`
  - `/checkout`, `/orders`, `/profile`, `/wishlist` — requires any authenticated session
- Admin role is set directly in the database on the User document

---

## Payment Flow

1. User fills out checkout form and clicks **Place Order**
2. `POST /api/orders` creates an Order (`paymentStatus: "pending"`) and calls Paystack's `initializePayment` API
3. User is redirected to Paystack's hosted payment page
4. On completion, Paystack redirects back to `/api/paystack/verify?reference=<ref>`
5. The verify endpoint calls Paystack to confirm the transaction:
   - **Success:** Order updated to `paymentStatus: "paid"`, `orderStatus: "confirmed"`. Each product's stock is decremented by the purchased quantity (floors at 0).
   - **Failure:** Order updated to `paymentStatus: "failed"`

### Shipping Rates (NGN)

| State(s) | Rate |
|---|---|
| Lagos | ₦2,500 |
| FCT, Oyo, Osun | ₦3,000 |
| Rivers, Enugu, Anambra, Imo, Abia, Delta, Edo, Bayelsa, Kwara, Ondo, Ekiti | ₦3,500 |
| Cross River, Akwa Ibom, Kaduna, Niger, Benue, Plateau | ₦4,000 |
| Kano | ₦4,000 |
| Katsina, Sokoto, Zamfara, Kebbi, Gombe, Bauchi, Adamawa, Taraba, Jigawa | ₦4,500 |
| Borno, Yobe | ₦5,000 |
| Free shipping on orders over ₦100,000 | — |

---

## Email System

Emails are sent via **Nodemailer** using SMTP credentials from environment variables.

| Template | Trigger |
|---|---|
| `verifyEmailHtml` | After registration — sends OTP to verify email |
| `welcomeEmailHtml` | After email is verified — welcome message |
| `passwordChangedEmailHtml` | After password is successfully changed |
| `otpEmailHtml` | Forgot password — sends reset OTP (15 min expiry) |

All emails are styled to match the 5thJohnson brand (serif font, cream background, gold accents).

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Paystack account
- Cloudinary account
- SMTP email credentials (e.g. Gmail, Resend, Brevo)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/5thjohnson.git
cd 5thjohnson

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating an Admin Account

1. Register a regular account via `/register`
2. Verify your email
3. Connect to your MongoDB database and update your user document:

```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

4. Sign in and navigate to `/admin`

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in each value:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/5thjohnson

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Paystack (from Paystack Dashboard)
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key

# Cloudinary (from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password
EMAIL_FROM="5thJohnson <no-reply@5thjohnson.com>"

# Admin notifications
ADMIN_EMAIL=admin@5thjohnson.com

# Public
NEXT_PUBLIC_WHATSAPP_NUMBER=08054257675
NEXT_PUBLIC_SITE_URL=https://5thjohnson.com
```

---

## Deployment

The app is designed to deploy on **Vercel**.

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Vercel Deployment Steps

1. Push your repository to GitHub
2. Import the project in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel project settings
4. Deploy — Vercel auto-detects Next.js and configures everything

### Important Production Checklist

- Switch Paystack keys from `sk_test_` / `pk_test_` to live keys (`sk_live_` / `pk_live_`)
- Set `NEXTAUTH_URL` to your production domain
- Set `NEXT_PUBLIC_SITE_URL` to your production domain
- Ensure your MongoDB Atlas cluster allows connections from Vercel's IP ranges (or use `0.0.0.0/0` with a strong password)
- Configure your SMTP provider to allow sending from your production domain
