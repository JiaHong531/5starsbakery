# 5 Stars Bakery - Project Blueprint

## 1. Project Overview
**5 Stars Bakery** is a Java-based e-commerce website dedicated to offering high-quality baked goods such as cakes, muffins, cupcakes, and cookies. The system aims to provide a smooth, interactive, and responsive user experience for customers to browse and purchase fresh bakery items.

### Core Philosophy
- **"NO ADDED PRESERVATIVES"**
- **"Freshly baked in controlled batches to ensure optimum shelf-life and flavour."**
- **Pre-order Model**: Bake-on-demand approach (similar to a pizza shop) to ensure freshness.

## 2. Objectives & Scope
The primary objective is to construct a software application based on the **Java programming language** with a user-friendly graphical user interface (Web GUI).

### Target Audience
- Customers looking for fresh, organic, or healthy baked goods.
- Administrators managing orders and products.

## 3. Functional Requirements (MoSCoW)

### MUST HAVE (Critical)
- **Product Browsing**: View items with details.
- **Sorting/Categorization**: Sort by Cake, Cookie, Muffin, etc.
- **Product Details**:
    - Ingredients list.
    - Calorie information.
- **Shopping Cart & Purchasing**: Add to cart, checkout flow.
- **Payment Integration**: Secure payment processing.
- **User Accounts**: Login/Register (implied by "Order Management").

### SHOULD HAVE (Important)
- **Eco-friendly Packaging Options**: "Packaging 环保 (Design enough)".
- **Healthy/Organic Options**: Highlight healthy ingredients.

### MAY HAVE (Nice to have)
- **Vouchers/Coupons**.
- **Customer Feedback & Ratings**.
- **Order Management**: Track order status.

## 4. Technology Stack

### Frontend
- **Framework**: ReactJS + Vite
- **Styling**: TailwindCSS (inferred from "Hex (Tailwind)" in color palette notes) or CSS Modules.
- **Hosting**: Vercel

### Backend
- **Language**: **Java** (Strict Requirement)
- **Constraints**: **NO Web Application Frameworks** (e.g., Spring, Struts, GWT are **prohibited**).
    - *Implication*: Must use standard Java EE (Servlets, JSP) or a raw socket/HTTP server implementation depending on strictness of "Background Java processing".
- **Hosting**: Render

### Database
- **System**: MySQL

### DevOps & Tools
- **Version Control**: Git & GitHub (Mandatory - 10% of grade).
- **Containerization**: Docker (New Feature).

## 5. Design System

### Color Palette
| Usage | Color | Hex Code | Tailwind Approx |
| :--- | :--- | :--- | :--- |
| **Navbar, Header, Border** | **Dark Brown** | `#4E342E` | `yellow-950` |
| **Background** | **Cream** | `#FFFDD0` | `yellow-100` |
| **Background (Alt)** | **Periwinkle** | `#CCCCFF` | `indigo-200` |
| **Button, Logo** | **Peach** | `#FFAB91` | `red-300` |
| **Button, Logo (Alt)** | **Yellow** | `#FFD54F` | `amber-300` |

### Aesthetics
- **Vibe**: Warm, inviting, fresh, premium.
- **References**:
    - [Delectable.com.my](https://delectable.com.my/)
    - [LavenderBakery.com.my](https://lavenderbakery.com.my/)

## 6. Evaluation Rubric & Constraints

### Mark Distribution
- **Part 1: Web GUI (40%)**: User-friendly for user & admin. Demonstrates web technologies (JS).
- **Part 2: Java Processing (40%)**: Demonstrates OOP Java, processing, input/output.
    - *Critical*: "Java is not used" = 0 marks for this section.
    - *Critical*: **NO Frameworks** (Spring, etc.).
- **Part 3: Git (10%)**: Frequent use of Git/GitHub.
- **Part 4: Overall (10%)**: Presentation quality.

### Important Dates
- **Team Registration**: Oct 2025
- **Final Submission**: 11 January 2026
- **Demo/Presentation**: 12-16 January 2026

## 7. Team Structure
- **Size**: 3-4 members.
- **Roles**: Project Manager (must report MIA members), Developers.
