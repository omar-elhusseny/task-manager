# Task Management Backend

This is a **Node.js and Express** backend for a simple task management application. It provides **session-based authentication** and allows users to create, update, delete, and retrieve tasks.

## Features
- **User Authentication** (Session & Cookies)
- **Task CRUD Operations** (Create, Read, Update, Delete)
- **MongoDB Database** (via Mongoose)
- **Session Storage** (using `connect-mongo`)
- **Protected Routes** (Ensures only logged-in users can access)

---

## 🚀 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/omar-elhusseny/task-manager.git
   cd your-repo-name
2. Install dependencies:
   ```sh
   npm install
3. Create a .env file and configure environment variables:
   ```sh
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
4. Start the server:
   ```sh
   npm start

---

## 📌 API Endpoints

### Auth Routes
- POST /api/v1/auth/register – Register a new user
- POST /api/v1/auth/login – Login

### User Routes (Protected)
- GET /api/v1/users – Get the profile for logged in user
- POST /api/v1/users/logout – Logout the user account
- PUT /api/v1/users – Update user info
- PUT /api/v1/users/password – Update user password

### Task Routes (Protected)
- GET /api/v1/tasks – Get all tasks for logged in user
- GET /api/v1/tasks/:id – Get specific task
- POST /api/v1/tasks – Add a task
- PATCH /api/v1/tasks/:id – Edit specific task
- DELETE /api/v1/tasks/:id – Delete specific task

---

## 📜 Technologies Used
- Node.js & Express.js (Backend)
- MongoDB & Mongoose (Database)

---

## 👨‍💻 Contributing
- Fork the project
- Create a new branch (git checkout -b feature-name)
- Commit changes (git commit -m "Add feature")
- Push to branch (git push origin feature-name)
- Open a Pull Request








