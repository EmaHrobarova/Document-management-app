# Document Management Application

A full-stack web application for managing documents with tagging and search capabilities.

## Features

- User authentication (sign up, login, logout)
- Document upload and management
- Tagging system for documents
- Search functionality for documents by tags
- Responsive design for mobile and desktop
- RESTful API for document operations

### Backend
- **Framework**: Laravel (PHP)
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **API**: RESTful API endpoints

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **UI Components**: react-select/creatable for tag selection
- **Pagination**: react-paginate

## Installation
### Prerequisites
- PHP 8.0 or higher
- Composer
- Node.js and npm
- MySQL

### Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure your database in `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run migrations:
```bash
php artisan migrate
```

7. Start the development server:
```bash
php artisan serve
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`