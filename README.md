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

🏠 Home Page (FULL ảnh)
<img width="1346" height="597" alt="Screenshot 2026-01-31 151356" src="https://github.com/user-attachments/assets/1b19a31c-9fa8-411c-a66f-e1bf125a6ac8" />
<img width="1351" height="527" alt="Screenshot 2026-01-31 151432" src="https://github.com/user-attachments/assets/156efada-d6a2-47e0-8a4c-10f246c99a3c" />
<img width="1350" height="515" alt="Screenshot 2026-01-31 151447" src="https://github.com/user-attachments/assets/2bf2342f-b75b-49ac-8ebb-ba785d8843ea" />
<img width="1351" height="518" alt="Screenshot 2026-01-31 151504" src="https://github.com/user-attachments/assets/315ec188-98b4-40bd-80d8-ea249f7ea147" />
<img width="1353" height="512" alt="Screenshot 2026-01-31 151521" src="https://github.com/user-attachments/assets/c7b1a723-c493-42b4-9f09-501815cdc2cf" />
<img width="1260" height="488" alt="Screenshot 2026-01-31 151542" src="https://github.com/user-attachments/assets/ab2893c9-13dd-457c-80be-00c1e3293997" />
<img width="1338" height="278" alt="Screenshot 2026-01-31 151554" src="https://github.com/user-attachments/assets/482ef13f-7540-4e14-8aca-4fd5aa1f11a0" />

🔐 Login / Authentication (FULL)
<img width="400" height="432" alt="Screenshot 2026-01-31 151933" src="https://github.com/user-attachments/assets/a86b421c-5236-47ff-8e41-f2f860bb7cda" />
<img width="372" height="535" alt="Screenshot 2026-01-31 151954" src="https://github.com/user-attachments/assets/50bfdc45-4e22-4e13-bc81-21c6f1280765" />

📚 Course Details (FULL)
<img width="1347" height="556" alt="Screenshot 2026-01-31 152121" src="https://github.com/user-attachments/assets/98969fcc-9186-4617-842c-d88139de792f" />
<img width="1352" height="436" alt="Screenshot 2026-01-31 152144" src="https://github.com/user-attachments/assets/7ef42b6d-3672-4bba-b211-b1a017bc3f25" />
<img width="1162" height="531" alt="Screenshot 2026-01-31 152204" src="https://github.com/user-attachments/assets/5ef699dd-9895-413a-ae9a-d389dbdf00dc" />
[<img width="1157" height="502" alt="Screenshot 2026-01-31 152223" src="https://github.com/user-attachments/assets/bfefe7a6-97bb-4198-9ed0-d886fbd275fe" />
<img width="1332" height="253" alt="Screenshot 2026-01-31 152254" src="https://github.com/user-attachments/assets/a80d6bf0-22f2-4300-9d7b-7344ac76b61d" />

## 🤝 Contributing
Contributions are welcome! Please fork this repository and submit a Pull Request.

## 📞 Contact
**Phuc** - Full Stack Developer
*   Email: [Your Email]
*   GitHub: [Your GitHub Profile]
