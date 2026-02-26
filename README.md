# LMS Frontend - React Application

A complete frontend application for the Learning Management System, built with React 18, Material-UI, Redux Toolkit with RTK Query, and React Router.

## Technology Stack

- **Framework**: React 18 with Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **API Integration**: RTK Query
- **Routing**: React Router v6
- **Authentication**: JWT (stored in localStorage)
- **Form Handling**: React Hook Form + Yup validation
- **Language**: TypeScript

## Prerequisites

- Node.js 18+
- npm 9+
- Backend API running (see [lms backend](https://github.com/iamavishkar/lms))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/iamavishkar/lms-app.git
cd lms-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=LMS - Learning Management System
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### 5. Build for production

```bash
npm run build
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── main.tsx                    # Application entry point
├── App.tsx                     # Root component with routing
├── vite-env.d.ts               # Vite env type definitions
├── app/
│   ├── store.ts                # Redux store configuration
│   └── api/
│       └── apiSlice.ts         # RTK Query base API
├── features/
│   ├── auth/                   # Authentication (login, register, JWT)
│   ├── dashboard/              # Role-based dashboards
│   ├── users/                  # User management CRUD
│   ├── roles/                  # Role management CRUD
│   ├── students/               # Student management CRUD
│   ├── teachers/               # Teacher management CRUD
│   ├── parents/                # Parent management CRUD
│   ├── classes/                # Class management CRUD
│   ├── subjects/               # Subject management CRUD
│   ├── attendance/             # Attendance tracking
│   ├── exams/                  # Exam management CRUD
│   ├── results/                # Result management CRUD
│   └── files/                  # File upload
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx # Main layout with sidebar
│   └── common/                 # Reusable components
├── hooks/
│   ├── useAuth.ts              # Authentication hook
│   └── usePermissions.ts       # Permission/role hook
├── utils/
│   ├── constants.ts            # App-wide constants
│   └── helpers.ts              # Utility functions
├── types/
│   └── index.ts                # TypeScript interfaces
└── theme/
    └── theme.ts                # MUI theme customization
```

## Features

### Authentication
- JWT-based authentication
- Persistent login (token stored in localStorage)
- Protected routes
- Role-based access control

### Role-Based Dashboards
- **Admin**: Full system overview with stats
- **Teacher**: Classes, attendance, exams overview
- **Student**: Personal attendance, exams, results
- **Parent**: Children's progress overview

### Modules

| Module | Features |
|--------|----------|
| Users | List, create, view, edit, delete users |
| Roles | List, create, edit, delete roles |
| Students | Full CRUD with class assignment, attendance & results links |
| Teachers | Full CRUD with qualification details |
| Parents | Full CRUD with student links |
| Classes | Full CRUD with teacher assignment and student roster |
| Subjects | Full CRUD with code and description |
| Attendance | Mark attendance by class, view reports, filter |
| Exams | Full CRUD with type, date, class and subject |
| Results | Full CRUD with grade calculation |
| Files | Drag-and-drop file upload with progress |

## Backend API Integration

The app integrates with the NestJS backend at `https://github.com/iamavishkar/lms`.

All API calls are made via RTK Query with:
- Automatic JWT token injection in headers
- Cache management and invalidation
- Loading and error states

### Key Endpoints Used

- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user
- `GET|POST|PUT|DELETE /api/users`
- `GET|POST|PUT|DELETE /api/roles`
- `GET|POST|PUT|DELETE /api/students`
- `GET|POST|PUT|DELETE /api/teachers`
- `GET|POST|PUT|DELETE /api/parents`
- `GET|POST|PUT|DELETE /api/classes`
- `GET|POST|PUT|DELETE /api/subjects`
- `GET|POST|PUT|DELETE /api/attendance`
- `POST /api/attendance/mark`
- `GET|POST|PUT|DELETE /api/exams`
- `GET|POST|PUT|DELETE /api/results`
- `POST /api/files/upload`
- `GET /api/dashboard/stats`

## Deployment

```bash
npm run build
```

The `dist/` folder contains the production build ready for deployment to any static hosting service (Netlify, Vercel, AWS S3, etc.).

### Environment Variables for Production

Set `VITE_API_BASE_URL` to your production backend URL before building.
