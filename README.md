# Interview Feedback System API

This is a backend API for managing feedback forms, interview evaluations, and reviewer interactions. Built with **Express**, **TypeScript**, **Prisma**, and **SQLite** (for development).

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the root of the project and add the following:

```env
JWT_SECRET=super-secret-key

# Mailtrap SMTP credentials (for dev email testing)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=6189cef5d3bc7c
EMAIL_PASS=5fd302b07444d7

# Base URL used in feedback request links
FEEDBACK_URL_BASE=http://localhost:5173
```

> Do not commit `.env` to version control. Use `.gitignore` to exclude it.

---

### Generate Prisma Client

```bash
npx prisma generate
```

(Optional: If using migrations)

```bash
npx prisma migrate dev --name init
```

---

### Start the development server

```bash
npm run dev
```

Visit `http://localhost:4000` to verify the server is running.

---

## 📬 API Documentation

The project uses Swagger UI to provide live API docs.

Visit:

```
http://localhost:4000/api-docs
```

---

## 🧪 Default Admin Initialization

On first run (when no admin exists), the server will automatically create:

- **Email:** `admin@swisscom.com`
- **Password:** `secret123`

It will also create:

- 3 default questions (TEXT, RATING, MULTIPLE_CHOICE)
- 1 form linked to all 3 questions
- 1 form linked to only the TEXT question

---

## 📦 Tech Stack

- **Node.js** / **Express**
- **TypeScript**
- **Prisma ORM**
- **SQLite** (dev only)
- **JWT** (JSON Web Token)
- **Mailtrap** (SMTP testing)

---

## 📁 Project Structure

```
├── prisma/              # Prisma schema and migrations
├── src/                 # Source code
│   ├── routes/          # Express route files
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, role-checking, etc.
│   └── utils/           # Swagger config, admin init
├── .env                 # Environment variables (not committed)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠 Environment Variables

| Variable           | Description                                 |
|--------------------|---------------------------------------------|
| `JWT_SECRET`       | Secret key for JWT signing                  |
| `EMAIL_HOST`       | SMTP host (e.g., Mailtrap)                  |
| `EMAIL_PORT`       | SMTP port                                   |
| `EMAIL_USER`       | SMTP user name                              |
| `EMAIL_PASS`       | SMTP password                               |
| `FEEDBACK_URL_BASE`| URL used in email links to access feedback  |