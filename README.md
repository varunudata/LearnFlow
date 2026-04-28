<div align="center">
  <h1>📚 LearnFlow</h1>
  <p>A unified, full-stack educational platform for managing structured learning content, student enrollments, progress tracking, assignments, and grading.</p>
  <p>
    <a href="https://docs.google.com/document/d/1a8_4bdsIvn7-F-G2lw_0nVh9hZuMeoAag6nDOJ8IG1U/edit?usp=sharing"><strong>📄 View the Full Project Report Here</strong></a>
  </p>
</div>

---

## 📖 Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [API Documentation](#api-documentation)
6. [Project Structure](#project-structure)
7. [Installation & Setup](#installation--setup)
8. [Environment Variables](#environment-variables)
9. [License](#license)

---

## 🌟 Introduction

LearnFlow is a modern Learning Management System (LMS) tailored to bridge the gap between educators and students. It offers a dedicated workspace where **Faculty** can seamlessly create structured courses, upload materials, and grade assignments, while **Students** can easily enroll in subjects, track their progress, and submit coursework. The system utilizes role-based access control (RBAC) to ensure a secure and organized learning environment.

---

## ✨ Features

### For Faculty
- **Course Management:** Create, update, and delete courses. Organize materials into comprehensive modules.
- **Enrollment Moderation:** Review and either approve or reject student enrollment requests.
- **Assignment Creation:** Publish detailed assignments with deadlines.
- **Grading System:** Review submitted files and provide grades directly on the platform.

### For Students
- **Course Discovery:** Browse the catalog of available courses and request enrollment.
- **Dashboard Tracking:** View currently enrolled courses and upcoming pending assignments.
- **Assignment Submissions:** Easily upload files and submit text-based answers for active assignments.

---

## 🚀 Technology Stack

### Frontend (Client)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** Axios

### Backend (Server)
- **Framework:** [Express.js](https://expressjs.com/) (Node.js)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **File Uploads:** Multer (Local Storage)

---

## 🏗️ System Architecture

LearnFlow follows a decoupled client-server architecture:
- **Client Application (`/client`):** A server-rendered and statically generated Next.js application that handles UI routing and state, communicating with the backend via RESTful APIs.
- **Backend API (`/server`):** An Express server adhering strictly to MVC and Service/Repository patterns to abstract database operations and business logic from the routing layer.
- **Data Persistence:** Relational data mapped via Prisma to a PostgreSQL database, ensuring strict data integrity between Users, Courses, Enrollments, Assignments, and Submissions.

*(Note: Check the `/diagrams` folder in the repository for detailed Sequence, UML, and ER diagrams).*

---

## 🔌 API Documentation

All backend API routes are prefixed with `/api`. Authentication is required for most endpoints, enforced via the `requireAuth` middleware, which expects a `Bearer <token>` in the Authorization header. Role-based routes use `requireRole('student')` or `requireRole('faculty')`.

### 1. Authentication API (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Registers a new user (Student or Faculty). | Public |
| **POST** | `/login` | Authenticates a user and returns a JWT token. | Public |

### 2. Courses API (`/api/courses`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Retrieves a list of all available courses. | Authenticated |
| **POST** | `/` | Creates a new course. | Faculty Only |
| **PUT** | `/:id` | Updates an existing course by its ID. | Faculty Only |
| **DELETE** | `/:id` | Deletes a course. | Faculty Only |

### 3. Enrollments API (`/api/enrollments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/enroll` | Student requests enrollment in a course. | Student Only |
| **GET** | `/my-courses` | Retrieves the authenticated student's enrolled courses. | Student Only |
| **GET** | `/pending` | Retrieves all pending enrollments for a faculty's courses. | Faculty Only |
| **GET** | `/course/:courseId` | Retrieves all enrollments for a specific course. | Faculty Only |
| **PUT** | `/approve/:id` | Approves a student's pending enrollment. | Faculty Only |
| **PUT** | `/reject/:id` | Rejects a student's pending enrollment. | Faculty Only |

### 4. Assignments API (`/api/assignments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/my-assignments` | Retrieves assignments for the student's enrolled courses. | Student Only |
| **GET** | `/course/:courseId` | Retrieves all assignments for a specific course. | Authenticated |
| **POST** | `/` | Creates a new assignment for a course. | Faculty Only |

### 5. Submissions API (`/api/submissions`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/submit` | Submits an assignment (supports `multipart/form-data` file uploads). | Student Only |
| **GET** | `/assignment/:id` | Retrieves all student submissions for a specific assignment. | Faculty Only |
| **PUT** | `/grade/:id` | Grades a specific student's submission. | Faculty Only |

---

## 📂 Project Structure

```text
LearnFlow/
├── client/                     # Next.js Frontend App
│   ├── app/                    # Next.js App Router pages (Dashboard, Login, Signup)
│   ├── public/                 # Static assets
│   ├── lib/                    # Utility functions and API helpers
│   ├── package.json
│   └── tailwind.config.js
├── server/                     # Express Backend API
│   ├── config/                 # DB & Environment Configurations
│   ├── controllers/            # Route controllers (Request/Response handling)
│   ├── middleware/             # Auth & Role verification middlewares
│   ├── models/                 # Custom Domain Models
│   ├── prisma/                 # Prisma Schema & Database migrations
│   ├── routes/                 # Express Router definitions
│   ├── services/               # Business logic and Database interactions
│   ├── uploads/                # Local directory for assignment file uploads
│   └── index.js                # Server entry point
├── diagrams/                   # System Architecture and Flow Diagrams
└── README.md                   # Project Documentation
```

---

## ⚙️ Installation & Setup

Ensure you have **Node.js** (v18+) and **PostgreSQL** installed on your local machine before proceeding.

### 1. Database Configuration
1. Create a local PostgreSQL database (e.g., `learnflow_db`).
2. Navigate to the `/server` directory and create a `.env` file (see Environment Variables section).
3. Apply the Prisma schema to your database:
   ```bash
   cd server
   npx prisma db push
   ```

### 2. Start the Backend Server
```bash
cd server
npm install
npm start
```
The API server will typically start on `http://localhost:5000` (or the port defined in your `.env`).

### 3. Start the Frontend Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The Next.js application will be available at `http://localhost:3000`.

---

## 🔐 Environment Variables

You need to set up environment variables for the backend. Create a `.env` file in the `/server` directory:

```env
# Server Port
PORT=5000

# PostgreSQL Database Connection URL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/learnflow?schema=public"

# JWT Secret for signing tokens (Use a strong random string)
JWT_SECRET="your_super_secret_jwt_key_here"
```

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to modify, distribute, and use it for your educational or production needs.
