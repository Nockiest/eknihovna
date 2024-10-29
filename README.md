
##App is available on this domain:## eknihovna.vercel.app

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
##  Architecture
Frontend: React, NextJs
Backend: NextjsAPI, Prisma
Styling: Tailwind, MUI library
Database: PSQL
Authentication: NextAUth

## Purpose of project
The goal is to increase the utilization of our school library. Many students do not even know what books are available. Gettting important information like this from the library requires physical contact with a school librarian, who is not always present to consult. The app solves this problem by providing an up to date information, which even a non-tech savvy school employee can easily maintain.

## Target Audience
The app is intended to be used by the students of Grammar School Opatov

## Features
Find availability of books in library
FInd books you can use for your maturita exams
Find general information about the school library
Easy updating of the book state through the admin page

## Code structure
/components - general components that could be used independently throughout the app
/features - specific funcionality dependent on some other code
/app/api - contains the backend of the app
/app - contains the individual components
/utils - provides code that coudl be used in other projects


## Env variables
NEXTAUTH_SECRET - for auth
GOOGLE_CLIENT_ID - for auth
GOOGLE_CLIENT_SECRET - for auth
GITHUB_ID - for auth
GITHUB_SECRET - for auth
DATABASE_URL - for database connection
NEXT_PUBLIC_WHITE_LIST_EMAILS - emails that have acess to the admin page seperated by ":"
NEXT_PUBLIC_APP_API_URL - url of the backend/api to make calls to

## how to run

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

set up your own psql db and connect to it

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

In order for this version to work properly, it is necessary to start up the server side, which will be added into its own branch promptly
