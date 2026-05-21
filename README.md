# RecruitAI — Frontend Client

The frontend client of **RecruitAI**, an AI-powered recruitment management system built with React, Vite, Tailwind CSS v4, and modern state-management libraries.

---

## 🚀 Tech Stack & Libraries

The client application utilizes a modern frontend stack designed for speed, type safety, and scalability:

*   **Build Tool**: [Vite](https://vite.dev/) (fast ESM-based bundling with Hot Module Replacement).
*   **UI Library**: [React 19](https://react.dev/) (utilizing lazy loading, Suspense, and the new JSX transforms).
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@import "tailwindcss"` and the new CSS-based `@theme` directives).
*   **Routing**: [React Router v7](https://reactrouter.com/) (configured with a central route manager, protected layouts, and dynamic lazy-loaded page modules).
*   **Data Fetching & Cache**: [TanStack Query v5](https://tanstack.com/query/latest) (handling caching, automatic refetching, and state synchronization with the backend).
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (a lightweight, hooks-based global state manager).
*   **Form Handling**: [React Hook Form](https://react-hook-form.com/) (highly performant form validation).

---

## ⚙️ Initial Configuration Settings

Several custom configurations have been integrated into the initial settings to improve the developer experience:

### 1. Absolute Path Alias (`@/`)
You can use `@/` to import files from the `src/` directory directly, avoiding complex relative paths (e.g. `../../components/Button` becomes `@/components/Button`).
*   **Configured in**: `vite.config.js` under the `resolve.alias` property.

### 2. Modern Router Setup
*   **Protected Routes**: The main routes are wrapped inside a `<ProtectedLayout />` component that checks for an authentication token in `localStorage`. If absent, users are redirected to `/login`.
*   **Lazy Loading**: Pages are dynamically imported using `React.lazy()` to reduce initial bundle size and speed up page loading.
*   **HMR Support**: All route config files are configured with ESLint overrides (`/* eslint-disable react-refresh/only-export-components */`) to support React Fast Refresh without developer warnings.

### 3. Design System & Brand Palette (Tailwind CSS v4)
Custom colors (like `brand-light`, `brand`, and `brand-dark`) are declared directly in CSS rather than JSON config files.
*   **File location**: `src/index.css`
*   **Usage**:
    ```css
    @theme {
      --color-brand-light: #3b82f6;
      --color-brand: #1d4ed8;
      --color-brand-dark: #1e3a8a;
    }
    ```
    You can now use classes like `bg-brand`, `text-brand-light`, or `border-brand-dark` in your HTML/JSX components.

---

## 📂 Project Structure

```text
client/
├── public/                 # Static assets (favicons, logos, etc.)
├── src/
│   ├── assets/             # Images, global media resources
│   ├── components/         # Global shared reusable components (Buttons, Inputs, Modals)
│   ├── config/             # Third-party configurations (axios instances, API endpoints)
│   ├── features/           # Feature-based logic modules (jobs, applications, kanban pipeline)
│   ├── hooks/              # Custom reusable React hooks
│   ├── pages/              # Page level components (Dashboard, Login, JobsManagement)
│   ├── routes/             # App routing setup (appRoutes, authRoutes, router config)
│   ├── store/              # Global state management stores (Zustand)
│   ├── utils/              # Helper utility functions
│   ├── App.css             # Global utility styles
│   ├── App.jsx             # Main Application root component (QueryProvider & RouterProvider)
│   ├── index.css           # Tailwind CSS imports & theme overrides
│   └── main.jsx            # React root mount script
├── .env                    # Environment variables (Vite-specific prefix: VITE_)
├── .gitignore              # Files excluded from git tracking
├── eslint.config.js        # ESLint configuration rules
├── package.json            # Scripts and dependencies definitions
└── vite.config.js          # Vite configurations (plugins, resolve aliases)
```

---

## 💻 Getting Started

### 1. Installation
Install project dependencies using your package manager of choice:
```bash
npm install
```

### 2. Development Server
Run the local development server:
```bash
npm run dev
```

### 3. Production Build
Compile and optimize the project for production:
```bash
npm run build
```

### 4. Linter Check
Run code style and syntax checks:
```bash
npm run lint
```
