# 🎓 Peter Harvard INT'L School Alumni Portal

> A centralized digital community connecting graduates with their alma mater.

![Status](https://img.shields.io/badge/Status-In%20Development-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0%20MVP-blue)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)

---

## 📌 Project Overview

The **Peter Harvard INT'L School Alumni Portal** is a full-stack web application designed to connect graduates with their alma mater through a centralized digital community.

Alumni can register, access a searchable directory, view a blog, browse a gallery, and stay informed through events and announcements. School administrators have a dedicated dashboard to manage members, approvals, events, blog posts, gallery uploads, and bug reports.

---

## 🎯 Project Objectives

- Create a structured, searchable alumni database
- Highlight successful alumni and their achievements
- Enable easy communication through announcements, events, and a blog
- Provide a gallery to preserve school memories
- Build a scalable, maintainable, and visually polished web interface

---

## ✨ Core Features (MVP)

| Feature | Description |
|---|---|
| 📝 Alumni Registration | Alumni sign up and create a profile with avatar upload |
| ✅ Admin Approval System | Admins review and approve/reject registrations |
| 🔍 Alumni Directory | Searchable directory with individual profile pages |
| 📰 Blog | School blog with posts and individual post pages |
| 🖼️ Gallery | Photo gallery managed by admins |
| 📅 Events | Admin-managed events visible to all alumni |
| 🐛 Bug Reports | Alumni can report bugs; admins review submissions |
| 🛠️ Admin Dashboard | Full control panel for all admin operations |
| 🌗 Dark Mode | Theme toggle powered by ThemeContext |
| 🔐 Auth | Login, register, forgot password, and reset password flows |

---

## 🛠️ Tech Stack

### Frontend
- **React** — Component-based UI framework
- **Tailwind CSS** — Utility-first styling
- **Context API** — Global state (Auth + Theme)
- **Vite** — Fast build tool and dev server

### Backend / Database
- **Supabase** — Authentication, PostgreSQL database, storage, and edge functions

### Deployment
- **Vercel** — Hosting and continuous deployment

### Version Control
- **Git & GitHub**

---

## 👥 User Roles

### 🔐 Admin
- Log in via dedicated admin login
- View dashboard overview
- Approve or reject alumni registrations
- Manage all alumni profiles
- Post and manage events
- Write and manage blog posts
- Upload and manage gallery photos
- View and resolve bug reports
- Manage other admin accounts

### 🎓 Alumni
- Register and create a profile (with avatar)
- Log in and access personal dashboard
- Browse the alumni directory
- View and edit personal profile
- Read blog posts and events
- Browse the gallery
- Submit bug reports
- Reset forgotten passwords

---

## 📁 Project Structure

```
PETER-HARVARD-INT-L-SCHOOL-ALUMNI-PORTAL/
├── public/
│   ├── assets/
│   │   ├── Developers/
│   │   │   ├── anointed.png
│   │   │   └── goodness.png
│   │   ├── founders/
│   │   │   └── DrPeter.png
│   │   └── phislogo.png
│   └── favicon.ico
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── AlumniCard.jsx
│   │   ├── EventCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── PageTransition.jsx
│   │   ├── ReportBug.jsx
│   │   └── ScrollToTop.jsx
│   │
│   ├── context/                  # Global state management
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── layouts/                  # Shared page layouts
│   │   ├── AdminLayout.jsx
│   │   └── PublicLayout.jsx
│   │
│   ├── pages/                    # All page components
│   │   ├── About.jsx
│   │   ├── AlumniProfile.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Directory.jsx
│   │   ├── Events.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Gallery.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   └── admin/
│   │       ├── AdminAlumni.jsx
│   │       ├── AdminApprovals.jsx
│   │       ├── AdminBlog.jsx
│   │       ├── AdminBugReports.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminEvents.jsx
│   │       ├── AdminGallery.jsx
│   │       ├── AdminLogin.jsx
│   │       ├── AdminManage.jsx
│   │       ├── AdminProfile.jsx
│   │       └── AdminSubmissions.jsx
│   │
│   ├── services/                 # Supabase API integrations
│   │   ├── api.js
│   │   ├── supabase.js
│   │   └── uploadAvatar.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── supabase/
│   ├── functions/                # Supabase Edge Functions
│   │   ├── approve-alumni/
│   │   ├── create-admin/
│   │   ├── delete-alumni/
│   │   ├── list-admins/
│   │   ├── remove-admin/
│   │   └── upload-avatar/
│   └── migrations/
│       └── 20240101000000_init.sql
│
├── .env                          # Environment variables (not committed)
├── .env.example                  # Environment variable template
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Supabase project

### Installation

```bash
# Clone the repository
git clone https://github.com/goodnessemmanuel1/PETER-HARVARD-INT-L-SCHOOL-ALUMNI-PORTAL.git

# Navigate into the project
cd PETER-HARVARD-INT-L-SCHOOL-ALUMNI-PORTAL

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

# Start the development server
npm run dev
```

### Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🗄️ Supabase Edge Functions

The project uses the following deployed edge functions:

| Function | Purpose |
|---|---|
| `approve-alumni` | Approves a pending alumni registration |
| `create-admin` | Creates a new admin account |
| `delete-alumni` | Permanently removes an alumni record |
| `list-admins` | Returns all admin accounts |
| `remove-admin` | Revokes admin access |
| `upload-avatar` | Handles profile photo uploads to storage |

---

## 🔄 Development Roadmap

1. ✅ Project Architecture & Folder Structure
2. ✅ Authentication System (Login, Register, Forgot/Reset Password)
3. ✅ Alumni Registration & Profile
4. ✅ Admin Approval Workflow
5. ✅ Alumni Directory
6. ✅ Events Management
7. ✅ Blog (Posts + Individual Post Pages)
8. ✅ Gallery
9. ✅ Bug Report System
10. ✅ Dark Mode
11. 🔄 UI Polish & Responsiveness
12. 🔄 Supabase Edge Functions Integration

---

## 📊 Project Status

🟢 **Version 1 (MVP)** — In Active Development

---

## 👨‍💻 Team

| Name | Role |
|---|---|
| **Goodness Emmanuel** | Frontend Developer (React, Tailwind CSS, Context API) |
| **Anointed Agunloye** | Collaborator (Backend & Database Integration) |

---

## 📬 Contact

**Goodness Emmanuel** — Frontend Developer

- 🔗 LinkedIn: [linkedin.com/in/emmanuelgoodness](https://www.linkedin.com/in/emmanuelgoodness)
- 📧 Email: [emmanuelgoodnesscj@gmail.com](mailto:emmanuelgoodnesscj@gmail.com)

**Anointed Agunloye** — Backend Developer

- 📧 Email: [anointedthedeveloper@gmaill.com](mailto:anointedthedeveloper@gmaill.com)

---

<p align="center">Built with ❤️ for the Peter Harvard INT'L School community</p>