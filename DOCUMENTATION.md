# Jikesh Portfolio - Project Documentation

## Project Overview
This is a modern, responsive portfolio website built for **Jikesh**. It showcases his skills as a Computer Science student, full-stack developer, and visual media producer.

## Technology Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: 
  - [React 19](https://react.dev/)
  - [Tailwind CSS 4](https://tailwindcss.com/) (using PostCSS)
  - [Framer Motion](https://www.framer.com/motion/) (for animations)
- **Deployment & Backend**:
  - [Netlify](https://www.netlify.com/)
  - [Netlify Blobs](https://docs.netlify.com/products/blobs/) (for persistent message storage in production)

## Project Structure
```text
/
├── app/                # Next.js App Router (Pages & API)
│   ├── admin/          # Admin Dashboard
│   ├── api/            # Backend API Endpoints (Auth, Messages, Products, Projects)
│   ├── contact/        # Contact Page
│   ├── projects/       # Projects Showcase
│   ├── store/          # Store/Products Page
│   └── layout.tsx      # Main layout wrapper
├── components/         # Reusable React components (Navigation, Footer, etc.)
├── data/               # Local JSON "databases" (projects, products, messages)
├── public/             # Static assets (images, icons)
├── .env                # Environment variables (Admin credentials)
├── package.json        # Dependencies and scripts
└── next.config.ts      # Next.js configuration
```

## Key Features
1. **Hero Section**: Dynamic introduction with profile background and interactive "Show Projects" / "Get in Touch" buttons.
2. **Projects Showcase**: Dynamically loaded from `data/projects.json`.
3. **Store Front**: A mock store displaying products loaded from `data/products.json`.
4. **Contact Form**: Functional form that allows users to send messages.
5. **Admin Dashboard**: 
   - Protected by simple session-based authentication.
   - Allows management of products (Add/Edit/Delete).
   - Allows viewing and deleting received messages.

## Data Storage Strategy
The project uses a hybrid approach for data persistence:
- **Projects & Products**: Stored in local JSON files within the `data/` directory. Updates are written directly to these files.
- **Messages**: 
  - **Production**: Uses **Netlify Blobs** for high-performance, persistent storage on Netlify.
  - **Development**: Falls back to `data/messages.json` for local testing.

## Getting Started

### Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env`:
   ```env
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_password
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:301`.

### Production Deployment
The project is optimized for Netlify. Simply connect your repository to Netlify and ensure the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables are set in the Netlify UI. Netlify Blobs will be automatically initialized for the contact form messages.

## Admin Access
To access the admin panel, navigate to `/admin` and log in with the credentials defined in your environment variables.
