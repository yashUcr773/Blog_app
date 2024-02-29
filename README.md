# Blog App

## Functionality

## Tech Stack

### Frontend:

### Backend:

## Running Locally


## Environment Variables


## Attribution


## Planned Functionality


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


