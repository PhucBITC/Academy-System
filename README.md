# 🎓 Academy Course System (Phuc Academy)

> A modern, full-stack online learning platform built with **Spring Boot** and **Next.js**.

![Project Status](https://img.shields.io/badge/Status-Development-green)
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.1-green)
![Next.js](https://img.shields.io/badge/Next.js-13-black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## 📖 Overview

**Academy Course System** is a comprehensive e-learning platform designed to connect students with high-quality courses. It features a robust **Microservices-ready Backend** (Spring Boot) and a highly responsive, interactive **Frontend** (Next.js), giving users a seamless experience from registration to course enrollment.

This project demonstrates advanced full-stack development skills, including **OAuth2 Social Login**, **JWT Security**, **Payment Gateway Integration** (PayPal, PayOS), and **Cloud Media Management**.

## ✨ Key Features

### 🔐 Authentication & Security
*   **Secure Login/Register**: JWT-based authentication with HTTP-Only Cookies.
*   **Social Login**: Integration with **Google**, **Facebook**, and **GitHub** providers.
*   **Role-Based Access Control (RBAC)**: Distinct permissions for Students, Instructors, and Admins.
*   **Password Encryption**: BCrypt hashing for top-tier security.

### 📚 Course Management
*   **Smart Filtering**: Filter courses by **Rating**, **Price**, **Category**, and **Level** usage complex algorithms.
*   **Pagination & Sorting**: Optimized data fetching for large datasets.
*   **Rich Media**: Video and image support powered by **Cloudinary**.

### 💳 Payments & E-Commerce
*   **PayPal Integration**: Global payment standard support.
*   **PayOS Integration**: Localized payment gateway for improved accessibility.
*   **SaaS Styling**: Modern, clean UI with **Bootstrap 5** and custom CSS animations.

## 🛠️ Tech Stack

### Backend (Java / Spring Boot)
*   **Framework**: Spring Boot 3.3.1 (Spring Web, Spring Data JPA, Spring Security).
*   **Language**: Java 21.
*   **Database**: MySQL.
*   **Security**: OAuth2 Client, JWT (jjwt), HttpSecurity.
*   **Tools**: Lombok, Maven, Dotenv (for environment security).
*   **Integrations**: Cloudinary (Media), PayPal REST SDK, PayOS, JavaMailSender.

### Frontend (Next.js / React)
*   **Framework**: Next.js 13 (App Router & Pages Router hybrid).
*   **Language**: TypeScript / JavaScript.
*   **Styling**: Bootstrap 5, React Bootstrap, Custom CSS Modules, FontAwesome.
*   **State Management & Fetching**: SWR (Stale-While-Revalidate).
*   **Auth**: NextAuth.js.
*   **Notifications**: React Toastify.

## 🚀 Getting Started

### Prerequisites
*   **Java Development Kit (JDK)**: Version 21.
*   **Node.js**: Version 18+.
*   **MySQL**: Installed and running locally.
*   **Maven**: For backend dependency management.

### 1. Database Setup
Create a MySQL database named `academy_db` (or update `application.properties`):
```sql
CREATE DATABASE academy_db;
```

### 2. Backend Setup (`/BackEndCourse`)
Navigate to the backend directory and configure your environment variables (or `application.properties`):
```bash
# Example env vars
DB_URL=jdbc:mysql://localhost:3306/academy_db
DB_USER=root
DB_PASSWORD=your_password
GOOGLE_CLIENT_ID=...
FACEBOOK_CLIENT_ID=...
PAYPAL_CLIENT_ID=...
CLOUDINARY_URL=...
```

Run the application:
```bash
mvn spring-boot:run
```
*Server runs on port `8080` by default.*

### 3. Frontend Setup (`/FrontendCourse`)
Navigate to the frontend directory:
```bash
cd FrontendCourse
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_jwt_secret
GOOGLE_ID=...
GOOGLE_SECRET=...
```

Run the development server:
```bash
npm run dev
```
*Client runs on `http://localhost:3000`.*

## 📸 Screenshots

*(Add your screenshots here to show off the UI!)*

| Home Page | Login Modal | Course Details |
|:---:|:---:|:---:|
| ![Home](path/to/home.png) | ![Login](path/to/login.png) | ![Course](path/to/course.png) |

## 🤝 Contributing
Contributions are welcome! Please fork this repository and submit a Pull Request.

## 📞 Contact
**Phuc** - Full Stack Developer
*   Email: [Your Email]
*   GitHub: [Your GitHub Profile]
