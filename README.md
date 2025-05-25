
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
    *   **Tailwind CSS (v3 via CDN)**: For utility-first styling.
    *   Custom CSS: For theme variables, scrollbars, and specific component styles.
*   **Data Storage**: Browser `localStorage`.
*   **Build/Environment**: Uses ES modules directly in the browser, imported via `index.html`.

## Application Structure

*   `index.html`: Main HTML file, includes CDN links, CSS custom properties for the theme, and script imports.
*   `index.tsx`: Entry point for the React application.
*   `App.tsx`: Core application component managing state, routing (view modes), and orchestrating child components.
*   `types.ts`: Contains all TypeScript type definitions and enums.
*   `hooks/`: Custom React hooks (e.g., `useLocalStorage.ts`).
*   `utils/`: Utility functions (e.g., `dateUtils.ts`).
*   `components/`: Contains all UI components:
    *   `InputForm.tsx`: For creating new tasks and notes.
    *   `EntryItem.tsx`: Renders individual task/note cards.
    *   `Tabs.tsx`: For switching between Active Tasks and Notes views.
    *   List components: `ActiveTaskList.tsx`, `NoteList.tsx`, `CompletedTaskList.tsx`, `ArchivedNoteList.tsx`.
    *   Modal components: `DetailModal.tsx`, `ConfirmDeleteModal.tsx`, `CompletionNotesModal.tsx`, `ConfirmArchiveModal.tsx`, `ExportOptionsModal.tsx`.
    *   `AppBar.tsx`: The top application bar.
*   `metadata.json`: Basic application metadata.
*   `requirements.md`: Detailed functional and technical requirements.

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
