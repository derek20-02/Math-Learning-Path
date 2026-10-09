This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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
- Ivan Nivaldo Sanhueza AntrisIvan Nivaldo Sanhueza Antris

## Project Description

Math Learning Path is a web application designed to help students develop mathematics skills through structured learning activities and practice exercises. Teachers can create and organize activities, assign exercises to students, and monitor their learning progress. Students have their own interface where they can complete assigned activities and track their progress.

## Project Architecture and Governance

### Constitution

- Description: Defines the fundamental principles, style guidelines, and non-negotiable technical constraints that guide the development of this project. It serves as the single source of truth for maintaining consistency in the architecture and code quality.

`\.specify\memory\constitution.md`

### Project Specification

- Description: A technical specification document that details the “what” and “why” of the features. It contains the scope, user stories, and acceptance criteria necessary to implement new capabilities using the Spec-Driven Development approach.

`[\specs\001-math-learning-path\spec.md]`

## Deploy on Vercel

https://math-learning-path.vercel.app/

## Project Tracking with Github Projects

https://github.com/users/derek20-02/projects/1/views/1

## Environment Variables Setup

To run this application locally, you need to configure your environment variables:

1. Duplicate `.env.example` and rename it to `.env.local`:
   ```bash
   cp .env.example .env.local