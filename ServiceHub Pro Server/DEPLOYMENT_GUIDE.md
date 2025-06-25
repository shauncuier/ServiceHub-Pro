# ServiceHub Pro Server Deployment Guide

## Review System Implementation

This server now includes a complete review system with the following endpoints:

### Review Endpoints Added:
- `GET /api/reviews` - Get all reviews (public)
- `GET /api/reviews/recent` - Get recent reviews for testimonials (public)
- `GET /api/reviews/service/:serviceId` - Get reviews for specific service (public)
- `GET /api/reviews/provider/:email` - Get reviews by provider (public)
- `GET /api/reviews/user/:email` - Get reviews by user (protected)
- `POST /api/reviews` - Create new review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)
- `GET /api/reviews/stats` - Get review statistics (public)

## Deployment Steps for Vercel:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from Server Directory**:
   ```bash
   cd "ServiceHub Pro Server"
   vercel --prod
   ```
   
   **Note**: If you get an error about `functions` and `builds` properties, the vercel.json has been updated to fix this issue.

4. **Environment Variables** (Set in Vercel Dashboard):
   - `DB_USERNAME` - MongoDB username
   - `DB_PASSWORD` - MongoDB password
   - `JWT_SECRET` - JWT secret key
   - `NODE_ENV` - production

## Database Schema:

### Reviews Collection:
```javascript
{
  _id: ObjectId,
  serviceId: String,          // ID of the service being reviewed
  providerEmail: String,      // Email of service provider
  customerEmail: String,      // Email of customer who left review
  customerName: String,       // Name of customer
  rating: Number,            // 1-5 star rating
  comment: String,           // Review comment
  serviceName: String,       // Name of service reviewed
  createdAt: Date,          // When review was created
  createdBy: String,        // User ID who created review
  updatedAt: Date,          // When review was last updated (optional)
  updatedBy: String         // User ID who updated review (optional)
}
```

### Indexes Created:
- `serviceId: 1`
- `customerEmail: 1`
- `providerEmail: 1`
- `rating: 1`
- `createdAt: -1`

## Testing Locally:

1. **Start the server**:
   ```bash
   node index.js
   ```

2. **Test review endpoints**:
   ```bash
   # Get all reviews
   curl http://localhost:3000/api/reviews
   
   # Get review stats
   curl http://localhost:3000/api/reviews/stats
   
   # Get reviews for a provider
   curl http://localhost:3000/api/reviews/provider/example@email.com
   ```

## Frontend Integration:

The frontend API layer (`ServiceHub Pro Client/src/utils/api.js`) has been updated to:
- Automatically use localhost for development
- Use Vercel URL for production
- Include all review CRUD operations
- Handle authentication properly

## Production Checklist:

- [ ] MongoDB connection string configured
- [ ] Environment variables set in Vercel
- [ ] Reviews collection indexes created
- [ ] Server deployed to Vercel
- [ ] Frontend pointing to correct API URL
- [ ] Review functionality tested end-to-end

## Features Implemented:

### Security:
- Users can only review completed services
- Users cannot review the same service twice
- Users can only edit/delete their own reviews
- JWT authentication required for protected endpoints

### Validation:
- Rating must be 1-5 stars
- Review comment is required
- Minimum comment length validation
- Service ID and provider email validation

### User Experience:
- Beautiful review submission modal
- Star rating display
- Review statistics calculation
- Real-time review updates
- Responsive design

## Troubleshooting:

### "Route not found" Error:
1. Ensure server is deployed to Vercel
2. Check environment variables are set
3. Verify MongoDB connection
4. Test endpoints manually with curl

### CORS Issues:
1. **Problem**: "Access to fetch blocked by CORS policy"
2. **Solution**: Enhanced CORS configuration implemented
3. **Check**: Verify frontend domain is in allowed origins
4. **Test**: Check browser console for CORS warnings

### Authentication Issues:
1. Check Firebase token is being sent
2. Verify JWT secret is configured
3. Ensure user is logged in properly

### Database Connection:
1. Verify MongoDB connection string
2. Check database credentials
3. Ensure MongoDB Atlas whitelist includes Vercel IPs
