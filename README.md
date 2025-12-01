# 5starsbakery
5 Stars Bakery is a Java-based e-commerce website offering a variety of baked goods such as cakes, muffins, cupcakes, and cookies. Key features include product browsing, shopping cart, order management, and customer feedback. The system aims to provide smooth user experience through an interactive and responsive design.

⚠️ PREREQUISITES (Install these first):
Git: (Download Git Bash if on Windows).
Node.js: Download the LTS version.
Java JDK 17 or 21: (Amazon Corretto or Oracle).
IntelliJ IDEA: (Community Edition).
Docker Desktop: Install and make sure it is running (Green light).
STEP 1: GET THE CODE
Accept the GitHub invite I sent to your email.
Open Terminal/Command Prompt.
Run: git clone <YOUR_REPO_URL_HERE>
Run: cd 5-stars-bakery
STEP 2: START THE DATABASE (Magic Step)
You do NOT need to install MySQL manually. Docker does it for you.
Make sure Docker Desktop is running.
In the root folder (5-stars-bakery), run:
docker-compose up -d
Wait for it to finish downloading.
STEP 3: SETUP FRONTEND (React)
Open a terminal inside the frontend folder (cd frontend).
Run: npm install (This downloads the libraries).
Run: npm run dev
Open the link (http://localhost:5173). If you see the website, it works.
STEP 4: SETUP BACKEND (Java)
Open IntelliJ IDEA.
Click File > Open and select the backend folder (Not the root folder).
Crucial: Look for a tiny "M" icon (Maven) in the top-right corner and click it to download dependencies.
Go to src/main/java/com/fivestarsbakery/util/DBConnection.java.
Run the main method (Green Play Button).
If it prints "✅ Database Connected Successfully!", you are ready.
