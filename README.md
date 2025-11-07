# Book Management Case Study - GITS
---

## Tech Stack
- **Backend:** Laravel PHP, MySQL, JWT Authentication  
- **Frontend:** Vue 3, Vite
- **API Testing:** Postman collection

---

## Getting Started

### 1. Clone Repository
- git clone https://github.com/your-username/book-management.git
- cd book-management

### 2. Setup Backend
Open book-management-backend
- cp .env.example .env
- composer install
- php artisan key:generate

JWT Setup:
- After installing dependencies, generate your JWT secret key: **php artisan jwt:secret**
- This will add a line like below to your .env file: **JWT_SECRET=your_generated_secret_key_here**

Database Migrate and Seeder:
- php artisan migrate --seed
- php artisan serve

### 3. Setup Frontend
Open book-management-frontend
- Add API Base URL: **VITE_API_BASE_URL=**
- npm install
- npm run dev

### 4. Import the Postman collection included in the repo.
- Use /register or /login endpoint to generate a JWT token.
- Set Authorization: Bearer <token> in headers to access protected endpoints.
  
