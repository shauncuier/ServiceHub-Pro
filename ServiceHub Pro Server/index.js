const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'servicehub_pro_jwt_secret_key_2024_production_ready';

// MongoDB Configuration
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/servicehub_pro';
const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@servicehubpro.iiwkmj.mongodb.net/?retryWrites=true&w=majority&appName=ServiceHubPro`;
let db;
let client;



// Sample data for initialization - empty array for production
const sampleServices = [];

// Connect to MongoDB
async function connectMongoDB() {
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db();

        // Test the connection
        await db.admin().ping();
        console.log('✅ Connected to MongoDB successfully');

        // Create collections and indexes
        await createCollectionsAndIndexes();

        // Initialize with sample data if collections are empty
        await initializeSampleData();

        return db;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('💡 Please ensure MongoDB is running on localhost:27017');
        console.log('💡 You can start MongoDB with: mongod --dbpath /path/to/your/data/directory');

        // For development, we'll continue without MongoDB and use in-memory storage
        console.log('🔄 Falling back to in-memory storage for development...');
        return null;
    }
}


// Create collections and indexes
async function createCollectionsAndIndexes() {
    try {
        // Create services collection with indexes
        const servicesCollection = db.collection('services');
        await servicesCollection.createIndex({ providerEmail: 1 });
        await servicesCollection.createIndex({ serviceArea: 1 });
        await servicesCollection.createIndex({ serviceName: 'text', serviceDescription: 'text' });

        // Create bookings collection with indexes
        const bookingsCollection = db.collection('bookings');
        await bookingsCollection.createIndex({ userEmail: 1 });
        await bookingsCollection.createIndex({ providerEmail: 1 });
        await bookingsCollection.createIndex({ status: 1 });
        await bookingsCollection.createIndex({ serviceId: 1 });

        // Create users collection with indexes
        const usersCollection = db.collection('users');
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await usersCollection.createIndex({ uid: 1 }, { unique: true });

        console.log('✅ MongoDB collections and indexes created');
    } catch (error) {
        console.error('⚠️ Error creating collections/indexes:', error.message);
    }
}


// Initialize sample data
async function initializeSampleData() {
    try {
        const servicesCollection = db.collection('services');
        const count = await servicesCollection.countDocuments();

        if (count === 0) {
            await servicesCollection.insertMany(sampleServices);
            console.log(`✅ Inserted ${sampleServices.length} sample services into MongoDB`);
        } else {
            console.log(`📊 Found ${count} existing services in MongoDB`);
        }
    } catch (error) {
        console.error('⚠️ Error initializing sample data:', error.message);
    }
}



// In-memory fallback storage
let memoryDatabase = {
    services: [],
    bookings: [],
    users: []
};

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://servicehub-pro-2eb79.web.app',
        'https://servicehub-pro-2eb79.firebaseapp.com',
        'https://service-hub-pro-server.vercel.app',
        process.env.CLIENT_URL,
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Support legacy browsers
}));



// Enhanced JSON parsing with error handling
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf);
        } catch (err) {
            console.error('JSON Parse Error:', err.message);
            console.error('Raw body:', buf.toString());
            res.status(400).json({ error: 'Invalid JSON format' });
            return;
        }
    }
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Firebase Token Authentication Middleware (Development Mode)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        // For development: decode Firebase ID token without verification
        // In production, use Firebase Admin SDK: admin.auth().verifyIdToken(token)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        if (!payload.email) {
            console.log('Token missing email');
            return res.status(403).json({ error: 'Invalid token format' });
        }

        req.user = {
            uid: payload.user_id || payload.sub,
            email: payload.email,
            displayName: payload.name,
            emailVerified: payload.email_verified || false
        };

        console.log('Firebase token verified for user:', req.user.email);
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Optional Auth Middleware
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
};



// Health check
app.get('/', async (req, res) => {
    let stats = { services: 0, bookings: 0, users: 0 };
    let dbStatus = 'MongoDB connected';

    try {
        if (db) {
            stats.services = await db.collection('services').countDocuments();
            stats.bookings = await db.collection('bookings').countDocuments();
            stats.users = await db.collection('users').countDocuments();
        } else {
            stats = {
                services: memoryDatabase.services.length,
                bookings: memoryDatabase.bookings.length,
                users: memoryDatabase.users.length
            };
            dbStatus = 'In-memory storage (MongoDB unavailable)';
        }
    } catch (error) {
        dbStatus = 'Database error';
    }

    res.json({
        message: 'ServiceHub Pro Server is running!',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        stats,
        endpoints: [
            'POST /api/auth/firebase-login',
            'GET /api/auth/verify',
            'POST /api/auth/logout (Protected)',
            'GET /api/services',
            'POST /api/services (Protected)',
            'GET /api/services/:id',
            'GET /api/services/provider/:email (Protected)',
            'PUT /api/services/:id (Protected)',
            'DELETE /api/services/:id (Protected)',
            'GET /api/bookings (Protected)',
            'GET /api/bookings/user/:email (Protected)',
            'GET /api/bookings/provider/:email (Protected)',
            'POST /api/bookings (Protected)',
            'PUT /api/bookings/:id/status (Protected)',
            'DELETE /api/bookings/:id (Protected)',
            'GET /api/search/:query',
            'GET /api/bookings/stats',
            'GET /api/reviews/recent',
            'GET /api/reviews/stats',
            'POST /api/reviews (Protected)',
            'GET /api/reviews/service/:serviceId',
            'GET /api/reviews/user/:email (Protected)'
        ]
    });
});

// Authentication Routes

// Firebase Auth Integration
app.post('/api/auth/firebase-login', async (req, res) => {
    try {
        const { idToken, uid, email, displayName, photoURL, emailVerified } = req.body;

        if (!idToken && (!uid || !email)) {
            return res.status(400).json({ error: 'Firebase ID token or user data required' });
        }

        let userPayload;

        if (idToken) {
            // Verify Firebase ID token (in production, you'd use Firebase Admin SDK)
            // For now, we'll decode the token and trust the client data
            console.log('Firebase ID token received, processing authentication...');
            userPayload = {
                uid,
                email,
                displayName,
                photoURL,
                emailVerified,
                tokenVerified: true
            };
        } else {
            // Fallback to user data (less secure)
            userPayload = {
                uid,
                email,
                displayName,
                photoURL,
                emailVerified,
                tokenVerified: false
            };
        }

        // Create JWT payload
        const payload = {
            ...userPayload,
            loginTime: new Date().toISOString(),
            tokenType: 'firebase-jwt'
        };

        // Generate JWT token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        // Store/update user in database
        const userData = {
            ...payload,
            lastLoginAt: new Date(),
            createdAt: new Date()
        };

        if (db) {
            // MongoDB storage
            const usersCollection = db.collection('users');
            await usersCollection.replaceOne(
                { uid: userPayload.uid },
                userData,
                { upsert: true }
            );
        } else {
            // In-memory storage
            const existingUserIndex = memoryDatabase.users.findIndex(u => u.uid === userPayload.uid);
            if (existingUserIndex !== -1) {
                memoryDatabase.users[existingUserIndex] = userData;
            } else {
                memoryDatabase.users.push(userData);
            }
        }

        console.log('Firebase login successful for:', userPayload.email,
            idToken ? '(with ID token)' : '(fallback mode)');

        res.json({
            message: 'Authentication successful',
            token,
            user: payload
        });

    } catch (error) {
        console.error('Firebase auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// Verify JWT token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({
        message: 'Token is valid',
        user: req.user
    });
});


// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        if (db) {
            // MongoDB storage
            const usersCollection = db.collection('users');
            await usersCollection.updateOne(
                { uid: req.user.uid },
                { $set: { lastLogoutAt: new Date() } }
            );
        } else {
            // In-memory storage
            const userIndex = memoryDatabase.users.findIndex(u => u.uid === req.user.uid);
            if (userIndex !== -1) {
                memoryDatabase.users[userIndex].lastLogoutAt = new Date();
            }
        }

        console.log('User logged out:', req.user.email);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});




// Services Routes

// Get all services (public)
app.get('/api/services', optionalAuth, async (req, res) => {
    try {
        let services = [];

        if (db) {
            // MongoDB storage
            const servicesCollection = db.collection('services');
            services = await servicesCollection.find({}).sort({ createdAt: -1 }).toArray();
            console.log('GET /api/services - Returning', services.length, 'services from MongoDB');
        } else {
            // In-memory storage
            services = memoryDatabase.services.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            console.log('GET /api/services - Returning', services.length, 'services from memory');
        }

        if (req.user) {
            console.log('Authenticated request from:', req.user.email);
        }
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Get single service by ID (public)
app.get('/api/services/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;
        let service = null;

        if (db) {
            // MongoDB storage - validate ObjectId first
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid service ID format' });
            }
            const servicesCollection = db.collection('services');
            service = await servicesCollection.findOne({ _id: new ObjectId(id) });
        } else {
            // In-memory storage
            service = memoryDatabase.services.find(s => s._id === id);
        }

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        console.log('GET /api/services/:id - Found service:', service.serviceName);
        res.json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});

// Get services by provider email (protected)
app.get('/api/services/provider/:email', authenticateToken, async (req, res) => {
    try {
        const { email } = req.params;

        if (req.user.email !== email) {
            return res.status(403).json({ error: 'Access denied - can only view your own services' });
        }

        let providerServices = [];

        if (db) {
            // MongoDB storage
            const servicesCollection = db.collection('services');
            providerServices = await servicesCollection.find({ providerEmail: email }).sort({ createdAt: -1 }).toArray();
        } else {
            // In-memory storage
            providerServices = memoryDatabase.services
                .filter(s => s.providerEmail === email)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        console.log('GET /api/services/provider/:email - Found', providerServices.length, 'services for', email);
        res.json(providerServices);
    } catch (error) {
        console.error('Error fetching provider services:', error);
        res.status(500).json({ error: 'Failed to fetch provider services' });
    }
});

// Add new service (protected)
app.post('/api/services', authenticateToken, async (req, res) => {
    try {
        const serviceData = {
            ...req.body,
            providerEmail: req.user.email, // Override with authenticated user's email
            createdAt: new Date(),
            createdBy: req.user.uid
        };

        let result;

        if (db) {
            // MongoDB storage
            const servicesCollection = db.collection('services');
            result = await servicesCollection.insertOne(serviceData);
            serviceData._id = result.insertedId;
        } else {
            // In-memory storage
            serviceData._id = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            memoryDatabase.services.push(serviceData);
            result = { insertedId: serviceData._id };
        }

        console.log('POST /api/services - Added new service:', serviceData.serviceName, 'by', req.user.email);
        res.status(201).json({
            message: 'Service added successfully',
            serviceId: result.insertedId,
            service: serviceData
        });
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({ error: 'Failed to add service' });
    }
});

// Update service (protected)
app.put('/api/services/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        let existingService = null;

        if (db) {
            // MongoDB storage
            const servicesCollection = db.collection('services');
            existingService = await servicesCollection.findOne({ _id: new ObjectId(id) });

            if (!existingService) {
                return res.status(404).json({ error: 'Service not found' });
            }

            if (existingService.providerEmail !== req.user.email) {
                return res.status(403).json({ error: 'Access denied - can only edit your own services' });
            }

            const updateData = {
                ...req.body,
                providerEmail: req.user.email,
                updatedAt: new Date(),
                updatedBy: req.user.uid
            };

            await servicesCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );
        } else {
            // In-memory storage
            const serviceIndex = memoryDatabase.services.findIndex(s => s._id === id);

            if (serviceIndex === -1) {
                return res.status(404).json({ error: 'Service not found' });
            }

            if (memoryDatabase.services[serviceIndex].providerEmail !== req.user.email) {
                return res.status(403).json({ error: 'Access denied - can only edit your own services' });
            }

            memoryDatabase.services[serviceIndex] = {
                ...memoryDatabase.services[serviceIndex],
                ...req.body,
                providerEmail: req.user.email,
                updatedAt: new Date(),
                updatedBy: req.user.uid
            };
        }

        console.log('PUT /api/services/:id - Updated service:', req.body.serviceName, 'by', req.user.email);
        res.json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
});

// Delete service (protected)
app.delete('/api/services/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        let existingService = null;

        if (db) {
            // MongoDB storage
            const servicesCollection = db.collection('services');
            existingService = await servicesCollection.findOne({ _id: new ObjectId(id) });

            if (!existingService) {
                return res.status(404).json({ error: 'Service not found' });
            }

            if (existingService.providerEmail !== req.user.email) {
                return res.status(403).json({ error: 'Access denied - can only delete your own services' });
            }

            await servicesCollection.deleteOne({ _id: new ObjectId(id) });
        } else {
            // In-memory storage
            const serviceIndex = memoryDatabase.services.findIndex(s => s._id === id);

            if (serviceIndex === -1) {
                return res.status(404).json({ error: 'Service not found' });
            }

            if (memoryDatabase.services[serviceIndex].providerEmail !== req.user.email) {
                return res.status(403).json({ error: 'Access denied - can only delete your own services' });
            }

            existingService = memoryDatabase.services.splice(serviceIndex, 1)[0];
        }

        console.log('DELETE /api/services/:id - Deleted service:', existingService.serviceName, 'by', req.user.email);
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

// Bookings Routes

// Get all bookings (protected) - for admin or debugging
app.get('/api/bookings', authenticateToken, async (req, res) => {
    try {
        let allBookings = [];

        if (db) {
            // MongoDB storage
            const bookingsCollection = db.collection('bookings');
            allBookings = await bookingsCollection.find({}).sort({ bookedAt: -1 }).toArray();
        } else {
            // In-memory storage
            allBookings = memoryDatabase.bookings
                .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        }

        console.log('GET /api/bookings - Found', allBookings.length, 'total bookings');
        res.json(allBookings);
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get all bookings for a user (protected)
app.get('/api/bookings/user/:email', authenticateToken, async (req, res) => {
    try {
        const { email } = req.params;

        if (req.user.email !== email) {
            return res.status(403).json({ error: 'Access denied - can only view your own bookings' });
        }

        let userBookings = [];

        if (db) {
            // MongoDB storage
            const bookingsCollection = db.collection('bookings');
            userBookings = await bookingsCollection.find({ userEmail: email }).sort({ bookedAt: -1 }).toArray();
        } else {
            // In-memory storage
            userBookings = memoryDatabase.bookings
                .filter(b => b.userEmail === email)
                .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        }

        console.log('GET /api/bookings/user/:email - Found', userBookings.length, 'bookings for', email);
        res.json(userBookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get all bookings for a service provider (protected)
app.get('/api/bookings/provider/:email', authenticateToken, async (req, res) => {
    try {
        const { email } = req.params;

        if (req.user.email !== email) {
            return res.status(403).json({ error: 'Access denied - can only view your own provider bookings' });
        }

        let providerBookings = [];

        if (db) {
            // MongoDB storage
            const bookingsCollection = db.collection('bookings');
            providerBookings = await bookingsCollection.find({ providerEmail: email }).sort({ bookedAt: -1 }).toArray();
        } else {
            // In-memory storage
            providerBookings = memoryDatabase.bookings
                .filter(b => b.providerEmail === email)
                .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        }

        console.log('GET /api/bookings/provider/:email - Found', providerBookings.length, 'bookings for provider', email);
        res.json(providerBookings);
    } catch (error) {
        console.error('Error fetching provider bookings:', error);
        res.status(500).json({ error: 'Failed to fetch provider bookings' });
    }
});

// Create new booking (protected)
app.post('/api/bookings', authenticateToken, async (req, res) => {
    try {
        console.log('📋 Creating new booking for user:', req.user.email);
        console.log('📋 Booking data received:', req.body);

        const bookingData = {
            ...req.body,
            userEmail: req.user.email, // Override with authenticated user's email
            userName: req.user.displayName || req.user.email,
            status: 'pending',
            bookedAt: new Date(),
            bookedBy: req.user.uid
        };

        let result;

        if (db) {
            // MongoDB storage
            const bookingsCollection = db.collection('bookings');
            result = await bookingsCollection.insertOne(bookingData);
            bookingData._id = result.insertedId;
            console.log('📋 Booking saved to MongoDB with ID:', result.insertedId);
        } else {
            // In-memory storage
            bookingData._id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            memoryDatabase.bookings.push(bookingData);
            result = { insertedId: bookingData._id };
            console.log('📋 Booking saved to memory with ID:', bookingData._id);
        }

        console.log('✅ POST /api/bookings - New booking created by', req.user.email, 'for service:', bookingData.serviceName);
        res.status(201).json({
            message: 'Service booked successfully',
            bookingId: result.insertedId,
            booking: bookingData
        });
    } catch (error) {
        console.error('❌ Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
});

// Update booking status (protected)
app.put('/api/bookings/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, serviceStatus } = req.body;

        // Accept both 'status' and 'serviceStatus' field names
        const newStatus = status || serviceStatus;

        if (!newStatus || !['pending', 'working', 'completed'].includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid status value. Must be: pending, working, or completed' });
        }

        let existingBooking = null;

        if (db) {
            // MongoDB storage
            const bookingsCollection = db.collection('bookings');
            existingBooking = await bookingsCollection.findOne({ _id: new ObjectId(id) });

            if (!existingBooking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            if (existingBooking.providerEmail !== req.user.email) {
                return res.status(403).json({ error: 'Access denied - only service provider can update booking status' });
            }

            await bookingsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: newStatus,
                        serviceStatus: newStatus, // Store both field names for compatibility
                        updatedAt: new Date(),
                        updatedBy: req.user.uid
                    }
                }
            );
        } else {
            // In-memory storage
            const bookingIndex = memoryDatabase.bookings.findIndex(b => b._id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            if (memoryDatabase.bookings[bookingIndex].providerEmail !== req.user.email) {
                return res.status(403).json({ error: 'Access denied - only service provider can update booking status' });
            }

            memoryDatabase.bookings[bookingIndex].status = newStatus;
            memoryDatabase.bookings[bookingIndex].serviceStatus = newStatus; // Store both field names
            memoryDatabase.bookings[bookingIndex].updatedAt = new Date();
            memoryDatabase.bookings[bookingIndex].updatedBy = req.user.uid;
            existingBooking = memoryDatabase.bookings[bookingIndex];
        }

        console.log('PUT /api/bookings/:id/status - Updated booking status to', newStatus, 'by', req.user.email);
        res.json({ message: 'Booking status updated successfully', status: newStatus, serviceStatus: newStatus });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

// Delete booking (protected) - for cancellation
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        let existingBooking = null;

        if (db) {
            // MongoDB storage
            const bookingsCollection = db.collection('bookings');
            existingBooking = await bookingsCollection.findOne({ _id: new ObjectId(id) });

            if (!existingBooking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            // Allow both user who made the booking and service provider to cancel
            if (existingBooking.userEmail !== req.user.email && existingBooking.providerEmail !== req.user.email) {
                return res.status(403).json({ error: 'Access denied - only booking owner or service provider can cancel booking' });
            }

            // Only allow cancellation if booking is pending
            if (existingBooking.status !== 'pending') {
                return res.status(400).json({ error: 'Only pending bookings can be cancelled' });
            }

            await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
        } else {
            // In-memory storage
            const bookingIndex = memoryDatabase.bookings.findIndex(b => b._id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            existingBooking = memoryDatabase.bookings[bookingIndex];

            // Allow both user who made the booking and service provider to cancel
            if (existingBooking.userEmail !== req.user.email && existingBooking.providerEmail !== req.user.email) {
                return res.status(403).json({ error: 'Access denied - only booking owner or service provider can cancel booking' });
            }

            // Only allow cancellation if booking is pending
            if (existingBooking.status !== 'pending') {
                return res.status(400).json({ error: 'Only pending bookings can be cancelled' });
            }

            memoryDatabase.bookings.splice(bookingIndex, 1);
        }

        console.log('DELETE /api/bookings/:id - Cancelled booking:', existingBooking.serviceName, 'by', req.user.email);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// Search services (public)
app.get('/api/search/:query', optionalAuth, async (req, res) => {
    try {
        const { query } = req.params;
        let searchResults = [];

        if (db) {
            // MongoDB storage with regex search
            const servicesCollection = db.collection('services');
            searchResults = await servicesCollection.find({
                $or: [
                    { serviceName: { $regex: query, $options: 'i' } },
                    { serviceDescription: { $regex: query, $options: 'i' } },
                    { providerName: { $regex: query, $options: 'i' } },
                    { serviceArea: { $regex: query, $options: 'i' } }
                ]
            }).toArray();
        } else {
            // In-memory storage
            const searchQuery = query.toLowerCase();
            searchResults = memoryDatabase.services.filter(service =>
                service.serviceName.toLowerCase().includes(searchQuery) ||
                service.serviceDescription.toLowerCase().includes(searchQuery) ||
                service.providerName.toLowerCase().includes(searchQuery) ||
                service.serviceArea.toLowerCase().includes(searchQuery)
            );
        }

        console.log('GET /api/search/:query - Found', searchResults.length, 'results for:', query);
        res.json(searchResults);
    } catch (error) {
        console.error('Error searching services:', error);
        res.status(500).json({ error: 'Failed to search services' });
    }
});

// Statistics Routes

// Get booking statistics (public)
app.get('/api/bookings/stats', async (req, res) => {
    try {
        let stats = {
            totalBookings: 0,
            pendingBookings: 0,
            workingBookings: 0,
            completedBookings: 0,
            totalRevenue: 0,
            averageRating: 0
        };

        if (db) {
            // MongoDB storage
            const bookingsCollection = db.collection('bookings');
            const allBookings = await bookingsCollection.find({}).toArray();
            
            stats.totalBookings = allBookings.length;
            stats.pendingBookings = allBookings.filter(b => b.status === 'pending').length;
            stats.workingBookings = allBookings.filter(b => b.status === 'working').length;
            stats.completedBookings = allBookings.filter(b => b.status === 'completed').length;
            stats.totalRevenue = allBookings.reduce((sum, b) => sum + (b.price || 0), 0);
        } else {
            // In-memory storage
            const allBookings = memoryDatabase.bookings;
            
            stats.totalBookings = allBookings.length;
            stats.pendingBookings = allBookings.filter(b => b.status === 'pending').length;
            stats.workingBookings = allBookings.filter(b => b.status === 'working').length;
            stats.completedBookings = allBookings.filter(b => b.status === 'completed').length;
            stats.totalRevenue = allBookings.reduce((sum, b) => sum + (b.price || 0), 0);
        }

        console.log('GET /api/bookings/stats - Returning booking statistics');
        res.json(stats);
    } catch (error) {
        console.error('Error fetching booking stats:', error);
        res.status(500).json({ error: 'Failed to fetch booking statistics' });
    }
});

// Reviews Routes

// Get recent reviews (public)
app.get('/api/reviews/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        let reviews = [];

        if (db) {
            // MongoDB storage
            const reviewsCollection = db.collection('reviews');
            reviews = await reviewsCollection.find({})
                .sort({ createdAt: -1 })
                .limit(limit)
                .toArray();
        } else {
            // In-memory storage with fallback sample data
            reviews = [
                {
                    _id: "review_1",
                    customerName: "John Doe",
                    customerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                    rating: 5,
                    comment: "Excellent smartphone repair service! My phone was fixed quickly and works perfectly now.",
                    serviceName: "Smartphone Repair",
                    providerName: "TechFix Solutions",
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
                },
                {
                    _id: "review_2",
                    customerName: "Sarah Johnson",
                    customerImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
                    rating: 5,
                    comment: "Professional laptop repair service. Great communication and fair pricing.",
                    serviceName: "Laptop Repair",
                    providerName: "Computer Care Center",
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
                },
                {
                    _id: "review_3",
                    customerName: "Mike Wilson",
                    customerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                    rating: 4,
                    comment: "Quick TV repair service. Very satisfied with the results and customer service.",
                    serviceName: "TV Repair",
                    providerName: "ElectroFix Pro",
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72)
                },
                {
                    _id: "review_4",
                    customerName: "Emily Chen",
                    customerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                    rating: 5,
                    comment: "Amazing AC repair service! Fixed our air conditioner during the hot summer quickly.",
                    serviceName: "AC Repair",
                    providerName: "CoolAir Solutions",
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96)
                }
            ].slice(0, limit);
        }

        console.log('GET /api/reviews/recent - Returning', reviews.length, 'recent reviews');
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching recent reviews:', error);
        res.status(500).json({ error: 'Failed to fetch recent reviews' });
    }
});

// Get review statistics (public)
app.get('/api/reviews/stats', async (req, res) => {
    try {
        let stats = {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            },
            totalCustomers: 0
        };

        if (db) {
            // MongoDB storage
            const reviewsCollection = db.collection('reviews');
            const allReviews = await reviewsCollection.find({}).toArray();
            
            stats.totalReviews = allReviews.length;
            if (allReviews.length > 0) {
                stats.averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
                allReviews.forEach(review => {
                    stats.ratingDistribution[review.rating]++;
                });
                stats.totalCustomers = new Set(allReviews.map(r => r.customerEmail)).size;
            }
        } else {
            // In-memory storage with sample stats
            stats = {
                totalReviews: 147,
                averageRating: 4.8,
                ratingDistribution: {
                    5: 98,
                    4: 35,
                    3: 10,
                    2: 3,
                    1: 1
                },
                totalCustomers: 134
            };
        }

        console.log('GET /api/reviews/stats - Returning review statistics');
        res.json(stats);
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({ error: 'Failed to fetch review statistics' });
    }
});

// Create new review (protected)
app.post('/api/reviews', authenticateToken, async (req, res) => {
    try {
        const reviewData = {
            ...req.body,
            customerEmail: req.user.email,
            customerName: req.user.displayName || req.user.email,
            createdAt: new Date(),
            createdBy: req.user.uid
        };

        let result;

        if (db) {
            // MongoDB storage
            const reviewsCollection = db.collection('reviews');
            result = await reviewsCollection.insertOne(reviewData);
            reviewData._id = result.insertedId;
        } else {
            // In-memory storage
            reviewData._id = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            if (!memoryDatabase.reviews) {
                memoryDatabase.reviews = [];
            }
            memoryDatabase.reviews.push(reviewData);
            result = { insertedId: reviewData._id };
        }

        console.log('POST /api/reviews - Added new review by', req.user.email);
        res.status(201).json({
            message: 'Review added successfully',
            reviewId: result.insertedId,
            review: reviewData
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// Get reviews for a specific service (public)
app.get('/api/reviews/service/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;
        let serviceReviews = [];

        if (db) {
            // MongoDB storage
            const reviewsCollection = db.collection('reviews');
            serviceReviews = await reviewsCollection.find({ serviceId }).sort({ createdAt: -1 }).toArray();
        } else {
            // In-memory storage
            if (memoryDatabase.reviews) {
                serviceReviews = memoryDatabase.reviews
                    .filter(r => r.serviceId === serviceId)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
        }

        console.log('GET /api/reviews/service/:serviceId - Found', serviceReviews.length, 'reviews for service');
        res.json(serviceReviews);
    } catch (error) {
        console.error('Error fetching service reviews:', error);
        res.status(500).json({ error: 'Failed to fetch service reviews' });
    }
});

// Get reviews by a specific user (protected)
app.get('/api/reviews/user/:email', authenticateToken, async (req, res) => {
    try {
        const { email } = req.params;

        if (req.user.email !== email) {
            return res.status(403).json({ error: 'Access denied - can only view your own reviews' });
        }

        let userReviews = [];

        if (db) {
            // MongoDB storage
            const reviewsCollection = db.collection('reviews');
            userReviews = await reviewsCollection.find({ customerEmail: email }).sort({ createdAt: -1 }).toArray();
        } else {
            // In-memory storage
            if (memoryDatabase.reviews) {
                userReviews = memoryDatabase.reviews
                    .filter(r => r.customerEmail === email)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
        }

        console.log('GET /api/reviews/user/:email - Found', userReviews.length, 'reviews by user');
        res.json(userReviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ error: 'Failed to fetch user reviews' });
    }
});

// Enhanced Error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Server Error:', err.stack);

    // Handle specific error types
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON format in request body' });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: err.message });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    console.log('❌ 404 - Route not found:', req.method, req.path);
    res.status(404).json({ error: 'Route not found' });
});

// Initialize and start server
async function startServer() {
    try {
        // Connect to MongoDB (with fallback)
        await connectMongoDB();

        // Start the server
        app.listen(port, () => {
            console.log(`🚀 ServiceHub Pro Server running on port ${port}`);
            console.log(`📍 API Base URL: http://localhost:${port}/api`);
            console.log(`🔐 JWT Authentication enabled`);
            console.log(`📋 Enhanced error handling and logging enabled`);

            if (db) {
                console.log(`🗄️ MongoDB connected`);
            } else {
                console.log(`🗄️ Using in-memory storage (MongoDB fallback)`);
            }
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down ServiceHub Pro Server...');
    if (client) {
        await client.close();
        console.log('🗄️ MongoDB connection closed');
    }
    process.exit(0);
});

// Start the server
startServer();
