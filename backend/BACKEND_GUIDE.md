/**
 * Backend - Quick Reference
 * 
 * This file documents backend structure and common operations
 */

// ============================================
// DATABASE MODELS
// ============================================

/*
User
  - id (UUID)
  - fullName
  - email (unique)
  - password (hashed)
  - profileImage
  - bio
  - createdAt, updatedAt

Photo
  - id (UUID)
  - userId (FK)
  - title
  - description
  - url
  - cloudinaryId
  - createdAt, updatedAt

Video
  - id (UUID)
  - userId (FK)
  - title
  - description
  - url
  - thumbnailUrl
  - cloudinaryId
  - duration
  - createdAt, updatedAt

Journal
  - id (UUID)
  - userId (FK)
  - title
  - content (LONGTEXT)
  - mood
  - createdAt, updatedAt

Milestone
  - id (UUID)
  - userId (FK)
  - title
  - description
  - date
  - category (ENUM)
  - createdAt, updatedAt
*/

// ============================================
// AUTHENTICATION ROUTES
// ============================================

/*
POST /api/auth/register
  Input: { fullName, email, password }
  Output: { user, token }
  
POST /api/auth/login
  Input: { email, password }
  Output: { user, token }
*/

// ============================================
// PHOTO ROUTES
// ============================================

/*
GET /api/photos
  Returns: [Photo]
  
GET /api/photos/{id}
  Returns: Photo
  
POST /api/photos
  Input: { title, description, url, cloudinaryId }
  Output: Photo
  
DELETE /api/photos/{id}
  Returns: { message }
  
GET /api/photos/search?q=query
  Returns: [Photo]
*/

// ============================================
// MIDDLEWARE
// ============================================

// Auth Middleware:
// Verifies JWT token and extracts user info
// Applied to all protected routes
// Usage: router.use(authMiddleware);

// Error Handler:
// Catches and formats errors
// Applied globally
// Usage: app.use(errorHandler);

// ============================================
// SEQUELIZE QUERIES
// ============================================

// Find all:
const photos = await Photo.findAll({ where: { userId } });

// Find one:
const photo = await Photo.findByPk(id);

// Create:
const photo = await Photo.create({ userId, title, url });

// Update:
photo.title = 'New Title';
await photo.save();

// Delete:
await photo.destroy();

// Search:
const photos = await Photo.findAll({
  where: {
    userId,
    title: { [Op.like]: `%query%` }
  }
});

// ============================================
// ENVIRONMENT SETUP
// ============================================

/*
Required .env variables:
  DB_HOST
  DB_USER
  DB_PASSWORD
  DB_NAME
  DB_PORT
  JWT_SECRET
  API_PORT
  CLOUDINARY_CLOUD_NAME
  CLOUDINARY_API_KEY
  CLOUDINARY_API_SECRET
*/

// ============================================
// START SERVER
// ============================================

/*
npm run dev     - Development mode with nodemon
npm start       - Production mode
*/

// ============================================
// DATABASE SYNC
// ============================================

/*
Sequelize auto-syncs models on server start:
  sequelize.sync()
  
For production, use migrations instead
*/

// ============================================
// API RESPONSE FORMAT
// ============================================

// Success:
res.json({ data });
res.status(201).json({ message, data });

// Error:
res.status(400).json({ message });
res.status(401).json({ message: 'Unauthorized' });
res.status(404).json({ message: 'Not found' });

// ============================================
// COMMON PATTERNS
// ============================================

// Validate user ownership:
if (resource.userId !== req.user.id) {
  return res.status(403).json({ message: 'Unauthorized' });
}

// Hash password:
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password:
const match = await bcrypt.compare(password, hashedPassword);

// Generate JWT:
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify JWT:
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// ============================================
// TESTING ENDPOINTS
// ============================================

/*
Using cURL:

Register:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John","email":"john@example.com","password":"test123"}'

Login:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"test123"}'

Get Photos (with auth):
curl -X GET http://localhost:5000/api/photos \
  -H "Authorization: Bearer {token}"

Create Photo:
curl -X POST http://localhost:5000/api/photos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"title":"My Photo","url":"https://..."}'
*/

// ============================================
// PERFORMANCE TIPS
// ============================================

/*
1. Use database indexes
   - Add indexes to frequently queried columns
   - Exists in schema.sql

2. Pagination
   - Implement offset/limit for large datasets
   - Can be added to routes

3. Caching
   - Use Redis for session/token caching
   - Cache user data temporarily

4. Query optimization
   - Use select() to limit fields
   - Avoid N+1 queries
   - Use eager loading (include)

5. Rate limiting
   - Implement request throttling
   - Already in server config
*/

// ============================================
// LOGGING
// ============================================

// Console logging for debugging:
console.log('Info:', data);
console.error('Error:', error);

// In production, use proper logging:
// - Winston
// - Morgan
// - Bunyan

// ============================================
// DEPLOYMENT
// ============================================

/*
Railway:
  1. Push to GitHub
  2. Connect repository
  3. Set environment variables
  4. Auto-deploy on push

Heroku:
  1. Create app: heroku create
  2. Add MySQL: heroku addons:create cleardb:ignite
  3. Deploy: git push heroku main
  4. Set env: heroku config:set KEY=VALUE

AWS:
  1. Create EC2 instance
  2. Install Node.js and MySQL
  3. Clone repository
  4. npm install && npm start
*/

// ============================================
// TROUBLESHOOTING
// ============================================

/*
Database connection fails:
  - Check MySQL is running
  - Verify credentials in .env
  - Check database exists

Port in use:
  - Change API_PORT in .env
  - Or: lsof -i :5000 && kill -9 <PID>

JWT errors:
  - Ensure JWT_SECRET is set
  - Check token hasn't expired
  - Verify token format in header

Sequelize errors:
  - Check model definitions
  - Verify database schema matches models
  - Clear node_modules and reinstall
*/
