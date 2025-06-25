# ServiceHub Pro

A modern web application for connecting customers with professional electronic repair service providers. Built with React 19, Firebase Authentication, and a comprehensive booking system.

## 🌟 Features

### ✅ Currently Implemented

- **🔐 Firebase Authentication System**
  - Email/Password registration and login
  - Google OAuth integration
  - Persistent login sessions
  - Protected routes with automatic redirection

- **🎨 Modern UI/UX Design**
  - Responsive design for all devices
  - Dark/Light theme toggle with persistence
  - Professional interface using Tailwind CSS + DaisyUI
  - Smooth animations and transitions

- **🏠 Landing Pages**
  - Dynamic home page with popular services
  - Comprehensive all services page with search functionality
  - Professional navbar with authentication-based menus
  - Complete footer with contact information

- **📱 Responsive Navigation**
  - Desktop and mobile-friendly navbar
  - Dashboard dropdown for authenticated users
  - Dynamic menu items based on user authentication status

- **🔍 Search Functionality**
  - Real-time service search on All Services page
  - Filter by service name, description, or location

- **📋 Service Categories**
  - Electronic Item Repairing Services focus
  - Smartphone, laptop, TV, AC, and appliance repairs
  - Service provider information display

### 🚧 In Development

- Service Details page with booking functionality
- Add Service page for service providers
- Manage Services page for CRUD operations
- Booked Services page for customers
- Service To-Do page for providers
- Backend API integration

## 🛠 Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Lucide React** - Modern icon library
- **SweetAlert2** - Beautiful alert dialogs

### Authentication
- **Firebase Auth** - User authentication
- **Google OAuth** - Social login integration

### Backend (Setup Complete)
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **CORS** - Cross-origin resource sharing
- **JWT** - Token-based authentication (ready for implementation)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project setup
- MongoDB database (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ServiceHub-Pro
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd "ServiceHub Pro Client"
   npm install

   # Backend
   cd "../ServiceHub Pro Server"
   npm install
   ```

3. **Configure Environment Variables**

   **Frontend (.env)**
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=https://service-hub-pro-server.vercel.app/api
   ```

   **Backend (.env)**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start Development Servers**
   ```bash
   # Frontend (in ServiceHub Pro Client directory)
   npm run dev

   # Backend (in ServiceHub Pro Server directory)
   npm run dev
   ```

## 📁 Project Structure

```
ServiceHub Pro/
├── ServiceHub Pro Client/
│   ├── src/
│   │   ├── Auth/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── Components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── Context/
│   │   │   └── ThemeContext.jsx
│   │   ├── Firebase/
│   │   │   └── Firebase.config.js
│   │   ├── hooks/
│   │   │   └── usePageTitle.js
│   │   ├── Layout/
│   │   │   └── Root.jsx
│   │   ├── Pages/
│   │   │   ├── Home.jsx
│   │   │   └── AllServices.jsx
│   │   └── Router/
│   │       └── Router.jsx
│   └── package.json
└── ServiceHub Pro Server/
    ├── server.js
    ├── .env
    └── package.json
```

## 🔐 Authentication Flow

1. **Registration**: Users can create accounts with email/password or Google OAuth
2. **Login**: Secure login with error handling and user feedback
3. **Protected Routes**: Automatic redirection to login for unauthorized access
4. **Persistent Sessions**: Users remain logged in across browser sessions
5. **Dynamic Navigation**: Menu items change based on authentication status

## 🎨 Theme System

- **Dynamic Theme Toggle**: Switch between light and dark modes
- **Persistent Preferences**: Theme choice saved in localStorage
- **Smooth Transitions**: All elements transition smoothly between themes
- **System Integration**: Respects user's system theme preferences

## 🔍 Search & Discovery

- **Real-time Search**: Instant results as users type
- **Multi-field Search**: Search across service names, descriptions, and locations
- **Service Categories**: Browse by electronic device types
- **Provider Information**: View service provider details and ratings

## 🚀 Deployment Ready

- **Environment Configuration**: All sensitive data properly configured
- **Build Optimization**: Vite-optimized builds for production
- **Error Handling**: Comprehensive error boundaries and user feedback
- **SEO Friendly**: Dynamic page titles and meta information

## 📧 Contact

For questions or support, please contact:
- Email: support@servicehubpro.com
- Phone: +880 1234-567890

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
