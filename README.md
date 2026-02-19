# React + TypeScript + Vite Project

This project is a React application set up with TypeScript and Vite.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Clean Install (if issues arise)

If you encounter issues with dependencies, try a clean install:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run format`: Formats code using Prettier.

## Code Quality

This project uses:
- **ESLint**: For identifying and reporting on patterns found in ECMAScript/JavaScript code.
- **Prettier**: For consistent code formatting.

## Deployment

This project is configured to deploy to **GitHub Pages** using GitHub Actions.

1. Go to your repository **Settings** > **Pages**.
2. Under "Build and deployment", set **Source** to **GitHub Actions**.
3. Push changes to the `main` branch to trigger the deployment automatically.
