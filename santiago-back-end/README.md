# Santiago Portfolio Backend (In-Memory Mode)

Backend server for the Santiago Portfolio MERN application. This server provides API endpoints for user authentication, article management, and more. This version uses in-memory data storage instead of MongoDB for easier setup and deployment.

## Features

- User authentication with JWT
- User management (admin only)
- Article CRUD operations
- Article statistics
- Role-based access control
- In-memory data storage (no database required)

## Tech Stack

- Node.js
- Express.js
- JWT Authentication
- CORS enabled
- In-memory data structures

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd santiago-back-end
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
PORT=5000
```

### Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Deploying to Vercel

### Step 1: Create a vercel.json file
Create a `vercel.json` file in the root directory with the following content:
```json
{
  "version": 2,
  "name": "santiago-backend",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Step 2: Set up Environment Variables
In the Vercel dashboard, set up the following environment variables:
- `JWT_SECRET`: A secure random string for JWT authentication
- `NODE_ENV`: Set to "production"

### Step 3: Deploy
Connect your GitHub repository to Vercel and deploy.

## Default Admin User

The server comes with a pre-configured admin user:
- Email: admin@example.com
- Password: password123

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### User Management
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### Articles
- `GET /api/articles` - Get all articles (public can see published only)
- `GET /api/articles/:name` - Get single article by name
- `POST /api/articles` - Create new article (editor/admin only)
- `PUT /api/articles/:id` - Update article (editor/admin/author only)
- `DELETE /api/articles/:id` - Delete article (admin/author only)
- `GET /api/articles/stats` - Get article statistics (editor/admin only)

## Common Issues & Solutions

### Port Already in Use
If port 5000 is already in use, change the PORT in the .env file or in server.js.

### Authentication Issues
- Verify JWT_SECRET is properly set in .env
- Check token expiration and validity

## License

MIT 