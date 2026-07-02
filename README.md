# Team Creator Utility Web App

A lightweight utility web application built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Mongoose (MongoDB Atlas) to group students into 3-member teams across three distinct academic clusters.

## Features

- **Single-Page Interface**: Clean, minimal, and fully interactive form for team creation.
- **Auto-Filtering Dropdowns**: Student dropdowns for Cluster 1, 2, and 3 only show students who are not yet assigned to any team.
- **Dynamic Updates**: Once a team is created or deleted, the dropdown choices automatically refresh.
- **Database Seeding**: Simple seed script to quickly populate the database with 72 mock students distributed across the three clusters.

## Folder Structure

```text
app/
    page.tsx
    globals.css
    layout.tsx
    api/
        students/
            route.ts
        teams/
            route.ts

lib/
    mongodb.ts
    models.ts
    seed.ts

.env.local
package.json
tsconfig.json
```

---

## Setup Instructions

### 1. Install Dependencies

Install the node modules:

```bash
npm install
```

### 2. Configure Environment Variables

Create or open `.env.local` at the root of the project and set your `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/teamcreator?retryWrites=true&w=majority
```

*(You can use a local connection URI like `mongodb://127.0.0.1:27017/team-creator` if you have MongoDB running locally).*

### 3. Seed the Database

Run the database seed script to populate the `students` collection with approximately 70 students (72 total, 24 in each of the 3 clusters) and clear out any existing teams:

```bash
npm run seed
```

---

## Running the Application

### Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

To verify that the application compiles without error:

```bash
npm run build
```

---

## Deployment on Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com) and import the project.
3. In the project settings, add the Environment Variable:
   - Key: `MONGODB_URI`
   - Value: `<your-mongodb-atlas-connection-uri>`
4. Click **Deploy**. The project requires no build configuration modifications.
