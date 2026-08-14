# Legacy OS - Installation & Setup Guide

> **Note:** As of this guide's latest revision, Legacy OS runs on **Supabase (hosted Postgres +
> Auth)** instead of MySQL. `database/schema.sql` is kept only for historical reference -- the
> real schema lives in `supabase/migrations/*.sql`.

## Prerequisites

- Node.js (v18 or higher)
- A Supabase project (free tier is fine) -- https://supabase.com
- Supabase CLI (`npx supabase --version` works with no install; or `npm i -g supabase`)
- npm or yarn
- Cloudinary account (for image/video storage)
- An SMS/OTP provider connected in Supabase (Authentication -> Providers -> Phone) if you want
  phone sign-in to actually deliver codes. Without it, `/api/auth/otp/request` will return a 503.

## Project Structure

```
Legacy OS/
├── frontend/                # Next.js frontend application
├── backend/                 # Express.js backend API
├── supabase/migrations/     # Postgres schema + RLS policies (source of truth)
└── database/schema.sql      # Superseded MySQL schema, kept for history only
```

---

## Backend Setup

### 1. Create a Supabase project
Create a project at https://supabase.com/dashboard, then from **Project Settings**:
- **API**: copy the Project URL, `anon` key, `service_role` key, and JWT Secret.
- **Database**: copy the connection string (URI) for `DATABASE_URL`.

### 2. Apply the database migrations
```bash
cd "Legacy OS"
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push   # applies everything in supabase/migrations/
```

### 3. Navigate to Backend Directory
```bash
cd backend
npm install
```

### 4. Create `.env` File
```bash
cp .env.example .env
```

Fill in the values from step 1 (`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`), plus your Cloudinary credentials. Leave
`AI_PROVIDER=local` unless you have an OpenAI (or other) API key -- see `.env.example` for the
full list with descriptions.

### 5. Start Backend Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

### 6. Verify Backend

```bash
curl http://localhost:5000/api/health
# Response: {"status":"OK"}
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env.local` File
```bash
cp .env.example .env.local
```

**Update the following in `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Generate Cloudinary Upload Preset

1. Log in to your Cloudinary account
2. Go to Settings → Upload
3. Create an unsigned upload preset (or use existing)
4. Update `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env.local`

### 5. Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 6. Build for Production
```bash
npm run build
npm start
```

---

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `password123` |
| `DB_NAME` | Database name | `legacy_os` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | JWT signing secret | `super_secret_key` |
| `API_PORT` | API server port | `5000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_secret` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | `preset_name` |

---

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 
{
  "user": { "id": "...", "fullName": "...", "email": "..." },
  "token": "eyJhbGc..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "user": { "id": "...", "fullName": "...", "email": "..." },
  "token": "eyJhbGc..."
}
```

### Photos

#### Get All Photos
```http
GET /api/photos
Authorization: Bearer {token}

Response: [ { id, title, description, url, createdAt, ... } ]
```

#### Create Photo
```http
POST /api/photos
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Photo",
  "description": "Photo description",
  "url": "https://...",
  "cloudinaryId": "..."
}
```

#### Delete Photo
```http
DELETE /api/photos/{id}
Authorization: Bearer {token}
```

#### Search Photos
```http
GET /api/photos/search?q=query
Authorization: Bearer {token}
```

### Videos

Similar endpoints as Photos:
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Create video
- `DELETE /api/videos/{id}` - Delete video
- `GET /api/videos/search?q=query` - Search videos

### Journals

#### Get All Journals
```http
GET /api/journals
Authorization: Bearer {token}
```

#### Create Journal
```http
POST /api/journals
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Entry",
  "content": "<p>Rich HTML content</p>",
  "mood": "😊"
}
```

#### Update Journal
```http
PUT /api/journals/{id}
Authorization: Bearer {token}
Content-Type: application/json

{ "title": "...", "content": "...", "mood": "..." }
```

#### Delete Journal
```http
DELETE /api/journals/{id}
Authorization: Bearer {token}
```

### Milestones

#### Get All Milestones
```http
GET /api/milestones
Authorization: Bearer {token}
```

#### Create Milestone
```http
POST /api/milestones
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Graduation",
  "description": "Completed my degree",
  "date": "2025-06-15",
  "category": "Education"
}
```

#### Update Milestone
```http
PUT /api/milestones/{id}
Authorization: Bearer {token}
```

#### Delete Milestone
```http
DELETE /api/milestones/{id}
Authorization: Bearer {token}
```

### Timeline

#### Get All Timeline Events
```http
GET /api/timeline
Authorization: Bearer {token}

Response: Combined events from photos, videos, journals, milestones
```

#### Get Timeline by Year
```http
GET /api/timeline/2025
Authorization: Bearer {token}
```

---

## Troubleshooting

### Issue: Database Connection Failed
**Solution:** Verify MySQL is running and credentials are correct in `.env`

```bash
mysql -u root -p -e "SELECT 1"
```

### Issue: Port Already in Use
**Backend:** Change `API_PORT` in `.env`
**Frontend:** Use `npm run dev -- -p 3001`

### Issue: CORS Error
**Solution:** Ensure backend is running and `NEXT_PUBLIC_API_URL` is correct

### Issue: Cloudinary Upload Fails
**Solution:** 
- Verify Cloudinary credentials in `.env`
- Check upload preset exists and is unsigned
- Verify cloud name is correct

### Issue: JWT Token Errors
**Solution:**
- Generate a new `JWT_SECRET` in `.env`
- Clear localStorage in browser
- Login again

---

## Development Tips

### Hot Reload
- **Backend**: Automatically reloads with `npm run dev` (nodemon)
- **Frontend**: Automatically reloads with `npm run dev` (Next.js)

### Database Queries
Test queries in MySQL:
```bash
mysql -u root -p legacy_os
SHOW TABLES;
SELECT * FROM Users LIMIT 5;
```

### API Testing
Use Postman or cURL to test API endpoints:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","password":"test123"}'
```

---

## Performance Optimization

### Frontend
- Images are lazy-loaded via Next.js Image component
- Animations use Framer Motion with GPU acceleration
- Code splitting with dynamic imports

### Backend
- Database indexes on frequently queried columns
- Pagination support (can be added to routes)
- JWT token caching in frontend localStorage

---

## Security Considerations

1. **Password Security**: All passwords hashed with bcrypt (10 rounds)
2. **JWT Tokens**: Signed with `JWT_SECRET`, expires in 7 days
3. **CORS**: Configured to allow frontend origin
4. **Validation**: Input validation on all endpoints
5. **Authorization**: User isolation (users can only access their own data)

---

## Deployment

### Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

Update environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

### Railway or Heroku (Backend)
1. Create account on Railway/Heroku
2. Connect GitHub repository
3. Add environment variables
4. Deploy

---

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Sequelize ORM](https://sequelize.org/)
- [Cloudinary SDK](https://cloudinary.com/documentation)
- [JWT.io](https://jwt.io/)

---

**Happy coding! 🚀**
