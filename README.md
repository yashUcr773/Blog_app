# QuickPost
Demo - [quickpost.dev/](https://www.quickpost.dev/)

Test Account
- Email - demouser@mailsac.com
- Password - Demo@user_1

## Functionality

QuickPost is a blog application with the following features:

- User authentication with JWT (JSON Web Tokens)
- Sign-in and sign-up functionality
- Create, edit, and view blogs
- View user profiles
- View blogs of a specific user
- Update user information

## Tech Stack

### Frontend:
- React
- Recoil
- Tailwind CSS
- Rick text editor using react-quill
- Hosted on Vercel: [quickpost.dev](https://quickpost.dev)

### Backend:
- Cloudflare Workers
- Hono
- Prisma ORM
- PostgreSQL
- Data validation using zod
- Hosted on Cloudflare: [server.quickpost.dev](https://server.quickpost.dev)

### File Uploader:
- Node.js with Express
- AWS and Multer
- Hosted on Vercel: [uploader.quickpost.dev](https://uploader.quickpost.dev)

## Running Locally

To run the application locally, follow these steps:

1. Clone the repository.
2. Navigate to the cloned repository.
3. Install dependencies for every workspace:
    ```
    npm run install:all
    ```
4. Create local environment files:
    ```
    cp client/.env.example client/.env
    cp server/.dev.vars.example server/.dev.vars
    cp fileuploader/.env.example fileuploader/.env
    ```
5. Fill in the database and AWS values in those files.
6. Run the client, server, and file uploader together:
    ```
    npm run dev
    ```

The client runs on `localhost:5173`, the Cloudflare Worker runs on `localhost:8787`, and the file uploader runs on `localhost:3000`.

## Environment Variables

Ensure the following environment variables are set:

- For Prisma (`.env`) in server:
  - `DATABASE_URL`
  - `DIRECT_URL`

- For `.env` in `fileuploader`:
    - `AWS_ACCESS_KEY_ID`
    - `AWS_ACCESS_SECRET`
    - `AWS_REGION`
    - `AWS_BUCKET`
    - `ACCESS_TOKEN_SECRET` - same value as in server
    - `ENV`

- For the server (`.dev.vars`):
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `ACCESS_TOKEN_SECRET` - same value as in fileuploader
  - `REFRESH_TOKEN_SECRET`
  - `FILE_UPLOADER_URL`
  - `ENV`

For `wrangler.toml`:
- `ACCESS_TOKEN_EXPIRY=86400`
- `REFRESH_TOKEN_EXPIRY=604800`

You can generate a secure access token using `require('crypto').randomBytes(64).toString('hex')` in any Node environment.

## Planned Functionality

Planned enhancements include:

- Adding comments to blogs
- Incorporating update history for blogs

### Steps / Important Commands for Prisma

Follow these steps to integrate Prisma:

1. Create the app with Hono:
    ```
    npm create hono@latest
    ```

2. Add Prisma:
    ```
    npm install --save-dev prisma
    npx prisma init
    npm install @prisma/client@latest @prisma/extension-accelerate
    npx prisma generate --no-engine
    ```

3. Add database URLs (`DATABASE_URL` and `DIRECT_URL`) in `.env`, `.dev.env`, and `schema.prisma`.

4. Add `.env` and `.dev.env` to `.gitignore`.

5. Add schema and migrate:
    ```
    npx prisma migrate dev --name init
    ```

6. Add code and deploy:
    ```
    npm run deploy
    ```

7. Login to Cloudflare:
    ```
    npx wrangler login
    ```
