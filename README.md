<div align="center">

# Legacy OS

### *Your Life, Organized Like a Movie*

A premium, production-grade full-stack web application for preserving photos, videos, journal entries, milestones, and memories — all inside one beautifully animated interactive timeline.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-green?style=for-the-badge&logo=express)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)]()
[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)]()

<br/>

<a href="#-quick-start">Quick Start</a> •
<a href="#-features">Features</a> •
<a href="#-design-highlights">Design</a> •
<a href="#-tech-stack">Tech Stack</a> •
<a href="#-api-endpoints">API</a> •
<a href="#-deployment">Deployment</a>

</div>

---

## 🪞 What is Legacy OS?

Legacy OS is a personal memory operating system. Instead of scattering photos across cloud drives, videos across phones, and thoughts across random notes apps, Legacy OS gives every memory a home — timestamped, searchable, and woven into a single cinematic timeline of your life.

Think of it as **the director's cut of your own story.**

---

## 🌟 Features

### 📸 Photo Gallery
- **Masonry Layout** — Beautiful Pinterest-style grid with smooth hover effects
- **Smart Search** — Instantly filter photos by title
- **Cloudinary Integration** — Unlimited, optimized cloud storage
- **Fast Loading** — Lazy-loaded, compressed image delivery

### 🎬 Video Management
- **Video Upload** — Store videos with automatic thumbnail generation
- **Built-in Playback** — Native in-app video player
- **Organization** — Search and sort videos by date
- **Cloud Streaming** — Fast, adaptive video delivery

### 📔 Rich Journals
- **Rich Text Editor** — Write with formatting, links, and embedded images
- **Mood Tracking** — Tag entries with the emotional context of the moment
- **Full-Text Search** — Instantly find any journal entry
- **Edit & Delete** — Full control over your written memories

### 🎯 Milestones
- **Track Achievements** — Education, Career, Personal, Travel, and more
- **Timeline View** — Visualize life events as they unfolded
- **Categorization** — Organize by milestone type and importance
- **Date Tracking** — Never lose the "when" behind the "what"

### 📊 Interactive Timeline
- **Chronological View** — Every memory, laid out in order
- **Year Filtering** — Jump straight to any chapter of your life
- **Combined Feed** — Photos, videos, journals, and milestones in one stream
- **Animated Scroll** — Cinematic scroll-triggered animations

### 🎨 Dashboard Analytics
- **Memory Statistics** — Total memories, photos, videos, and journals at a glance
- **Recent Activity** — See what you've added most recently
- **Insights** — Surface patterns and trends in your memory-keeping
- **Quick Actions** — One-click shortcuts to every core feature

### 🔐 Security First
- **JWT Authentication** — Stateless, secure token-based auth
- **Password Hashing** — Industry-standard bcrypt encryption
- **User Isolation** — Every user only ever sees their own data
- **HTTPS Ready** — Built for production-grade SSL/TLS

---

## 🎨 Design Highlights

Legacy OS was designed to feel less like a CRUD app and more like a **cinematic archive**.

- 🪟 **Glassmorphism** — Frosted-glass cards that float above the background
- 🎞️ **Smooth Animations** — Framer Motion-powered transitions throughout
- 🌑 **Dark Mode** — A premium, eye-friendly dark theme by default
- 📱 **Responsive Design** — Mobile-first, scales flawlessly to 4K
- ✨ **Micro Interactions** — Subtle hover, focus, and press feedback everywhere

### 🎨 Color Palette

<div align="center">

| Role | Hex | Swatch |
|---|---|---|
| Primary | `#0B1020` | ![#0B1020](https://placehold.co/60x20/0B1020/0B1020.png) |
| Secondary | `#121A30` | ![#121A30](https://placehold.co/60x20/121A30/121A30.png) |
| Accent (Purple) | `#6D5DFC` | ![#6D5DFC](https://placehold.co/60x20/6D5DFC/6D5DFC.png) |
| Secondary Accent (Cyan) | `#00D4FF` | ![#00D4FF](https://placehold.co/60x20/00D4FF/00D4FF.png) |
| Text | `#FFFFFF` | ![#FFFFFF](https://placehold.co/60x20/FFFFFF/FFFFFF.png) |
| Muted | `#A0AEC0` | ![#A0AEC0](https://placehold.co/60x20/A0AEC0/A0AEC0.png) |

</div>

### Typography & Motion Principles
- Generous whitespace to let memories breathe
- Purposeful motion — every animation communicates state, never decoration for its own sake
- High-contrast text on deep, muted backgrounds for long-session readability

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- Next.js 14 (React framework)
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React (icons)
- React Hot Toast
- React Quill (rich text)

</td>
<td valign="top" width="33%">

**Backend**
- Node.js
- Express.js
- Sequelize ORM
- JWT
- bcryptjs
- CORS

</td>
<td valign="top" width="33%">

**Data & Storage**
- MySQL 8.0
- Sequelize ORM
- Cloudinary (media CDN)

</td>
</tr>
</table>

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

| Requirement | Version |
|---|---|
| Node.js | 16+ |
| MySQL | 5.7+ |
| Cloudinary account | Free tier is fine |
| Package manager | npm or yarn |

### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-github/legacy-os.git
cd legacy-os
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 3️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 4️⃣ Database Setup

```bash
mysql -u root -p < database/schema.sql
```

Your app should now be running at `http://localhost:3000` 🎉

> 📘 See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed, step-by-step installation instructions.

---

## 📚 Documentation

| Doc | Purpose |
|---|---|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Installation & configuration walkthrough |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete REST API documentation |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Production deployment instructions |

---

## 🔌 API Endpoints

### 🔑 Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login |

### 📸 Photos
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/photos` | Get all photos |
| `POST` | `/api/photos` | Upload photo |
| `DELETE` | `/api/photos/{id}` | Delete photo |
| `GET` | `/api/photos/search?q=query` | Search photos |

### 🎬 Videos
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/videos` | Get all videos |
| `POST` | `/api/videos` | Upload video |
| `DELETE` | `/api/videos/{id}` | Delete video |
| `GET` | `/api/videos/search?q=query` | Search videos |

### 📔 Journals
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/journals` | Get all journals |
| `POST` | `/api/journals` | Create journal |
| `PUT` | `/api/journals/{id}` | Update journal |
| `DELETE` | `/api/journals/{id}` | Delete journal |
| `GET` | `/api/journals/search?q=query` | Search journals |

### 🎯 Milestones
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/milestones` | Get all milestones |
| `POST` | `/api/milestones` | Create milestone |
| `PUT` | `/api/milestones/{id}` | Update milestone |
| `DELETE` | `/api/milestones/{id}` | Delete milestone |

### 📊 Timeline
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/timeline` | Get all timeline events |
| `GET` | `/api/timeline/{year}` | Get timeline by year |

### 👤 User
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Get user profile |
| `PUT` | `/api/users/profile` | Update profile |

> 📘 See [API_REFERENCE.md](./API_REFERENCE.md) for full request/response schemas.

---

## 🎯 Features & Pages Checklist

<details>
<summary><strong>🏠 Landing Page</strong></summary>

- ✅ Hero section with CTA
- ✅ Features showcase
- ✅ Testimonials
- ⬜ Pricing (can be added)
- ⬜ Newsletter signup (can be added)

</details>

<details>
<summary><strong>🔐 Authentication</strong></summary>

- ✅ Register with validation
- ✅ Login with JWT
- ✅ Password hashing
- ✅ Session management

</details>

<details>
<summary><strong>📊 Dashboard</strong></summary>

- ✅ Responsive sidebar
- ✅ Top navigation
- ✅ Analytics cards
- ✅ Recent activity feed

</details>

<details>
<summary><strong>📸 Photo Module</strong></summary>

- ✅ Gallery view with masonry layout
- ✅ Upload photos
- ✅ Search and filter
- ✅ Delete photos

</details>

<details>
<summary><strong>🎬 Video Module</strong></summary>

- ✅ Video upload
- ✅ Thumbnail generation
- ✅ Search videos
- ✅ Delete videos

</details>

<details>
<summary><strong>📔 Journal Module</strong></summary>

- ✅ Rich text editor
- ✅ Mood tracking
- ✅ Create/edit/delete entries
- ✅ Search journals

</details>

<details>
<summary><strong>🎯 Milestone Module</strong></summary>

- ✅ Create milestones
- ✅ Categorize by type
- ✅ Timeline visualization
- ✅ Date tracking

</details>

<details>
<summary><strong>📊 Timeline Page</strong></summary>

- ✅ Interactive timeline
- ✅ Year filtering
- ✅ Combined memory feed
- ✅ Scroll animations

</details>

---

## 🔒 Security Features

| Feature | Description |
|---|---|
| **Password Security** | bcrypt hashing with per-user salt rounds |
| **JWT Tokens** | Secure, stateless authentication tokens |
| **User Isolation** | Strict data segregation per user |
| **Input Validation** | Every input validated server-side |
| **CORS Protection** | Configured cross-origin request handling |
| **Rate Limiting** | Request throttling to prevent abuse |

---

## 📈 Performance Optimizations

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- Image lazy loading
- Route-based code splitting
- CSS-in-JS optimization
- Efficient re-renders via `React.memo`
- Tailwind CSS purging in production

</td>
<td valign="top" width="50%">

**Backend**
- Database indexing on hot query paths
- Query optimization via Sequelize
- Connection pooling
- Response compression
- Caching strategies for repeat reads

</td>
</tr>
</table>

---

## 🚀 Deployment

### Frontend
Deploy to **Vercel**, **Netlify**, or similar:
```bash
npm run build
npm start
```

### Backend
Deploy to **Railway**, **Heroku**, or **AWS**:
```bash
npm start
```

> 📘 See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full production deployment instructions, environment variable checklists, and platform-specific tips.

---

## 📱 Responsive Design

| Breakpoint | Supported |
|---|---|
| Mobile (320px+) | ✅ |
| Tablet (768px+) | ✅ |
| Laptop (1024px+) | ✅ |
| Desktop (1280px+) | ✅ |
| 4K (1920px+) | ✅ |

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

<details>
<summary><strong>Database Connection Failed</strong></summary>

- Ensure MySQL is running
- Check credentials in `.env`
- Verify the database exists

</details>

<details>
<summary><strong>Port Already in Use</strong></summary>

- Change the port in `.env`
- Or kill the existing process occupying it

</details>

<details>
<summary><strong>CORS Errors</strong></summary>

- Verify the backend is running
- Check `NEXT_PUBLIC_API_URL` in your frontend `.env.local`

</details>

<details>
<summary><strong>Cloudinary Upload Fails</strong></summary>

- Verify your cloud name and API credentials
- Check that the upload preset exists and is unsigned/signed correctly

</details>

---

## 🗺 Roadmap

- ⬜ Shared/collaborative timelines (family & couples mode)
- ⬜ AI-generated "Year in Review" recap reels
- ⬜ Offline-first PWA support
- ⬜ Export timeline as a printable photo book
- ⬜ End-to-end encrypted private vault mode

*Have an idea? Open an issue — we'd love to hear it.*

---

## 🙏 Contributing

Contributions are welcome and genuinely appreciated!

1. **Fork** the repository
2. **Create** your feature branch — `git checkout -b feature/AmazingFeature`
3. **Commit** your changes — `git commit -m 'Add some AmazingFeature'`
4. **Push** to the branch — `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

Please make sure your PR description clearly explains the *what* and *why* of your change.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Legacy OS Development Team**

- GitHub: [Risikesh2006]
- Email: [your-email]
- Portfolio: [your-portfolio]

---

## 💬 Support

For support, email **support@legacyos.com** or open an issue on GitHub.

## 📞 Contact

| Type | Email |
|---|---|
| ❓ Questions | info@legacyos.com |
| 🐛 Bug Report | bugs@legacyos.com |
| ✨ Feature Request | features@legacyos.com |

---

<div align="center">

### 🌟 Show Your Support

If Legacy OS helped you preserve a memory worth keeping, give it a ⭐!

**Built with ❤️ for preserving memories**

**© 2025 Legacy OS. All rights reserved.**

</div>
