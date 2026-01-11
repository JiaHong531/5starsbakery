# 🎂 5 Stars Bakery
> *Freshly Baked Java Code. Served with React.*

Welcome to the **5 Stars Bakery** project repository! This  is a Java-based e-commerce website offering a variety of baked goods such as cakes 🍰, muffins 🧁, cupcakes 🧁, and cookies 🍪. Key features include product browsing 🔎, shopping cart 🛍️, order management 🗂️, and customer feedback 📝. The system aims to provide smooth user experience through an interactive and responsive design.

Built for the **CAT201** assignment.

## 🌐 Live Demo
- **Frontend:** [https://5starsbakery.vercel.app](https://5starsbakery.vercel.app)
- **Backend API:** [https://bakery-backend-kt9m.onrender.com](https://bakery-backend-kt9m.onrender.com)

---

## 🛠️ The Kitchen (Tech Stack)
*   **Frontend:** ⚛️ React + Vite (Tailwind/CSS)
*   **Backend:** ☕ Java (Jakarta Servlets) + Maven
*   **Database:** 🐬 MySQL 8.0 (Dockerized)
*   **DevOps:** 🐳 Docker & Git

---

## 👨‍🍳 Baker's Setup Guide (How to Start)

**STOP!** Before you cook, make sure you have these **Ingredients** installed:
1.  **Git** (Git Bash for Windows)
2.  **Node.js** (LTS Version)
3.  **Java JDK 17 or 21**
4.  **IntelliJ IDEA** (Community Edition)
5.  **Docker Desktop** (MUST BE RUNNING 🟢)

### Step 1: Get the Recipe 📜
Clone the repository to your local kitchen.
```bash
git clone <PASTE_YOUR_REPO_URL_HERE>
cd 5-stars-bakery
```

### Step 2: Fire up the Oven (Database) 🔥
We use Docker, so you don't need to install MySQL manually.
1. Open Docker Desktop.
2. Run this command in the root folder:
```bash
docker-compose up -d
```
> This automatically creates the database, tables, and inserts dummy cakes! 🍰

### Step 3: Prep the Frontend 🎨
1. Open a new terminal.
2. Go to the frontend folder:
```bash
cd frontend
```
Next, install dependencies and start the server:
```bash
npm install
npm run dev
```

### Step 4: Prep the Backend (Java) ☕
1. Open IntelliJ IDEA.
2. File > Open > Select the backend folder.
3. ⚠️ Crucial: Click the tiny "M" (Maven) icon in the top-right to download dependencies.
4. Navigate to: src/main/java/com/fivestarsbakery/util/DBConnection.java
5. Run the main method (Green Play Button ▶️).

Success Criteria:

>If the console prints: ✅ Database Connected Successfully! ...then you are ready to code!

