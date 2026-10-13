This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Authentication environment

Set a stable `NEXTAUTH_SECRET` in `.env.local` before signing in. Generate one
with `openssl rand -base64 32`; do not commit the generated secret. Use the same
secret in every app instance and deployment, and update the deployment's
environment variables when changing it. Changing the secret invalidates
existing login cookies, so sign in again after a change.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Team Members

- Daniel Israel Tudela Pacheco
- Derek Abraham Moscui Maldonado
- Helama Yamashita Barbour
- Ivan Nivaldo Sanhueza Antris

## Project Description

Math Learning Path is a web application designed to help students develop mathematics skills through structured learning activities and practice exercises. Teachers can create and organize activities, assign exercises to students, and monitor their learning progress. Students have their own interface where they can complete assigned activities and track their progress.

## Project Architecture and Governance

### Constitution

- Description: Defines the fundamental principles, style guidelines, and non-negotiable technical constraints that guide the development of this project. It serves as the single source of truth for maintaining consistency in the architecture and code quality.

[`\.specify\memory\constitution.md`](https://github.com/derek20-02/Math-Learning-Path/blob/main/.specify/memory/constitution.md)

### Project Specification

- Description: A technical specification document that details the “what” and “why” of the features. It contains the scope, user stories, and acceptance criteria necessary to implement new capabilities using the Spec-Driven Development approach.

[`\specs\001-math-learning-path\spec.md`](https://github.com/derek20-02/Math-Learning-Path/blob/main/specs/001-math-learning-path/spec.md)

## 🛠️ Architecture & Tech Stack

This project is built using:

- **Framework:** Next.js (App Router) with React.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS v4 & PostCSS.
- **Database & ODM:** MongoDB (`mongodb` driver + `mongoose` ODM with optimized serverless caching).
- **Authentication:** NextAuth.js (`next-auth`) utilizing `CredentialsProvider`, `bcryptjs` hashing, and JWT callbacks for role-based session management (teacher / student).
- **Validation:** Zod schemas.
- **Testing:** Jest, React Testing Library, and Playwright.

---

### 📐 Governance & Specifications

- **Constitution:** Guidelines, architectural principles, and styling standards are defined in `.specify/memory/constitution.md`.
- **Technical Spec:** Functional scope and user stories are located in `specs/001-math-learning-path/spec.md`.

---

### 📌 Known Issues & Future Opportunities

#### Known Issues

- **Language Consistency:** Activities and content were initially created in Spanish due to localization focus during early sprints; migration to full English support is pending.
- **Mobile Responsiveness:** Complex mathematical equation input views can occasionally require horizontal scrolling on smaller screens (< 360px).
- **Initial Hydration:** Initial token hydration on slower mobile networks can display a brief loading state before rendering role-specific dashboards.

#### Future Opportunities

- **Localization / English Migration:** Standardize all seed data, database records, and UI components into English to match project documentation standards.
- **Instant Automated Feedback:** Add real-time validation and step-by-step mathematical hints for students while solving exercises.
- **Advanced Analytics & Reports:** Implement visual progress graphs and detailed performance analytics for teachers to monitor student growth over time.

## Deploy on Vercel

https://math-learning-path.vercel.app/

## Project Tracking with Github Projects

https://github.com/users/derek20-02/projects/1/views/1
