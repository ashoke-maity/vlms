# VLMS Setup Guide

## Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend URL:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   PORT=5000
   SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
   SUPABASE_PROJECT_URL=your_supabase_project_url
   SUPABASE_JWT_SECRET=your_jwt_secret
   USER_ROUTES=/vlms/user
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## API Integration

The frontend is now connected to the backend with the following features:

### Authentication
- **Login**: `POST /vlms/user/login`
- **Register**: `POST /vlms/user/register`
- **Auto token refresh**: Handled automatically
- **Protected routes**: Use `ProtectedRoute` component

### Usage Examples

#### Login
```javascript
import { useAuth } from './hooks/useAuth';

const { login } = useAuth();
const result = await login({ email, password });
```

#### Register
```javascript
import { useAuth } from './hooks/useAuth';

const { register } = useAuth();
const result = await register({ firstName, lastName, email, password });
```

#### Protected Routes
```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
```

## Database Schema (Supabase)

Make sure your Supabase database has the following table:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  Email VARCHAR(255) UNIQUE NOT NULL,
  FirstName VARCHAR(100) NOT NULL,
  LastName VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Features Implemented

✅ User authentication (login/register)  
✅ JWT token management  
✅ Protected routes  
✅ User context/state management  
✅ API service layer  
✅ Error handling  
✅ Responsive UI  

## Next Steps

1. Set up Supabase database tables
2. Test authentication flow
3. Implement video CRUD operations
4. Add file upload functionality
5. Create admin panel