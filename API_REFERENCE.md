# Legacy OS - API Reference

## Overview
Complete REST API reference for Legacy OS backend.

Base URL: `http://localhost:5000/api`

All endpoints (except `/auth/register` and `/auth/login`) require JWT authentication via `Authorization: Bearer {token}` header.

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Photos Endpoints

### Get All Photos
```http
GET /photos
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "photo-id-1",
    "title": "Summer Vacation",
    "description": "Beach photos",
    "url": "https://res.cloudinary.com/...",
    "createdAt": "2025-06-15T10:30:00Z",
    "updatedAt": "2025-06-15T10:30:00Z"
  }
]
```

### Get Single Photo
```http
GET /photos/{photoId}
Authorization: Bearer {token}
```

### Create Photo
```http
POST /photos
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Photo",
  "description": "Photo description",
  "url": "https://res.cloudinary.com/...",
  "cloudinaryId": "cloudinary_id"
}
```

**Response (201):** Returns created photo object

### Delete Photo
```http
DELETE /photos/{photoId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Photo deleted successfully"
}
```

### Search Photos
```http
GET /photos/search?q=vacation
Authorization: Bearer {token}
```

**Response (200):** Returns array of matching photos

---

## Videos Endpoints

### Get All Videos
```http
GET /videos
Authorization: Bearer {token}
```

### Get Single Video
```http
GET /videos/{videoId}
Authorization: Bearer {token}
```

### Create Video
```http
POST /videos
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Video",
  "description": "Video description",
  "url": "https://res.cloudinary.com/...",
  "thumbnailUrl": "https://...",
  "cloudinaryId": "cloudinary_id",
  "duration": 300
}
```

### Delete Video
```http
DELETE /videos/{videoId}
Authorization: Bearer {token}
```

### Search Videos
```http
GET /videos/search?q=vacation
Authorization: Bearer {token}
```

---

## Journals Endpoints

### Get All Journals
```http
GET /journals
Authorization: Bearer {token}
```

### Get Single Journal
```http
GET /journals/{journalId}
Authorization: Bearer {token}
```

### Create Journal
```http
POST /journals
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Daily Journal",
  "content": "<p>Today was amazing...</p>",
  "mood": "😊"
}
```

### Update Journal
```http
PUT /journals/{journalId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content...</p>",
  "mood": "😍"
}
```

### Delete Journal
```http
DELETE /journals/{journalId}
Authorization: Bearer {token}
```

### Search Journals
```http
GET /journals/search?q=happiness
Authorization: Bearer {token}
```

---

## Milestones Endpoints

### Get All Milestones
```http
GET /milestones
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "milestone-1",
    "title": "Got First Job",
    "description": "Started at Tech Company",
    "date": "2025-01-15",
    "category": "Career",
    "createdAt": "2025-01-15T00:00:00Z"
  }
]
```

### Get Single Milestone
```http
GET /milestones/{milestoneId}
Authorization: Bearer {token}
```

### Create Milestone
```http
POST /milestones
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Graduation",
  "description": "Completed Bachelor's Degree",
  "date": "2025-06-15",
  "category": "Education"
}
```

**Categories:** `Education`, `Career`, `Personal`, `Travel`, `Achievement`

### Update Milestone
```http
PUT /milestones/{milestoneId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "date": "2025-06-20"
}
```

### Delete Milestone
```http
DELETE /milestones/{milestoneId}
Authorization: Bearer {token}
```

---

## User Endpoints

### Get User Profile
```http
GET /users/profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "user-id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "bio": "Photography enthusiast",
  "profileImage": "https://...",
  "totalMemories": 145,
  "totalPhotos": 89,
  "totalVideos": 23,
  "journalEntries": 28,
  "milestones": 5,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "bio": "Updated bio",
  "profileImage": "https://..."
}
```

**Response (200):** Returns updated user object

---

## Timeline Endpoints

### Get All Timeline Events
```http
GET /timeline
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "photo-1",
    "title": "Summer Photos",
    "type": "photo",
    "date": "2025-06-15T10:30:00Z",
    "url": "https://..."
  },
  {
    "id": "milestone-1",
    "title": "Got First Job",
    "type": "milestone",
    "date": "2025-01-15T00:00:00Z"
  }
]
```

Sorted by date (newest first). Returns combined events from photos, videos, journals, and milestones.

### Get Timeline by Year
```http
GET /timeline/2025
Authorization: Bearer {token}
```

**Response (200):** Same format as above, filtered to year 2025

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": ["Field is required"]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized access"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

API enforces rate limiting:
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Pagination (Future)

When implemented, use:
```http
GET /photos?page=1&limit=20
Authorization: Bearer {token}
```

---

## Data Types

- **UUID**: `550e8400-e29b-41d4-a716-446655440000`
- **ISO Date**: `2025-06-15T10:30:00Z`
- **Mood**: Single emoji string (e.g., `😊`, `😔`, `😍`)
- **Category**: `Education`, `Career`, `Personal`, `Travel`, `Achievement`

---

## Webhooks (Future)

Future versions will support webhooks for:
- New photo/video uploads
- Journal entries
- Milestone creation
- User activity

---

## Versioning

Current API Version: **1.0.0**

Future versions will be available at `/api/v2/`, etc.

---

**API Last Updated: June 2025**
