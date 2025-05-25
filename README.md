# Task & Notes Organizer

A lightweight, browser-based application for managing tasks and notes with a sleek, exclusive dark theme. All data is stored locally in your browser.

## Overview

The Task & Notes Organizer provides a simple and efficient way to keep track of your to-do items and important notes. It features a clean, dark user interface designed for focus and ease of use. With functionalities like drag-and-drop reordering, inline editing, and local data persistence, it aims to be a handy tool for personal organization.

## Key Features

*   **Dual Entry Types**: Create and manage both **Tasks** and **Notes**.
*   **Exclusive Dark Theme**: A single, carefully crafted dark purple/magenta theme for optimal visual comfort.
*   **Rich Input Options**:
    *   Quick add for titles.
    *   Expandable options panel for details, due dates, contact information, and URLs.
    *   Automatic `https://` prefixing for URLs.
*   **Task Management**:
    *   Mark tasks as complete/incomplete.
    *   Option to add **completion notes** when a task is finished.
    *   View active and completed tasks in separate, organized lists.
    *   Completed tasks are grouped by the week of completion.
*   **Note Management**:
    *   Create, edit, and view notes.
    *   Archive and unarchive notes.
    *   View active and archived notes in separate lists.
*   **Inline Editing**: Quickly edit the title, details, due date, contact, and URL of tasks and notes directly in the list view.
*   **Detailed View**: A modal provides a comprehensive look at an entry's details.
*   **Drag & Drop Reordering**: Easily reorder active tasks and notes within their respective lists.
*   **Confirmation Dialogs**: Ensures user intent for critical actions like deletion and archiving.
*   **Data Export**:
    *   Export all your data in **JSON** or **CSV** format.
    *   A modal allows you to choose your preferred export format.
*   **Local Storage Persistence**: All data is saved in your browser's `localStorage`, ensuring your information is available across sessions on the same browser.
*   **Responsive Design**: Adapts to various screen sizes for a consistent experience on desktop and mobile devices.

## Tech Stack

*   **Frontend**:
    *   **React 19**: Leverages functional components and hooks for a modern UI.
    *   **TypeScript**: For strong typing and improved code quality.
    *   **Vite**: Build tool for fast development and optimized production builds.
    *   **Tailwind CSS (v3 via CDN)**: For utility-first styling.
    *   Custom CSS: For theme variables, scrollbars, and specific component styles.
*   **Data Storage**: Browser `localStorage`.

## Application Structure

*   `index.html`: Main HTML file (root of the project), includes CDN links, CSS custom properties for the theme. Vite injects scripts here.
*   `vite.config.ts`: Configuration for the Vite build tool. **Crucially, this contains the `base` path setting for GitHub Pages deployment.**
*   `package.json`: Manages project dependencies and scripts (e.g., `npm run dev`, `npm run build`).
*   `src/`: Contains all source code.
    *   `main.tsx`: Entry point for the React application (renders `App.tsx` into `index.html`).
    *   `App.tsx`: Core application component managing state, view modes, and orchestrating child components.
    *   `types.ts`: Contains all TypeScript type definitions and enums.
    *   `hooks/`: Custom React hooks (e.g., `useLocalStorage.ts`).
    *   `utils/`: Utility functions (e.g., `dateUtils.ts`).
    *   `components/`: Contains all UI components.
*   `.github/workflows/deploy-gh-pages.yml`: GitHub Actions workflow for automatic deployment to GitHub Pages.
*   `metadata.json`: Basic application metadata.
*   `requirements.md`: Detailed functional and technical requirements.

## Getting Started Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/johnvilsack/todonoter.git
    cd todonoter
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start Vite's development server, usually at `http://localhost:5173`.

## Building for Production

To create a production-ready build (static files in the `dist` directory):
```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

1.  **Verify `vite.config.ts` `base` Path**:
    *   Open `vite.config.ts`.
    *   The `base` property **must** be set correctly for your GitHub Pages URL. For `https://johnvilsack.github.io/todonoter/`, the `base` path should be `'/todonoter/'`. The provided `vite.config.ts` should already be configured for this.
    ```typescript
    // vite.config.ts
    export default defineConfig(({ command }) => {
      const base = command === 'build' ? '/todonoter/' : '/'; 
      return {
        // ... other config
        base: base,
      };
    });
    ```
2.  **Push to `main` branch**: When you push changes to your `main` branch, the GitHub Action defined in `.github/workflows/deploy-gh-pages.yml` will automatically:
    *   Checkout your code.
    *   Set up Node.js.
    *   Install dependencies using `npm ci`.
    *   Build the project using `npm run build` (which runs `vite build`).
    *   Configure GitHub Pages.
    *   Upload the built `dist` directory as an artifact.
    *   Deploy this artifact to GitHub Pages.
3.  **Configure GitHub Pages Settings in Repository**:
    *   In your GitHub repository (`johnvilsack/todonoter`), go to "Settings" > "Pages" (in the left sidebar).
    *   Under "Build and deployment":
        *   For "Source," select **"GitHub Actions"**.
    *   GitHub Pages will then automatically pick up the deployment from the GitHub Actions workflow.
    *   Your site should be live at `https://johnvilsack.github.io/todonoter/` after the action completes successfully (this might take a few minutes after your first push with the workflow).

## How Data is Handled

All task and note data is stored directly in your web browser's `localStorage` under the key `task-notes-entries-v3`. This means:
*   Your data is private to your browser and device.
*   No data is sent to or stored on any external server.
*   Clearing your browser's site data for this application will remove all your tasks and notes.
*   You can use the "Export All Data" feature to back up your information.

## Conceptual Features (Not Implemented)

*   The application description in `metadata.json` mentions "Full Google Account and Drive integration." This is a conceptual feature and is **not** implemented in the current version. The application operates entirely locally.

---

© 2025 John Vilsack
