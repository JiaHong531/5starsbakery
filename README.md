# 🎂 5 Stars Bakery
> *Freshly Baked Java Code. Served with React.*

Welcome to the **5 Stars Bakery** project repository! This is a Java-based e-commerce website offering a variety of baked goods such as cakes 🍰, muffins 🧁, cupcakes 🧁, and cookies 🍪. Key features include product browsing 🔎, shopping cart 🛍️, order management 🗂️, and customer feedback 📝. The system aims to provide a smooth user experience through an interactive and responsive design.

Built for the **CAT201** assignment.

## 🌐 Live Demo
- **Frontend:** [https://5starsbakery.vercel.app](https://5starsbakery.vercel.app)
- **Backend API:** [https://bakery-backend-kt9m.onrender.com](https://bakery-backend-kt9m.onrender.com)

---

## 🛠️ The Kitchen (Tech Stack)
*   **Frontend:** ⚛️ React 19 + Vite (Tailwind CSS)
*   **Backend:** ☕ Java 21 (Jakarta Servlets 6.0) + Maven
*   **Database:** 🐬 MySQL 8.0 / TiDB Cloud
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
git clone https://github.com/JiaHong531/5starsbakery.git
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
3. Install dependencies and start the local server:
```bash
npm install
npm run dev
```

### Step 4: Prep the Backend (Java) ☕
1. Open **IntelliJ IDEA**.
2. **File > Open** > Select the `backend` folder.
3. ⚠️ **Crucial:** Click the tiny "M" (Maven) icon in the top-right toolbar to load dependencies.
4. Verify Database Connection:
    *   Navigate to `src/main/java/com/fivestarsbakery/util/DBConnection.java`
    *   Run the `main` method (Green Play Button ▶️).
    *   *Success if it prints:* `✅ Database Connected Successfully!`

### Step 5: Serve the Pastries (Start Server) 🚀
To make the API work (`http://localhost:8080/api`):
1. In IntelliJ, add a **Run Configuration**.
2. Select **Smart Tomcat** (or your preferred Servlet container).
3. Set **Deployment Directory** to `src/main/webapp`.
4. Set **Context Path** to `/`.
5. Click **Run** (Green Play Button).

---

## 📚 References

1.  **Start a new React project – React.** (n.d.). https://react.dev/learn/start-a-new-react-project
2.  **Getting Started – Vite.** (n.d.). https://vitejs.dev/guide/
3.  **Tailwind CSS Documentation – Tailwind CSS.** (n.d.). https://tailwindcss.com/docs
4.  **React Router Documentation – React Router.** (n.d.). https://reactrouter.com/en/main
5.  **Jakarta Servlet 6.0 Specification – Eclipse Foundation.** (n.d.). https://jakarta.ee/specifications/servlet/6.0/
6.  **Gson User Guide – Google.** (n.d.). https://github.com/google/gson/blob/master/UserGuide.md
7.  **Redmond, E. (2008, January 1). Maven in 5 minutes – Maven.** https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html
8.  **MySQL Connector/J 8.3 Developer Guide – Oracle.** (n.d.). https://dev.mysql.com/doc/connector-j/8.3/en/
9.  **TiDB Cloud Documentation – PingCAP.** (n.d.). https://docs.pingcap.com/tidbcloud/
10. **Vercel Documentation – Vercel.** (n.d.). https://vercel.com/docs
11. **Render Docs – Render.** (n.d.). https://render.com/docs
