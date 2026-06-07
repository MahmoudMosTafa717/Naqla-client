<div align="center">
  <h1>🎨 RecruitAI - Frontend Client Application</h1>
  <p><strong>A Blazing-Fast, AI-Powered UI for Modern Talent Acquisition</strong></p>
</div>

> [!NOTE]
> **This is the Frontend (Client) side of the RecruitAI full-stack application.**
> - 🎨 **Frontend Repository:** [RecruitAIApp/client](https://github.com/RecruitAIApp/client)
> - 🖥️ **Backend Repository:** [RecruitAIApp/server](https://github.com/RecruitAIApp/server)

---

## 🌟 The Core Idea: What is the RecruitAI Client?

The frontend of **RecruitAI** is designed to provide a frictionless, highly interactive experience for two distinct user bases: **Candidates** and **Recruiters**.

For **Recruiters**, it acts as a high-performance command center. Instead of wading through endless spreadsheets and clunky interfaces, recruiters are presented with beautifully visualized AI metrics, real-time analytics, and a drag-and-drop Kanban board to manage candidates effortlessly. 

For **Candidates**, it offers a clean, intuitive portal to upload their CVs, receive real-time updates on their application status via WebSockets, and get intelligent job recommendations based on their profiles.

---

## 🚀 Key Features & Implementation Details

Here is a deep dive into the core features of our frontend architecture and the cutting-edge technologies that power them.

### 1. 📋 Drag-and-Drop Applicant Kanban Board
Managing application stages (Applied ➔ Shortlisted ➔ Interview ➔ Hired) should be as easy as moving a sticky note.
- **How it works:** Recruiters drag candidate cards across columns. Dropping a card triggers an optimistic UI update and an API call to the backend, which subsequently fires off automated emails to the candidate.
- **Technologies Used:**
  - **`@dnd-kit/core`**: A lightweight, performant, and highly accessible drag-and-drop toolkit for React.
  - **Tailwind CSS**: For buttery smooth transitions and state-based styling during the drag events.

### 2. ⚡ Intelligent Caching & Data Synchronization
A modern app shouldn't make users wait for loading spinners every time they switch tabs.
- **How it works:** Data fetched from the backend (like job lists or AI scores) is heavily cached on the client. When a recruiter updates a status, the local cache is mutated instantly (optimistic updates), making the app feel instantaneous, while the background syncs with the server.
- **Technologies Used:**
  - **TanStack React Query (`@tanstack/react-query`)**: The engine behind data fetching, background synchronization, stale-time management, and cache invalidation.

### 3. 📊 Analytics & Visual Dashboards
Recruiters need to understand their hiring pipelines at a glance.
- **How it works:** We render beautiful, responsive charts showing application volume over time, AI compatibility distributions, and hiring bottleneck metrics.
- **Technologies Used:**
  - **Recharts**: A composable charting library built on React components, providing SVG-based, responsive data visualization.

### 4. 🧩 Accessible, Reusable UI Component System
Building a massive application requires consistency and accessibility.
- **How it works:** We've built a custom design system of atomic components (Buttons, Modals, Dropdowns) that strictly adhere to WAI-ARIA accessibility standards, ensuring keyboard navigation and screen reader support.
- **Technologies Used:**
  - **Radix UI (`@radix-ui/react-*`)**: Unstyled, accessible component primitives.
  - **Tailwind CSS (v4) + `clsx` & `tailwind-merge`**: For crafting a dynamic, scalable utility-first design system without class conflicts.
  - **Lucide React**: Beautiful, consistent iconography.

### 5. 📝 Smart, Type-Safe Form Management
Forms are the lifeblood of an ATS (Job Postings, Registrations, Profile Updates). Handling them must be error-proof.
- **How it works:** Complex forms are managed without triggering endless re-renders. Every input is strictly validated against a schema before a network request is even attempted.
- **Technologies Used:**
  - **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.
  - **Zod (`@hookform/resolvers`)**: TypeScript-first schema validation that guarantees the data leaving the client perfectly matches what the backend expects.

### 6. 🔔 Real-Time Feedback & Notifications
- **How it works:** Whether it's an incoming chat message from a candidate or a system alert that a resume has finished parsing, the UI reacts immediately.
- **Technologies Used:**
  - **Sonner**: An opinionated toast component for React that stacks beautifully and performs exceptionally well.
  - **Zustand**: A small, fast, and scalable bearbones state-management solution used to manage global UI state (like active chat windows or notification badges).

---

## 🧠 Application State Flow (Zustand + React Query)

To avoid React Context re-rendering hell, we explicitly separate **Server State** from **Client State**:
- **Server State (React Query):** Anything that lives on the backend (e.g., Candidates list, Job Postings, User Profiles) is fetched, cached, and managed by React Query. This guarantees we always show the freshest data.
- **Client State (Zustand):** Pure UI states (e.g., "Is the sidebar open?", "Which chat window is active?", "Dark mode toggled") are managed globally by Zustand slices. This keeps our components decoupled and incredibly fast.

---

## 🏎️ Performance Optimizations

1. **Vite Bundling:** We abandoned Webpack in favor of **Vite**, utilizing native ES modules during development for instant hot-module-replacement (HMR) and Rollup for highly optimized, code-split production builds.
2. **Optimistic UI Updates:** Using React Query, any mutation (like accepting a candidate) immediately updates the DOM before the server responds, resulting in a perceived latency of 0ms.
3. **Render Minimization:** By using Zustand for global state and React Hook Form for forms, we've eliminated the React Context re-render traps that typically plague large React applications.
4. **CSS Purging & Just-In-Time Compilation:** Tailwind CSS v4 ensures that only the exact CSS classes used in the project are shipped to the browser, keeping the stylesheet under a few kilobytes.

---

## 🛠️ Complete Tech Stack Summary

| Domain | Technology | Purpose |
|--------|------------|---------|
| **Core Framework** | React (v19) | Component-based UI rendering |
| **Build Tool** | Vite | Blazing fast dev server and bundler |
| **Routing** | React Router DOM (v7) | Client-side navigation |
| **State Management** | Zustand | Global UI state without boilerplate |
| **Data Fetching** | TanStack React Query, Axios | Server-state caching and HTTP requests |
| **Styling** | Tailwind CSS (v4) | Utility-first styling |
| **UI Primitives** | Radix UI | Accessible, unstyled UI components |
| **Forms & Validation**| React Hook Form, Zod | Performant, type-safe form handling |
| **Interactivity** | @dnd-kit/core | Kanban drag-and-drop mechanics |
| **Visualizations** | Recharts | SVG-based data dashboards |
| **Notifications** | Sonner | Toast notification system |

---

## 📂 Architecture Directory Structure

```text
client/
├── 📁 public/              # Static assets (images, icons)
├── 📁 src/
│   ├── 📁 assets/          # Internal assets processed by Vite
│   ├── 📁 components/      # Reusable UI components (Buttons, Inputs, Cards)
│   ├── 📁 hooks/           # Custom React hooks (e.g., useAuth, useJobs)
│   ├── 📁 layouts/         # Page wrappers (e.g., DashboardLayout, AuthLayout)
│   ├── 📁 pages/           # Route-level components (The views)
│   ├── 📁 services/        # API client definitions (Axios instances)
│   ├── 📁 store/           # Zustand global state slices
│   ├── 📁 utils/           # Helper functions (formatting, validation)
│   ├── 📝 App.jsx          # Root component & Route definitions
│   └── 📝 main.jsx         # React DOM entry point & Providers
├── 📝 vite.config.js       # Vite configuration
├── 📝 tailwind.config.js   # Tailwind theme overrides and plugins
└── 📝 package.json         # Dependencies and scripts
```

---

## ⚙️ Setup & Installation

**Prerequisites:** 
- Node.js (v24+)

1. **Clone & Install:**
   ```bash
   git clone https://github.com/RecruitAIApp/client.git
   cd client
   npm install
   ```

2. **Environment Variables (`.env`):**
   Create a `.env` file in the root of the `/client` directory.
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api/v1
   VITE_SOCKET_URL=http://localhost:5001
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   *The application will boot up almost instantly at `http://localhost:5173`.*

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🧪 Testing & Code Quality

We enforce strict linting rules and code formatting to maintain high quality:
- **Linting:** Run `npm run lint` to execute ESLint. We use `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` to ensure best practices in our React v19 stack.
- **Component Consistency:** We utilize `class-variance-authority` (CVA) alongside Tailwind CSS to guarantee UI components (like buttons and badges) always receive correct and predictable CSS classes regardless of props.

---

## 🤝 Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.
Ensure your code passes all linting (`npm run lint`) before submitting.

---

<div align="center">
  <i>Designing the future of recruitment interfaces. 🚀 Fast, beautiful, and deeply intelligent.</i>
</div>
