# Blog App

## Functionality
Auth with JWT
Signin
Signup
Create BLog
Edit BLog
View Blog

## Tech Stack

### Frontend:
React,
Recoil
Tailwind

### Backend:
Prisma
Cloudflare workers
Hono
Postgres

## Running Locally


## Environment Variables

.env for prisma
DATABASE_URL
DIRECT_URL
.dev.vars for server
DATABASE_URL
DIRECT_URL
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
wrangler.toml
ACCESS_TOKEN_EXPIRY=86400
REFRESH_TOKEN_EXPIRY=604800

## Attribution
https://www.youtube.com/watch?v=xKs2IZZya7c&t=6s
https://github.com/dejwid/mern-blog

## Planned Functionality
Add comments to blogs

### Steps followed
- Create App
    - `npm create hono@latest`
    - Add routes and routers
- Add prisma
    - `npm install --save-dev prisma`
    - `npx prisma init`
    - `npm install @prisma/client@latest @prisma/extension-accelerate`
    - `npx prisma generate --no-engine`
    - Add `DATABASE_URL` and `DIRECT_URL` in `.env` and `.dev.env` and `schema.prisma`
    - Add `.env` and `.dev.env` to gitignore
    - Add Schema
    - npx prisma migrate dev --name init
- Add Code
- Login to Cloudflare
    - npx wrangler login
- Deploy
    - npm run deploy


