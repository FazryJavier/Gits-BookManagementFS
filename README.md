# Book Management Case Study - GITS
---

## Tech Stack
- **Backend:** Laravel PHP, MySQL, JWT Authentication  
- **Frontend:** Vue 3, Vite
- **API Testing:** Postman collection included  
- **Other:** Seeder & Migration scripts for quick setup  

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
- php artisan migrate --seed
- php artisan serve

### 3. Setup Frontend
Open book-management-frontend
- VITE_API_BASE_URL=
- npm install
- npm run dev

### 4. Import the Postman collection included in the repo.
- Use /register or /login endpoint to generate a JWT token.
- Set Authorization: Bearer <token> in headers to access protected endpoints.
  
