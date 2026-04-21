# eKnihovna Project

Welcome to the eKnihovna project! This README is designed to help you get started with the project, even if you have never worked with it before. Follow the steps below to set up the project and understand its structure.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Key Features](#key-features)
6. [Contributing](#contributing)
7. [Contact](#contact)

---

## Project Overview
The eKnihovna project is a web-based application designed to manage and interact with a library of books. It includes features such as:
- Book catalog management
- User authentication
- Book borrowing and returning
- Data visualization and reporting

This project is built using modern web development technologies and follows best practices for scalability and maintainability.

---

## Technologies Used
- **Framework**: Next.js (React-based framework for server-side rendering and static site generation)
- **Styling**: Tailwind CSS
- **Database**: Prisma (ORM) with PostgreSQL
- **API**: RESTful APIs for backend communication
- **Other Tools**: TypeScript, PostCSS

---

## Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- Node.js (v16 or higher)
- npm or yarn (for package management)
- PostgreSQL (for the database)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Nockiest/eknihovna.git
   cd eknihovna
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a `.env` file in the root directory and configure your database connection:
     ```env
     DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
     ```
   - Run the Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## Project Structure
The project is organized as follows:

```
.
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── katalog/       # where the user scrolls boooks
│   ├── info/          # Info about the library and web for users pages
│   ├── upload/        # For Admin/library administrator
│   └── styling/       # Global styles
├── components/         # Reusable React components
├── data/               # Static data and constants
├── lib/                # Utility libraries (e.g., Prisma client)
├── middleware/         # Middleware functions
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets (images, icons, etc.)
├── theme/              # Theme-related utilities
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── ...
```

---

## Key Features
- **Book Catalog**: Browse and manage the library's book collection.
- **User Authentication**: Secure login and session management.
- **Data Import/Export**: Upload and download book data in Excel format.
- **Customizable Themes**: Modify the app's appearance using the `theme/` directory.

---

## Contributing
We welcome contributions to the eKnihovna project! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

---

## Contact
If you have any questions or need help, feel free to reach out:
- **Email**: ondralukes06@seznam.cz
- **GitHub Issues**: Open an issue in the repository

---

Thank you for contributing to the eKnihovna project!