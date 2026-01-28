# MicroLift - Micro-Donation Crowdfunding Platform

MicroLift is a full-stack micro-donation platform designed to connect donors with beneficiaries (students, patients, etc.) directly. It uses a **Microservices Architecture** to ensure scalability, resilience, and clean separation of concerns.

---

## 🏗️ 1. Architecture Overview (Workflow)

The system is composed of decentralized microservices that communicate via REST APIs, managed by a central API Gateway.

### **Core Workflow**
1.  **Registration**: Users register as *Beneficiary*, *Donor*, or *Admin* via the `Auth Service`.
2.  **Campaign Creation**: Beneficiaries create campaigns (uploading thumbnails/docs) via the `Campaign Service`.
3.  **Verification**: Admins review campaigns (approve/reject) via the **Admin Panel**.
4.  **Donation**: Donors browse active campaigns and donate via the `Donation Service` (integrated with Mock/Razorpay).
5.  **Discovery**: All services register with `Eureka Server` for dynamic discovery.
6.  **Routing**: The `API Gateway` routes all frontend requests to the appropriate service.

---

## 🗄️ 2. Database Schema (Per Microservice)

Each service has its own dedicated database (Database per Service pattern).

### **A. Auth Service DB** (`microlift_auth_db`)
**Table: `users`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Unique User ID |
| `full_name` | VARCHAR | User's full name |
| `email` | VARCHAR | Unique email (Username) |
| `password` | VARCHAR | Encrypted password |
| `phone_number` | VARCHAR | Contact number |
| `role` | ENUM | `DONOR`, `BENEFICIARY`, `ADMIN` |
| `is_verified` | BOOLEAN | Account verification status |
| `created_at` | DATETIME | Timestamp |

### **B. Campaign Service DB** (`microlift_campaign_db`)
**Table: `campaigns`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Campaign ID |
| `title` | VARCHAR | Campaign Title |
| `category` | ENUM | `EDUCATION`, `MEDICAL`, `EMERGENCY`... |
| `goal_amount` | DOUBLE | Target funds |
| `raised_amount` | DOUBLE | Funds collected so far |
| `status` | ENUM | `PENDING`, `ACTIVE`, `REJECTED` |
| `image_url` | TEXT | URL to thumbnail image |
| `beneficiary_id`| BIGINT | ID of the user who owns the campaign |
| `created_at` | DATETIME | Timestamp |

**Table: `document`** (Linked to Campaign)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT | Document ID |
| `url` | VARCHAR | Path to file (local/S3) |
| `type` | VARCHAR | `VERIFICATION_DOC`, `REPORT` |
| `campaign_id` | FK | Links to Campaign |

### **C. Donation Service DB** (`microlift_donation_db`)
**Table: `donations`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Donation ID |
| `amount` | DOUBLE | Amount donated |
| `campaign_id` | BIGINT | Target Campaign |
| `donor_id` | BIGINT | Donor User ID |
| `transaction_id`| VARCHAR | Payment Gateway Ref ID |
| `status` | VARCHAR | `SUCCESS`, `FAILED` |
| `payment_method`| VARCHAR | `razorpay`, `mock_qr` |

---

## 🖥️ 3. Backend Services (Spring Boot)

| Service Name | Port | Description |
| :--- | :--- | :--- |
| **Discovery Server** | `8761` | Eureka Registry. All services register here. |
| **API Gateway** | `8080` | Entry point. Routes `/api/auth` -> Auth, `/api/campaigns` -> Campaign, etc. Handles CORS. |
| **Auth Service** | `8081` | Manages Registration, Login, and JWT Token generation. |
| **Campaign Service** | `8082` | Handles CRUD for Campaigns, File Uploads, and Admin Verification logic. |
| **Donation Service** | `8083` | Manages Donation Records and Payment Gateway Integration (Razorpay/Mock). |

---

## 🎨 4. Frontend Application (React + Vite)

A modern, responsive SPA built with **React**, **Bootstrap 5**, and **Vite**.

### **Key Components & Pages**

#### **Pages (`src/pages`)**
*   **Public Pages**:
    *   `Home.jsx`: Landing page with Hero section and Featured campaigns.
    *   `About.jsx`: Mission, Vision, and Platform description.
    *   `CampaignList.jsx`: Grid view of all active campaigns w/ filters.
    *   `CampaignDetail.jsx`: Full view of a campaign + "Donate" button.
*   **Auth Pages**:
    *   `Login.jsx` / `Register.jsx`: User authentication forms.
*   **Protected Pages**:
    *   `Dashboard.jsx`: Role-based wrapper. Redirects to specific dashboards.
    *   `CreateCampaign.jsx`: Form with **File Upload** support (Thumbnail/Docs).
    *   `AdminDashboard.jsx`: Table view for Admins to Approve/Reject campaigns.
    *   `Profile.jsx`: User profile management.

#### **Components (`src/components`)**
*   **Core**:
    *   `Navbar.jsx`: Dynamic nav (shows "Admin Panel" if Admin, "Login" if Guest).
    *   `Footer.jsx`: Site footer.
    *   `CampaignCard.jsx`: Reusable card component for lists.
*   **Features**:
    *   `DonationModal.jsx`: Popup with **QR Code UI** and Payment Integration.
    *   `dashboards/BeneficiaryDashboard.jsx`: Charts & Stats for Beneficiaries.
    *   `dashboards/AdminDashboard.jsx`: Internal admin logic.

---

## 🛠️ 5. Technical Stack & Techniques

### **Frontend Techniques**
*   **Context API (`AuthContext`)**: Manages Global User State (IsLoggedIn, UserRole, Token).
*   **Axios Interceptors**: Automatically attaches JWT Token to every outgoing request.
*   **React Router v6**: Handles protected routes and navigation.
*   **FormData API**: Used for handling Multi-part file uploads (Images/PDFs).
*   **Mock Payment Flow**: Custom UI to simulate UPI payments for testing without real money.

### **Backend Techniques**
*   **Microservices Pattern**: Decoupled services for independent scaling.
*   **Spring Cloud Gateway**: Centralized routing and CORS management.
*   **Eureka Discovery**: Dynamic service registration (no hardcoded IP addresses).
*   **Spring Data JPA**: ORM for Database interactions.
*   **File Storage**: Local file system storage strategy for uploaded documents.
*   **JWT Authentication**: Stateless security mechanism.

---

## 🚀 How to Run locally

1.  **Start Databases**: Ensure MySQL is running on port `3306`.
2.  **Start Backend**: Run `./run_microservices.ps1` (Starts all 5 services).
3.  **Start Frontend**: Run `npm run dev` in the project root.
4.  **Access App**: Open `http://localhost:5173`.
