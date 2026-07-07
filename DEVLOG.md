# Content Hub — Development Log

## Project idea

Content Hub is a full-stack web application built with Next.js.

The goal is to demonstrate frontend and backend skills in one production-ready project:

- authentication
- authorization
- role-based access control
- user dashboard
- moderation workflow
- contact form with email sending
- database integration
- image usage
- Docker-based deployment
- deployment to a VPS

## Deployment strategy

The project is designed to be portable and not tied to Vercel, Neon, Resend, Cloudinary or external OAuth providers.

Production deployment should support:

- Node.js or Docker runtime
- PostgreSQL database
- SMTP email provider
- S3-compatible object storage
- environment variables
- Nginx reverse proxy
- SSL certificate

## Planned stack

- Next.js App Router
- TypeScript in beginner-friendly mode
- Tailwind CSS
- PostgreSQL
- Prisma
- Custom email/password authentication
- Role-based access control
- Nodemailer
- Docker
- REG.RU VPS
