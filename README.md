# Interview Feedback System API

This is a backend API server for a system that enables students applying for internships at Swisscom to provide feedback following an interview. It was built as part of a coding assignment, with **Express**, **TypeScript**, **Prisma**, and **SQLite**.

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/saandreev1/swisscom-assignment-backend.git
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the root of the project and add the following:

```env
JWT_SECRET=your_jwt_secret_here

EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password

FEEDBACK_URL_BASE=http://your-client-app-base-url
```

The client app from the repository on https://github.com/saandreev1/swisscom-assignment-frontend runs on `http://localhost:5173`.

---

### Generate Prisma Client

```bash
npx prisma generate
```

---

### Create the Database

If the `dev.db` SQLite database file does not exist (e.g. on first clone), create it and apply all schema migrations with:

```bash
npx prisma migrate deploy
```

---

### Start the development server

```bash
npm run dev
```

Visit `http://localhost:4000` to verify the server is running.

---

## API Documentation

The project uses Swagger UI to provide live API docs.

Visit:

```
http://localhost:4000/api-docs
```

---

## Default Admin Initialization

On first run (when no admin exists), the server will automatically create:

- A default admin user with predefined credentials.
- 3 default questions (TEXT, RATING, MULTIPLE_CHOICE).
- 1 form linked to all 3 questions.
- 1 form linked to only the TEXT question.

---

## Docker

To run the project in a container:

1. Build and start the container:

```bash
docker compose up --build
```

2. The API will be available at:

```
http://localhost:4000
```

You can stop the container with:

```bash
docker compose down
```

---

## Tech Stack

- **Node.js** / **Express**
- **TypeScript**
- **Prisma ORM**
- **SQLite**
- **JWT** (JSON Web Token)
- **SMTP** (in this case, Mailtrap for testing emails)