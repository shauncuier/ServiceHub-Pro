# 🛠️ ServiceHub Pro

![ServiceHub Pro Banner](https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop&crop=center)

A modern, full-stack web application that connects customers with professional electronic repair service providers. Built with cutting-edge technologies and designed for seamless service booking and management.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://servicehub-pro-2eb79.web.app)
[![Server API](https://img.shields.io/badge/API-Documentation-green?style=for-the-badge)](https://service-hub-pro-server.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge)](https://github.com/shauncuier/ServiceHub-Pro)

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔐 Authentication System](#-authentication-system)
- [📊 Database Schema](#-database-schema)
- [🌐 API Documentation](#-api-documentation)
- [🎨 UI/UX Features](#-uiux-features)
- [🔧 Advanced Features](#-advanced-features)
- [📱 Responsive Design](#-responsive-design)
- [🚀 Deployment](#-deployment)
- [📈 Performance](#-performance)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Features

### ✅ Core Functionality

#### 🔐 **Complete Authentication System**
- **Firebase Authentication** with email/password and Google OAuth
- **JWT Token Management** with automatic refresh
- **Persistent Login Sessions** across browser sessions
- **Protected Routes** with automatic redirection
- **Role-based Access Control** for service providers and customers

#### 📋 **Service Management**
- **Service Discovery** - Browse all available electronic repair services
- **Advanced Search** - Real-time search by service name, description, or location
- **Service Categories** - Organized by device types (smartphones, laptops, TVs, ACs)
- **Service Provider Profiles** - Detailed provider information and ratings
- **CRUD Operations** - Add, edit, update, and delete services (providers only)

#### 📅 **Booking System**
- **One-Click Booking** - Simple and intuitive booking process
- **Real-time Status Tracking** - Monitor service progress (pending → working → completed)
- **Booking History** - Complete history for both customers and providers
- **Service Queue Management** - Providers can manage incoming bookings
- **Cancellation System** - Cancel pending bookings with proper authorization

#### ⭐ **Review & Rating System**
- **Service Reviews** - Customers can rate and review completed services
- **Rating Display** - Visual star ratings with aggregated scores
- **Review Statistics** - Platform-wide review metrics and analytics
- **Review Management** - Users can edit/delete their own reviews

### 🎨 **Modern UI/UX Design**
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark/Light Theme Toggle** - User preference with localStorage persistence
- **Smooth Animations** - Powered by modern CSS transitions
- **Professional Interface** - Built with Tailwind CSS and DaisyUI components
- **Loading States** - Beautiful spinners and skeleton screens
- **Error Handling** - Custom error pages and user-friendly messages

### 🌐 **Real-time Features**
- **Live Search** - Instant search results without page reload
- **Dynamic Content** - Auto-updating service lists and booking statuses
- **Real-time Notifications** - Status updates and booking confirmations
- **Live Statistics** - Platform metrics and analytics

## 🛠️ Tech Stack

### Frontend Technologies
```json
{
  "framework": "React 19",
  "routing": "React Router v7",
  "styling": "Tailwind CSS v4 + DaisyUI v5",
  "build_tool": "Vite v6",
  "icons": "Lucide React",
  "animations": "React CountUp, Swiper",
  "ui_components": "React Tooltip, SweetAlert2",
  "lottie": "React Lottie"
}
```

### Backend Technologies
```json
{
  "runtime": "Node.js",
  "framework": "Express.js v5",
  "database": "MongoDB Atlas",
  "authentication": "Firebase Auth + JWT",
  "security": "CORS, Environment Variables",
  "deployment": "Vercel"
}
```

### Authentication & Security
```json
{
  "authentication": "Firebase Authentication",
  "authorization": "JWT Tokens",
  "social_login": "Google OAuth",
  "security": "Token-based authentication",
  "data_protection": "Environment variables for sensitive data"
}
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** database (local or Atlas)
- **Firebase** project setup with Authentication enabled
- **Git** for version control

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/shauncuier/ServiceHub-Pro.git
cd ServiceHub-Pro
```

#### 2. Frontend Setup
```bash
cd "ServiceHub Pro Client"
npm install
```

Create `.env` file in the client directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3000/api
```

#### 3. Backend Setup
```bash
cd "../ServiceHub Pro Server"
npm install
```

Create `.env` file in the server directory:
```env
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

#### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd "ServiceHub Pro Server"
npm run dev

# Terminal 2 - Frontend
cd "ServiceHub Pro Client"
npm run dev
```

#### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000 (health check with endpoints)

## 📁 Project Structure

```
ServiceHub Pro/
├── 📁 ServiceHub Pro Client/          # React Frontend Application
│   ├── 📁 public/                     # Static assets
│   ├── 📁 src/
│   │   ├── 📁 Auth/                   # Authentication components
│   │   │   ├── AuthContext.jsx       # Authentication context provider
│   │   │   ├── Login.jsx              # Login page component
│   │   │   ├── Register.jsx           # Registration page component
│   │   │   ├── PrivateRoute.jsx       # Protected route wrapper
│   │   │   └── RedirectIfAuthenticated.jsx
│   │   ├── 📁 Components/             # Reusable UI components
│   │   │   ├── Navbar.jsx             # Navigation bar
│   │   │   ├── Footer.jsx             # Footer component
│   │   │   ├── SearchSystem.jsx       # Search functionality
│   │   │   ├── Slide.jsx              # Slider components
│   │   │   └── 📁 Home/               # Home page components
│   │   │       ├── HeroSlider.jsx     # Hero section slider
│   │   │       ├── FeaturedServices.jsx
│   │   │       ├── ServiceCategories.jsx
│   │   │       ├── StatsSection.jsx
│   │   │       ├── TestimonialsSection.jsx
│   │   │       ├── HowItWorksSection.jsx
│   │   │       ├── FeaturesSection.jsx
│   │   │       └── CallToAction.jsx
│   │   ├── 📁 Context/                # React Context providers
│   │   │   ├── ThemeContext.jsx       # Theme management
│   │   │   └── BookingContext.jsx     # Booking state management
│   │   ├── 📁 Pages/                  # Main page components
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── AllServices.jsx        # Services listing
│   │   │   ├── ServiceDetails.jsx     # Service detail view
│   │   │   ├── AddService.jsx         # Add new service
│   │   │   ├── ManageServices.jsx     # Service management
│   │   │   ├── BookedServices.jsx     # User bookings
│   │   │   ├── BookingsPage.jsx       # All bookings view
│   │   │   ├── ServiceTodo.jsx        # Provider task list
│   │   │   ├── ProfileSettings.jsx    # User profile
│   │   │   └── ErrorPage.jsx          # 404 error page
│   │   ├── 📁 Router/                 # Application routing
│   │   │   └── Router.jsx             # Route configuration
│   │   ├── 📁 utils/                  # Utility functions
│   │   │   ├── api.js                 # API communication layer
│   │   │   └── jwt.js                 # JWT token utilities
│   │   ├── 📁 hooks/                  # Custom React hooks
│   │   │   └── usePageTitle.js        # Dynamic page titles
│   │   └── 📁 Layout/                 # Layout components
│   │       └── Root.jsx               # Main layout wrapper
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   ├── eslint.config.js               # ESLint configuration
│   └── Task_Summery.md                # Project requirements
├── 📁 ServiceHub Pro Server/          # Express.js Backend API
│   ├── index.js                       # Main server file
│   ├── package.json                   # Backend dependencies
│   ├── vercel.json                    # Vercel deployment config
│   ├── DEPLOYMENT_GUIDE.md            # Deployment instructions
│   └── README.md                      # Server documentation
├── README.md                          # This file
└── .gitignore                         # Git ignore rules
```

## 🔐 Authentication System

### Firebase Integration
- **Email/Password Authentication** with secure validation
- **Google OAuth** for social login
- **Persistent Sessions** that survive browser restarts
- **Token Refresh** automatic handling

### JWT Implementation
- **Secure Token Generation** with configurable expiration
- **Token Verification** for protected routes
- **Automatic Logout** on token expiration
- **Role-based Authorization** for different user types

### Security Features
- **Protected API Endpoints** with token verification
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive configuration
- **Input Validation** and sanitization

## 📊 Database Schema

### Services Collection
```javascript
{
  _id: ObjectId,                    // Unique service identifier
  serviceName: String,              // Name of the service
  serviceDescription: String,       // Detailed description
  price: Number,                    // Service price
  serviceArea: String,              // Service location/area
  imageURL: String,                 // Service image URL
  providerName: String,             // Service provider name
  providerEmail: String,            // Provider email (indexed)
  providerImage: String,            // Provider profile image
  createdAt: Date,                  // Creation timestamp
  createdBy: String,                // User ID who created
  updatedAt: Date,                  // Last update timestamp
  updatedBy: String                 // User ID who updated
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,                    // Unique booking identifier
  serviceId: ObjectId,              // Reference to service
  serviceName: String,              // Service name (denormalized)
  serviceImage: String,             // Service image (denormalized)
  providerEmail: String,            // Provider email (indexed)
  providerName: String,             // Provider name
  userEmail: String,                // Customer email (indexed)
  userName: String,                 // Customer name
  serviceDate: Date,                // Scheduled service date
  specialInstructions: String,      // Additional instructions
  price: Number,                    // Booking price
  status: String,                   // 'pending' | 'working' | 'completed'
  serviceStatus: String,            // Alternative status field
  bookedAt: Date,                   // Booking creation time
  bookedBy: String,                 // User ID who booked
  updatedAt: Date,                  // Last status update
  updatedBy: String                 // User ID who updated
}
```

### Reviews Collection
```javascript
{
  _id: ObjectId,                    // Unique review identifier
  serviceId: String,                // Service being reviewed
  providerEmail: String,            // Service provider email
  customerEmail: String,            // Customer email (indexed)
  customerName: String,             // Customer display name
  rating: Number,                   // 1-5 star rating
  comment: String,                  // Review comment
  serviceName: String,              // Service name (denormalized)
  createdAt: Date,                  // Review creation time
  createdBy: String,                // User ID who created
  updatedAt: Date,                  // Last update time
  updatedBy: String                 // User ID who updated
}
```

### Users Collection
```javascript
{
  _id: ObjectId,                    // Unique user identifier
  uid: String,                      // Firebase UID (indexed)
  email: String,                    // User email (indexed, unique)
  displayName: String,              // User display name
  photoURL: String,                 // Profile image URL
  emailVerified: Boolean,           // Email verification status
  loginTime: String,                // Last login timestamp
  tokenType: String,                // Token type identifier
  lastLoginAt: Date,                // Last login date
  lastLogoutAt: Date,               // Last logout date
  createdAt: Date                   // Account creation date
}
```

### Database Indexes
```javascript
// Services Collection
{ providerEmail: 1 }              // Provider services lookup
{ serviceArea: 1 }                // Location-based search
{ serviceName: 'text', serviceDescription: 'text' } // Full-text search

// Bookings Collection
{ userEmail: 1 }                  // User bookings lookup
{ providerEmail: 1 }              // Provider bookings lookup
{ status: 1 }                     // Status filtering
{ serviceId: 1 }                  // Service bookings lookup

// Reviews Collection
{ serviceId: 1 }                  // Service reviews lookup
{ customerEmail: 1 }              // User reviews lookup
{ providerEmail: 1 }              // Provider reviews lookup
{ rating: 1 }                     // Rating-based queries
{ createdAt: -1 }                 // Recent reviews

// Users Collection
{ email: 1 } (unique)             // Email-based user lookup
{ uid: 1 } (unique)               // Firebase UID lookup
```

## 🌐 API Documentation

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://service-hub-pro-server.vercel.app/api`

### Authentication Endpoints

#### POST `/auth/firebase-login`
Exchange Firebase ID token for JWT token
```javascript
// Request Body
{
  "idToken": "firebase_id_token",
  "uid": "user_id",
  "email": "user@example.com",
  "displayName": "User Name",
  "photoURL": "profile_image_url",
  "emailVerified": true
}

// Response
{
  "message": "Authentication successful",
  "token": "jwt_token",
  "user": { /* user data */ }
}
```

#### GET `/auth/verify` 🔒
Verify current JWT token
```javascript
// Headers: Authorization: Bearer <jwt_token>
// Response
{
  "message": "Token is valid",
  "user": { /* user data */ }
}
```

#### POST `/auth/logout` 🔒
Logout current user
```javascript
// Headers: Authorization: Bearer <jwt_token>
// Response
{
  "message": "Logged out successfully"
}
```

### Services Endpoints

#### GET `/services`
Get all services (public)
```javascript
// Response
[
  {
    "_id": "service_id",
    "serviceName": "iPhone Screen Repair",
    "serviceDescription": "Professional iPhone screen replacement",
    "price": 150,
    "serviceArea": "New York, NY",
    "imageURL": "image_url",
    "providerName": "TechFix Pro",
    "providerEmail": "provider@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET `/services/:id`
Get single service by ID (public)

#### GET `/services/provider/:email` 🔒
Get services by provider email (protected)

#### POST `/services` 🔒
Create new service (protected)
```javascript
// Headers: Authorization: Bearer <jwt_token>
// Request Body
{
  "serviceName": "Laptop Repair",
  "serviceDescription": "Complete laptop diagnostic and repair",
  "price": 200,
  "serviceArea": "Boston, MA",
  "imageURL": "laptop_repair.jpg"
}
```

#### PUT `/services/:id` 🔒
Update service (protected)

#### DELETE `/services/:id` 🔒
Delete service (protected)

### Bookings Endpoints

#### GET `/bookings` 🔒
Get all bookings (protected)

#### GET `/bookings/user/:email` 🔒
Get user bookings (protected)

#### GET `/bookings/provider/:email` 🔒
Get provider bookings (protected)

#### POST `/bookings` 🔒
Create new booking (protected)
```javascript
// Headers: Authorization: Bearer <jwt_token>
// Request Body
{
  "serviceId": "service_id",
  "serviceName": "iPhone Repair",
  "serviceImage": "image_url",
  "providerEmail": "provider@example.com",
  "providerName": "TechFix Pro",
  "serviceDate": "2024-02-01T10:00:00Z",
  "specialInstructions": "Cracked screen, water damage",
  "price": 150
}
```

#### PUT `/bookings/:id/status` 🔒
Update booking status (protected)
```javascript
// Headers: Authorization: Bearer <jwt_token>
// Request Body
{
  "status": "working" // "pending" | "working" | "completed"
}
```

#### DELETE `/bookings/:id` 🔒
Cancel booking (protected)

### Reviews Endpoints

#### GET `/reviews/recent?limit=4`
Get recent reviews (public)

#### GET `/reviews/stats`
Get review statistics (public)

#### POST `/reviews` 🔒
Create new review (protected)

#### GET `/reviews/service/:serviceId`
Get reviews for specific service (public)

#### GET `/reviews/user/:email` 🔒
Get reviews by user (protected)

### Search Endpoints

#### GET `/search/:query`
Search services (public)
```javascript
// Example: GET /search/iphone%20repair
// Response: Array of matching services
```

### Statistics Endpoints

#### GET `/bookings/stats`
Get booking statistics (public)
```javascript
// Response
{
  "totalBookings": 1250,
  "pendingBookings": 45,
  "workingBookings": 23,
  "completedBookings": 1182,
  "totalRevenue": 187500,
  "averageRating": 4.8
}
```

## 🎨 UI/UX Features

### Design System
- **Consistent Color Palette** with semantic color usage
- **Typography Scale** with readable font sizes and weights
- **Spacing System** using Tailwind's spacing scale
- **Component Library** built with DaisyUI components

### Theme Management
- **Dark/Light Mode Toggle** with smooth transitions
- **System Theme Detection** respects user's OS preference
- **Persistent Theme Storage** using localStorage
- **Theme-aware Components** automatically adapt colors

### Interactive Elements
- **Hover Effects** on all interactive components
- **Focus States** for keyboard navigation accessibility
- **Loading Animations** during data fetching
- **Micro-interactions** for better user feedback

### Mobile-First Design
- **Responsive Breakpoints** optimized for all screen sizes
- **Touch-Friendly Interface** with appropriate touch targets
- **Mobile Navigation** with collapsible menu
- **Swipe Gestures** for carousels and galleries

## 🔧 Advanced Features

### Search & Filtering
```javascript
// Real-time search implementation
const handleSearch = debounce(async (query) => {
  if (query.trim()) {
    const results = await api.services.search(query);
    setSearchResults(results);
  }
}, 300);
```

### State Management
- **React Context** for global state management
- **Local State** for component-specific data
- **Persistent Storage** for user preferences
- **Optimistic Updates** for better UX

### Error Handling
- **Global Error Boundary** catches and displays errors gracefully
- **API Error Handling** with user-friendly messages
- **Form Validation** with real-time feedback
- **Fallback UI** for failed data loads

### Performance Optimizations
- **Code Splitting** with React lazy loading
- **Image Optimization** with proper sizing and formats
- **Caching Strategy** for API responses
- **Bundle Analysis** for size optimization

## 📱 Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
.container {
  @apply px-4;                    /* Mobile: 0px+ */
  @apply sm:px-6;                 /* Small: 640px+ */
  @apply md:px-8;                 /* Medium: 768px+ */
  @apply lg:px-12;                /* Large: 1024px+ */
  @apply xl:px-16;                /* X-Large: 1280px+ */
  @apply 2xl:px-20;               /* 2X-Large: 1536px+ */
}
```

### Component Adaptations
- **Navigation** collapses to hamburger menu on mobile
- **Service Cards** stack vertically on small screens
- **Form Layouts** optimize for touch input
- **Data Tables** become scrollable on mobile

## 🚀 Deployment

### Frontend Deployment (Firebase Hosting)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in client directory
cd "ServiceHub Pro Client"
firebase init hosting

# Deploy to Firebase
npm run build
firebase deploy
```

### Backend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from server directory
cd "ServiceHub Pro Server"
vercel --prod
```

### Environment Configuration

#### Production Environment Variables

**Frontend (Firebase)**
```env
VITE_FIREBASE_API_KEY=production_api_key
VITE_FIREBASE_AUTH_DOMAIN=servicehub-pro-2eb79.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=servicehub-pro-2eb79
VITE_FIREBASE_STORAGE_BUCKET=servicehub-pro-2eb79.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=production_sender_id
VITE_FIREBASE_APP_ID=production_app_id
VITE_API_URL=https://service-hub-pro-server.vercel.app/api
```

**Backend (Vercel)**
```env
DB_USERNAME=production_db_username
DB_PASSWORD=production_db_password
JWT_SECRET=production_jwt_secret_key_2024
NODE_ENV=production
```

### Deployment Checklist
- [ ] Environment variables configured in hosting platforms
- [ ] Firebase Authentication domain whitelist updated
- [ ] MongoDB Atlas IP whitelist includes hosting platform IPs
- [ ] API CORS configuration includes production domains
- [ ] SSL certificates enabled for custom domains
- [ ] Performance monitoring enabled
- [ ] Error tracking configured

## 📈 Performance

### Metrics & Optimization
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

### Optimization Techniques
- **Image Optimization** with WebP format and lazy loading
- **Code Splitting** reduces initial bundle size
- **Tree Shaking** eliminates unused code
- **Compression** with Gzip/Brotli on server
- **CDN Usage** for static assets

### Monitoring & Analytics
- **Firebase Analytics** for user behavior tracking
- **Performance Monitoring** with Core Web Vitals
- **Error Tracking** with detailed error reporting
- **API Monitoring** with response time tracking

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Standards
- **ESLint** configuration enforces code style
- **Prettier** for consistent formatting
- **Conventional Commits** for clear commit messages
- **TypeScript** types where applicable

### Testing Guidelines
- **Unit Tests** for utility functions
- **Integration Tests** for API endpoints
- **E2E Tests** for critical user flows
- **Manual Testing** on multiple devices and browsers

## 📞 Support & Contact

### Technical Support
- **Email**: support@servicehubpro.com
- **Phone**: +880 1835-927634
- **Documentation**: [GitHub Wiki](https://github.com/shauncuier/ServiceHub-Pro/wiki)

### Community
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Share ideas and get help
- **Discord**: Join our developer community

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase** for authentication and hosting services
- **MongoDB** for reliable database solutions
- **Vercel** for seamless backend deployment
- **Tailwind CSS** and **DaisyUI** for beautiful UI components
- **React Team** for the amazing framework
- **Open Source Community** for all the amazing libraries

---

<div align="center">

**Made with ❤️ by [ServiceHub Pro Team](https://github.com/shauncuier)**

[![GitHub Stars](https://img.shields.io/github/stars/shauncuier/ServiceHub-Pro?style=social)](https://github.com/shauncuier/ServiceHub-Pro/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/shauncuier/ServiceHub-Pro?style=social)](https://github.com/shauncuier/ServiceHub-Pro/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/shauncuier/ServiceHub-Pro)](https://github.com/shauncuier/ServiceHub-Pro/issues)

</div>
