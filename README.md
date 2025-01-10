# Curotec - Collaborative Drawing Board

Technical assessment created for Curotec. The project is a collaborative drawing board that allows multiple users to draw in real-time, along with other cool features!

## 🖥️ Frontend

The frontend is built with the following technologies:
- React
- Tailwind CSS
- TypeScript
- Socket.IO
- Context API

### Running the Frontend

1. Navigate to the frontend directory:
```bash
   cd frontend
 ```

2. Install dependencies:
```bash
   npm install
```

3. Create a .env file in the root of the project with the following values:
```bash
VITE_SOCKET_URL=<YOUR_SOCKET_URL>
VITE_API_URL=<YOUR_API_URL>
VITE_LOCAL_STORAGE_KEY=<YOUR_LOCAL_STORAGE_KEY>
```

4. Start the development server:
```bash
npm run dev
```

## ⚙ Backend

The backend is built with the following technologies:
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- Node-canvas

### Running the backend

1. Navigate to the backend directory:
```bash
   cd backend
 ```

2. Install dependencies:
```bash
   npm install
```

3. Create a .env file in the root of the project with the following values:
```bash
MONGO_URI=<YOUR_MONGO_DB_URL>
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRY=<YOUR_JWT_EXPIRY_TIME>
```

4. Start the development server:
```bash
npm run dev
```
