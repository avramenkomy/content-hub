# Content Hub

Content Hub is a full-stack content platform built with Next.js, PostgreSQL and Prisma.

The project demonstrates a production-oriented web application with authentication, role-based access control, content moderation, contact form handling, email support and Docker-based deployment.

## Project goals

The goal of this project is to demonstrate both frontend and backend skills in one application:

- building a modern UI with Next.js and Tailwind CSS
- creating backend API routes
- working with PostgreSQL through Prisma ORM
- implementing custom email/password authentication
- protecting pages and API routes with server-side authorization
- managing user roles
- building a moderation workflow
- saving contact form messages to the database
- preparing the application for VPS deployment with Docker Compose

## Tech stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Custom authentication
- HTTP-only session cookies
- bcryptjs
- Nodemailer
- Docker
- Docker Compose
- Nginx-ready deployment

## Features

### Authentication

Users can register, log in and log out using email and password.

Passwords are hashed before being stored in the database. User sessions are stored in PostgreSQL and connected to HTTP-only cookies.

### Role-based access control

The application supports three roles:

- `USER`
- `MODERATOR`
- `ADMIN`

Access rules:

- guests can view public pages and contact form
- users can create, edit and delete their own posts
- moderators can review pending posts
- admins can manage users, roles and contact messages

### Content moderation

Users can submit posts for review.

Post statuses:

- `DRAFT`
- `PENDING`
- `APPROVED`
- `REJECTED`

Only approved posts are visible on the public posts page.

When a user edits an approved post, it is sent back to moderation.

### Admin dashboard

Admins can:

- view users
- change user roles
- view platform statistics
- open contact messages
- change contact message status

### Contact form

The contact form:

- validates input on the backend
- saves messages to PostgreSQL
- supports email sending through SMTP using Nodemailer

If SMTP is not configured, the message is still saved to the database.

### Deployment

The project is designed for VPS deployment using Docker Compose.

Production-oriented setup includes:

- Next.js application container
- PostgreSQL container
- Prisma migrations with `prisma migrate deploy`
- Nginx reverse proxy
- SSL certificate
- SMTP email provider

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions.

## Demo accounts

After running seed data, the following demo accounts are available:

```txt
admin@example.com / password123
moderator@example.com / password123
user@example.com / password123
```

## Pages

Public pages:

```txt
/
 /posts
/posts/[slug]
/contact
/login
/register
```

Protected pages:

```txt
/dashboard
/dashboard/posts
/dashboard/posts/new
/dashboard/posts/[id]/edit
/moderation
/admin
/admin/messages
```

API routes:

```txt
/api/auth/register
/api/auth/login
/api/auth/logout
/api/auth/me

/api/posts
/api/posts/[id]

/api/moderation/posts/[id]/approve
/api/moderation/posts/[id]/reject

/api/contact

/api/admin/messages/[id]/status
/api/admin/users/[id]/role
```

## Local development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment variables

Create `.env`:

```env
DATABASE_URL="postgresql://content_user:content_password@localhost:5432/content_hub"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"

AUTH_SECRET="replace-with-random-secret"
```

### 4. Run migrations

```bash
pnpm exec prisma migrate dev
```

### 5. Seed demo data

```bash
pnpm exec prisma db seed
```

### 6. Start development server

```bash
pnpm dev
```

Open:

```txt
http://localhost:3000
```

## Production-like Docker test

Create production env file:

```bash
cp .env.production.example .env.production
```

Start containers:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Seed demo data:

```bash
docker compose -f docker-compose.prod.yml exec app pnpm exec prisma db seed
```

Open:

```txt
http://localhost:3000
```

Stop containers:

```bash
docker compose -f docker-compose.prod.yml down
```

## Database models

Main models:

```txt
User
Session
Post
ContactMessage
```

Enums:

```txt
Role
PostStatus
ContactMessageStatus
```

## Project structure

```txt
src/
├── app/
│   ├── admin/
│   ├── api/
│   ├── contact/
│   ├── dashboard/
│   ├── login/
│   ├── moderation/
│   ├── posts/
│   ├── register/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── admin/
│   ├── auth/
│   ├── contact/
│   ├── layout/
│   ├── posts/
│   └── ui/
│
├── data/
│   ├── navigation.ts
│   ├── postImages.ts
│   └── site.ts
│
├── generated/
│   └── prisma/
│
└── lib/
    ├── auth.ts
    ├── cn.ts
    ├── mail.ts
    ├── prisma.ts
    ├── slug.ts
    └── validation.ts
```

## Security notes

Implemented security-related decisions:

- passwords are hashed with bcryptjs
- sessions are stored server-side
- session cookie is HTTP-only
- protected pages check current user on the server
- protected API routes verify authentication and authorization
- users can edit and delete only their own posts
- admins cannot change their own role from the admin panel
- contact form data is validated on the backend

## Current limitations

The project currently uses predefined demo images for posts.

Planned improvements:

- real image upload
- S3-compatible object storage
- better rich text editing
- pagination
- search and filtering
- improved accessibility audit
- production email configuration
- screenshots for README
- final deployment to VPS

## License

This project is created as a portfolio full-stack application.