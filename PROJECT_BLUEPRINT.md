# 5 Stars Bakery - Project Blueprint

## 1. Project Overview
**5 Stars Bakery** is a Java-based e-commerce website dedicated to offering high-quality baked goods such as cakes, muffins, cupcakes, and cookies. The system provides a smooth, interactive, and responsive user experience for customers to browse, purchase, and review fresh bakery items.

### Core Philosophy
- **"NO ADDED PRESERVATIVES"**
- **"Freshly baked in controlled batches to ensure optimum shelf-life and flavour."**
- **Pre-order Model**: Bake-on-demand approach to ensure freshness and reduce waste.

## 2. Objectives & Scope
The primary objective was to construct a robust software application using the **Java programming language** for the backend logic and a modern **Web GUI** for the frontend interface.

### Target Audience
- **Customers**: Looking for fresh, high-quality baked goods with easy online ordering.
- **Administrators**: Need efficient tools to manage products, categories, and track orders.

## 3. Implemented Features (MoSCoW)

### ✅ MUST HAVE (Critical - Delivered)
- **Product Browsing**: Dynamic grid view of items with images and prices.
- **Sorting/Categorization**: Filter by Cake, Cookie, Muffin, etc.
- **Product Details**: Full view with ingredients and calorie information.
- **Shopping Cart**: Add/remove items, update quantities, real-time total calculation.
- **Secure Checkout**: Order placement with payment method selection (Cash/Card).
- **User Accounts**: Registration and Login with JWT-based authentication.

### ✅ SHOULD HAVE (Important - Delivered)
- **Order Management (User)**: "Order History" page to track order status (Pending → Ready).
- **Order Management (Admin)**: Dashboard to view, update statuses, and cancel orders.
- **Responsive Design**: Fully mobile-friendly UI using Tailwind CSS.

### ✅ MAY HAVE (Bonus - Delivered)
- **Customer Feedback**: Users can rate (1-5 stars) and review products after purchase.
- **Receipt Generation**: Printable receipts for orders.
- **Search Functionality**: Real-time search for products on Home and Admin Dashboard.

## 4. Technology Stack

### Frontend
- **Framework**: React 19 + Vite (High-performance build tool)
- **Styling**: Tailwind CSS v3.4 (Utility-first framework)
- **Hosting**: Vercel (Global CDN)

### Backend
- **Language**: **Java 21**
- **Architecture**: Servlet-based Monolith (Jakarta Servlet 6.0)
- **Constraints**: **NO Web Frameworks** (Clean Java EE implementation).
- **Hosting**: Render (Cloud Application Platform)

### Database
- **System**: TiDB Cloud (Distributed SQL, MySQL 8.0 Compatible)
- **Connection**: JDBC (MySQL Connector/J 8.3)

### DevOps & Tools
- **Version Control**: Git & GitHub.
- **Containerization**: Docker & Docker Compose.
- **Build Tools**: Maven (Backend), npm (Frontend).

## 5. Design System

### Color Palette
| Usage | Color | Hex Code | Tailwind Approx |
| :--- | :--- | :--- | :--- |
| **Primary / Header** | **Dark Brown** | `#4E342E` | `yellow-950` |
| **Background** | **Cream** | `#FFFDD0` | `yellow-100` |
| **Background (Alt)** | **Periwinkle** | `#CCCCFF` | `indigo-200` |
| **Accents** | **Peach** | `#FFAB91` | `red-300` |
| **Highlights** | **Yellow** | `#FFD54F` | `amber-300` |

### Aesthetics
- **Vibe**: Warm, inviting, fresh, and premium.
- **Inspiration**: Minimalist e-commerce sites with a focus on food photography.

## 6. Project Stats
- **Team Size**: 4 members.
- **Duration**: Oct 2025 - Jan 2026.
- **Submission Date**: 11 January 2026.
