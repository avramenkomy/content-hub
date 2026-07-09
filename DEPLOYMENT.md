# Deployment Guide

This document describes how to deploy Content Hub to a Linux VPS using Docker Compose, PostgreSQL, Nginx and SSL.

The project is designed to be portable and not tied to Vercel, Neon, Resend, Cloudinary or external OAuth providers.

## Production stack

The production deployment uses:

- Next.js application running in a Docker container
- PostgreSQL database running in a Docker container
- Prisma ORM
- Prisma migrations through `prisma migrate deploy`
- Docker Compose
- Nginx as a reverse proxy
- SSL certificate
- SMTP provider for contact form emails

## Files related to deployment

Important files:

```txt
Dockerfile
docker-compose.prod.yml
.env.production.example
DEPLOYMENT.md
```

Private file used on the server:

```txt
.env.production
```

The `.env.production` file must not be committed to Git.

## Local production-like test

Before deploying to a real VPS, test the production setup locally.

Create production env file:

```bash
cp .env.production.example .env.production
```

Start production-like containers:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Open:

```txt
http://localhost:3000
```

In another terminal, seed demo data:

```bash
docker compose -f docker-compose.prod.yml exec app pnpm exec prisma db seed
```

Demo accounts:

```txt
admin@example.com / password123
moderator@example.com / password123
user@example.com / password123
```

Stop containers:

```bash
docker compose -f docker-compose.prod.yml down
```

Stop containers and delete the local production-like database volume:

```bash
docker compose -f docker-compose.prod.yml down -v
```

Use `down -v` carefully because it removes database data.

## Environment variables

Production deployment uses `.env.production`.

Create it from example:

```bash
cp .env.production.example .env.production
```

Example:

```env
POSTGRES_USER=content_user
POSTGRES_PASSWORD=change_this_password
POSTGRES_DB=content_hub

DATABASE_URL=postgresql://content_user:change_this_password@db:5432/content_hub

NEXT_PUBLIC_SITE_URL=https://your-domain.com
AUTH_SECRET=replace-with-long-random-secret

SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASSWORD=

CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

Important notes:

- `DATABASE_URL` uses `db` as host because PostgreSQL runs inside Docker Compose.
- `NEXT_PUBLIC_SITE_URL` should use the real production domain.
- `AUTH_SECRET` should be a long random string.
- SMTP variables are required for real email sending.
- `.env.production` must stay private.

## VPS deployment steps

### 1. Connect to VPS

Connect to the server through SSH:

```bash
ssh root@YOUR_SERVER_IP
```

Example:

```bash
ssh root@123.123.123.123
```

### 2. Update server packages

```bash
apt update
apt upgrade -y
```

### 3. Install required packages

```bash
apt install -y git nginx certbot python3-certbot-nginx
```

The server also needs Docker and the Docker Compose plugin.

After installing Docker, check:

```bash
docker --version
docker compose version
```

### 4. Clone the project

Create application directory:

```bash
mkdir -p /var/www
cd /var/www
```

Clone repository:

```bash
git clone YOUR_REPOSITORY_URL content-hub
cd content-hub
```

Example:

```bash
git clone https://github.com/your-name/content-hub.git content-hub
cd content-hub
```

### 5. Create production env file

```bash
cp .env.production.example .env.production
nano .env.production
```

Update values:

```env
POSTGRES_USER=content_user
POSTGRES_PASSWORD=strong_database_password
POSTGRES_DB=content_hub

DATABASE_URL=postgresql://content_user:strong_database_password@db:5432/content_hub

NEXT_PUBLIC_SITE_URL=https://your-domain.com
AUTH_SECRET=very-long-random-secret

SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASSWORD=

CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

Important:

The password inside `DATABASE_URL` must match `POSTGRES_PASSWORD`.

For example:

```env
POSTGRES_PASSWORD=my_secure_password
DATABASE_URL=postgresql://content_user:my_secure_password@db:5432/content_hub
```

### 6. Start application

Build and start containers:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Check running containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

Check application logs:

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

Check database logs:

```bash
docker compose -f docker-compose.prod.yml logs -f db
```

### 7. Run seed data if needed

For demo deployment, create demo users and demo posts:

```bash
docker compose -f docker-compose.prod.yml exec app pnpm exec prisma db seed
```

Demo accounts:

```txt
admin@example.com / password123
moderator@example.com / password123
user@example.com / password123
```

Do not run seed on a real production database with real users unless you intentionally want to add demo data.

### 8. Check application by server IP

Before configuring domain and Nginx, check:

```txt
http://YOUR_SERVER_IP:3000
```

If the server firewall blocks port `3000`, this check may not work. In production, public access should go through Nginx on ports `80` and `443`.

## Nginx setup

### 1. Create Nginx config

Create config file:

```bash
nano /etc/nginx/sites-available/content-hub
```

Paste this config:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Replace:

```txt
your-domain.com
www.your-domain.com
```

with your real domain.

### 2. Enable Nginx config

```bash
ln -s /etc/nginx/sites-available/content-hub /etc/nginx/sites-enabled/content-hub
```

Check Nginx config:

```bash
nginx -t
```

Reload Nginx:

```bash
systemctl reload nginx
```

Now check:

```txt
http://your-domain.com
```

## SSL setup

After the domain points to the server IP and Nginx works, enable SSL:

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

After successful setup, check:

```txt
https://your-domain.com
```

## Updating deployment

When new code is pushed to GitHub, connect to the server and run:

```bash
cd /var/www/content-hub
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Check logs:

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

## Useful Docker commands

Start containers:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Start and rebuild containers:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Stop containers:

```bash
docker compose -f docker-compose.prod.yml down
```

Stop containers and remove database volume:

```bash
docker compose -f docker-compose.prod.yml down -v
```

Show app logs:

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

Show database logs:

```bash
docker compose -f docker-compose.prod.yml logs -f db
```

Restart app container:

```bash
docker compose -f docker-compose.prod.yml restart app
```

Open shell inside app container:

```bash
docker compose -f docker-compose.prod.yml exec app sh
```

Open PostgreSQL shell:

```bash
docker compose -f docker-compose.prod.yml exec db psql -U content_user -d content_hub
```

## Database backup

Create backup:

```bash
docker compose -f docker-compose.prod.yml exec db pg_dump -U content_user content_hub > backup.sql
```

Restore backup:

```bash
cat backup.sql | docker compose -f docker-compose.prod.yml exec -T db psql -U content_user content_hub
```

## Production checklist

Before publishing the project as a portfolio case study:

- [ ] `pnpm build` works locally
- [ ] Docker Compose production setup starts successfully
- [ ] `prisma migrate deploy` runs successfully
- [ ] Home page works
- [ ] Posts page works
- [ ] Login works
- [ ] Register works
- [ ] Dashboard is protected
- [ ] User can create posts
- [ ] Moderator can approve and reject posts
- [ ] Admin can manage users and roles
- [ ] Contact form saves messages to PostgreSQL
- [ ] SMTP email sending is configured
- [ ] Nginx reverse proxy works
- [ ] SSL certificate is active
- [ ] `NEXT_PUBLIC_SITE_URL` uses production domain
- [ ] `.env.production` is not committed
- [ ] Demo user passwords are changed or demo users are removed