# JWT Authentication System with Next.js

A secure JWT-based authentication system built with Next.js 15, Prisma, and shadcn/ui components.

## Features

- 🔐 Secure JWT-based authentication
- 👤 User registration and login
- 🎨 Dark/Light mode support
- 📱 Responsive design
- 🛡️ Protected routes
- 👑 Role-based access control (Admin/User)
- 📝 Profile management
- 🏠 Address management system
- 🎯 Clean and modern UI with shadcn/ui
- 🔄 Server-side rendering with Next.js 13+ App Router

## Tech Stack

- **Framework:** Next.js 15
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (jose)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Forms:** React Hook Form with Zod validation
- **State Management:** React Context
- **Icons:** Lucide Icons
- **Theme:** next-themes

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm/npm/yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/subedi-samrat/jwt-auth-system-nextjs.git
cd jwt-auth-system-nextjs
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```env
DATABASE_URL=postgres://user:password@localhost:5432/your_database_name
JWT_SECRET=your_secure_random_string
```

5. Initialize the database:
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

6. Seed the database (optional):
```bash
pnpm prisma:seed
```

## Running the Application

```bash
# Development server
pnpm dev

# Production build
pnpm build
pnpm start
```

## Available Scripts

- `dev`: Start development server
- `build`: Build production application
- `start`: Start production server
- `lint`: Run ESLint
- `prisma:generate`: Generate Prisma client
- `prisma:studio`: Open Prisma Studio
- `prisma:migrate`: Run database migrations
- `prisma:push`: Push schema changes to database
- `prisma:seed`: Seed the database
- `db:reset`: Reset database (caution: deletes all data)
- `db:deploy`: Deploy database migrations

## Project Structure

```
auth-system/
├─ app/                   # Next.js 13+ App Router
│  ├─ admin/             # Admin dashboard
│  ├─ api/               # API routes
│  ├─ auth/              # Authentication pages
│  ├─ dashboard/         # User dashboard
│  └─ profile/           # User profile management
├─ components/           # React components
│  ├─ ui/               # shadcn/ui components
│  └─ ...               # Custom components
├─ context/             # React Context providers
├─ hooks/               # Custom React hooks
├─ lib/                 # Utility functions
└─ prisma/              # Database schema and migrations
```

## Authentication Flow

- JWT-based authentication using `jose`
- Protected API routes and pages
- Automatic token refresh
- Secure password hashing with bcrypt
- Role-based authorization

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

MIT License - feel free to use this project for your own learning and development.

## Author

GitHub : [Samrat Subedi](https://github.com/subedi-samrat)
LinkedIn : [Samrat Subedi](https://www.linkedin.com/in/samrat-subedi)
---

Made with ❤️ using Next.js and shadcn/ui