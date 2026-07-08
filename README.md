# Legacy OS 🎬

> Your Life, Organized Like a Movie

A premium, production-quality full-stack web application for preserving photos, videos, journal entries, milestones, and memories in a beautiful interactive timeline.

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-green?style=flat-square&logo=express)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)](https://mysql.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 🌟 Features

### 📸 Photo Gallery
- **Masonry Layout**: Beautiful grid layout with hover effects
- **Smart Search**: Filter photos by title
- **Cloudinary Integration**: Cloud storage for unlimited photos
- **Fast Loading**: Optimized image delivery

### 🎬 Video Management
- **Video Upload**: Store videos with automatic thumbnail generation
- **Playback**: Built-in video player
- **Organization**: Search and organize videos by date
- **Streaming**: Cloud-based video delivery

### 📔 Rich Journals
- **Rich Text Editor**: Write with formatting, links, images
- **Mood Tracking**: Attach emotional context to entries
- **Search**: Full-text search across journal entries
- **Edit & Delete**: Manage entries anytime

### 🎯 Milestones
- **Track Achievements**: Education, Career, Personal, Travel, Achievement
- **Timeline View**: Visualize life events
- **Categorization**: Organize by milestone type
- **Date Tracking**: Remember important dates

### 📊 Interactive Timeline
- **Chronological View**: See all memories organized by time
- **Year Filtering**: Browse by year
- **Combined Feed**: Photos, videos, journals, milestones in one view
- **Animated Scroll**: Beautiful scroll animations

### 🎨 Dashboard Analytics
- **Memory Statistics**: Total memories, photos, videos, journals
- **Recent Activity**: Latest additions
- **Insights**: Memory patterns and trends
- **Quick Actions**: Fast access to features

### 🔐 Security
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt encryption
- **User Isolation**: Users only see their data
- **HTTPS Ready**: Production-ready SSL/TLS support

---

## 🎨 Design Highlights

### Modern UI/UX
- **Glassmorphism**: Frosted glass effect cards
- **Smooth Animations**: Framer Motion transitions
- **Dark Mode**: Premium dark theme
- **Responsive Design**: Mobile-first approach
- **Micro Interactions**: Subtle hover effects

### Color Palette
- **Primary**: `#0B1020`
- **Secondary**: `#121A30`
- **Accent**: `#6D5DFC` (Purple)
- **Secondary Accent**: `#00D4FF` (Cyan)
- **Text**: `#FFFFFF`
- **Muted**: `#A0AEC0`

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **React Quill** - Rich text editor

### Backend
- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

### Database
- **MySQL** - Relational database
- **Sequelize ORM** - Database abstraction

### Storage
- **Cloudinary** - Image/video CDN

---

## 📦 Project Structure

```
Legacy OS/
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── photos/
│   │   │   ├── videos/
│   │   │   ├── journal/
│   │   │   ├── milestones/
│   │   │   └── timeline/
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── Dashboard/
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.js
│   ├── lib/
│   │   ├── api.js
│   │   └── apiService.js
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Photo.js
│   │   ├── Video.js
│   │   ├── Journal.js
│   │   └── Milestone.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── photoController.js
│   │   ├── videoController.js
│   │   ├── journalController.js
│   │   ├── milestoneController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── photoRoutes.js
│   │   ├── videoRoutes.js
│   │   ├── journalRoutes.js
│   │   ├── milestoneRoutes.js
│   │   ├── userRoutes.js
│   │   └── timelineRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── database.js
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── SETUP_GUIDE.md
├── DEPLOYMENT_GUIDE.md
├── API_REFERENCE.md
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 5.7+
- Cloudinary account
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Database Setup
```bash
mysql -u root -p < database/schema.sql
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Installation and configuration
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API documentation
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload photo
- `DELETE /api/photos/{id}` - Delete photo
- `GET /api/photos/search?q=query` - Search photos

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload video
- `DELETE /api/videos/{id}` - Delete video
- `GET /api/videos/search?q=query` - Search videos

### Journals
- `GET /api/journals` - Get all journals
- `POST /api/journals` - Create journal
- `PUT /api/journals/{id}` - Update journal
- `DELETE /api/journals/{id}` - Delete journal
- `GET /api/journals/search?q=query` - Search journals

### Milestones
- `GET /api/milestones` - Get all milestones
- `POST /api/milestones` - Create milestone
- `PUT /api/milestones/{id}` - Update milestone
- `DELETE /api/milestones/{id}` - Delete milestone

### Timeline
- `GET /api/timeline` - Get all timeline events
- `GET /api/timeline/{year}` - Get timeline by year

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.

---

## 🎯 Features & Pages

### Landing Page
- ✅ Hero section with CTA
- ✅ Features showcase
- ✅ Testimonials
- ✅ Pricing (can be added)
- ✅ Newsletter signup (can be added)

### Authentication
- ✅ Register with validation
- ✅ Login with JWT
- ✅ Password hashing
- ✅ Session management

### Dashboard
- ✅ Responsive sidebar
- ✅ Top navigation
- ✅ Analytics cards
- ✅ Recent activity feed

### Photo Module
- ✅ Gallery view with masonry layout
- ✅ Upload photos
- ✅ Search and filter
- ✅ Delete photos

### Video Module
- ✅ Video upload
- ✅ Thumbnail generation
- ✅ Search videos
- ✅ Delete videos

### Journal Module
- ✅ Rich text editor
- ✅ Mood tracking
- ✅ Create/edit/delete entries
- ✅ Search journals

### Milestone Module
- ✅ Create milestones
- ✅ Categorize by type
- ✅ Timeline visualization
- ✅ Date tracking

### Timeline Page
- ✅ Interactive timeline
- ✅ Year filtering
- ✅ Combined memory feed
- ✅ Scroll animations

---

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **User Isolation**: Data segregation per user
- **Input Validation**: All inputs validated
- **CORS Protection**: Cross-origin request handling
- **Rate Limiting**: Request throttling

---

## 📈 Performance Optimizations

### Frontend
- Image lazy loading
- Code splitting
- CSS-in-JS optimization
- Efficient re-renders with React.memo
- Tailwind CSS purging

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Response compression
- Caching strategies

---

## 🚀 Deployment

### Frontend
Deploy to Vercel, Netlify, or similar:
```bash
npm run build
npm start
```

### Backend
Deploy to Railway, Heroku, or AWS:
```bash
npm start
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📱 Responsive Design

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Laptop (1024px+)
- ✅ Desktop (1280px+)
- ✅ 4K (1920px+)

---

## 🛠 Development

### Hot Reload
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev
```

### Database Management
```bash
# Connect to MySQL
mysql -u root -p legacy_os

# View tables
SHOW TABLES;

# Query data
SELECT * FROM Users LIMIT 5;
```

---

## 🐛 Troubleshooting

### Database Connection Failed
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists

### Port Already in Use
- Change port in `.env`
- Or kill existing process

### CORS Errors
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL`

### Cloudinary Upload Fails
- Verify cloud name and credentials
- Check upload preset exists

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Legacy OS Development Team**

- GitHub: [your-github]
- Email: [your-email]
- Portfolio: [your-portfolio]

---

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 💬 Support

For support, email support@legacyos.com or open an issue on GitHub.

---

## 🌟 Show Your Support

Give a ⭐ if you love Legacy OS!

---

## 📞 Contact

- **Questions?** Email: info@legacyos.com
- **Bug Report**: bugs@legacyos.com
- **Feature Request**: features@legacyos.com

---

**Built with ❤️ for preserving memories**

**© 2025 Legacy OS. All rights reserved.**
#   M e m o r y - O S  
 