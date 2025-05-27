
# AI-Assisted Build Instructions for Task & Notes Organizer

## 1. Introduction

**Objective:** Develop a "Task & Notes Organizer" web application.

**Core Purpose:** Allow users to create, view, edit, complete, archive (notes only), and delete tasks and notes. The application should be lightweight and user-friendly.

**Data Storage:** All user data must be persisted locally within the user's web browser (e.g., using `localStorage`). No server-side storage is required.

**Theme:** The application must feature a **single, exclusive dark theme**. There should be no option to switch to a light theme. The aesthetic should be modern, clean, and focused.

## 2. Data Model

### 2.1. `Entry` Object
This is the central data structure for both tasks and notes. Each entry should have the following attributes:

*   `id`: (String) A unique identifier for the entry (e.g., generated via a UUID mechanism).
*   `title`: (String) The main title or summary of the task/note. This field is **required**.
*   `details`: (String, Optional) Additional descriptive text or content for the entry.
*   `type`: (Enum/String) Specifies the nature of the entry. Possible values:
    *   `'TASK'`
    *   `'NOTE'`
*   `createdAt`: (String) An ISO 8601 formatted date-time string representing when the entry was created.
*   `isCompleted`: (Boolean) For `TASK` type entries only. `true` if the task is completed, `false` otherwise. Default to `false`.
*   `completedAt`: (String, Optional) An ISO 8601 formatted date-time string representing when a task was marked as completed. Applicable only if `isCompleted` is `true`.
*   `completionNotes`: (String, Optional) For `TASK` type entries. Notes added by the user specifically when marking a task as complete.
*   `dueDate`: (String, Optional) An ISO 8601 formatted date string (YYYY-MM-DD) representing the due date for a `TASK`.
*   `contact`: (String, Optional) Contact information (e.g., name, email, phone number) associated with the entry.
*   `url`: (String, Optional) A URL associated with the entry.
*   `isArchived`: (Boolean) For `NOTE` type entries only. `true` if the note is archived, `false` otherwise. Default to `false`.
*   `archivedAt`: (String, Optional) An ISO 8601 formatted date-time string representing when a note was archived. Applicable only if `isArchived` is `true`.

## 3. Application Layout & UI Components

The application interface should be responsive and adapt to various screen sizes.

### 3.1. AppBar
*   **Position:** Fixed at the top of the viewport.
*   **Content:** Displays the application title (e.g., "Task & Notes Hub").
*   **Styling:** Use the designated "AppBar Background" and "AppBar Text Color" from the theme.

### 3.2. Input Form
Located persistently below the AppBar, allowing users to create new entries.
*   **Entry Type Selection:**
    *   Implement as a segmented control (two buttons side-by-side: "Task" and "Note").
    *   The currently selected type should be visually highlighted (e.g., using the accent color).
    *   Changing the selection updates the context for the title placeholder and submission button label.
*   **Title Input & "Add Details" Toggle:**
    *   A primary text input field for the `Entry.title`. This field is **required**.
    *   Placeholder text should dynamically change (e.g., "New task..." or "New note title...").
    *   Integrate an icon button (e.g., plus/minus icon, or cog icon) directly on the right side of this title input field.
        *   This icon button toggles the visibility of the "Options Panel" (see below).
        *   The button should have a distinct background for better affordance (e.g., using "Button Secondary Background Color").
*   **Options Panel (Collapsible):**
    *   This panel is initially hidden and revealed by the "Add Details" toggle button.
    *   Contains inputs for optional `Entry` fields:
        *   `Details`: A multi-line text area.
        *   `Due Date`: A date input control (YYYY-MM-DD format).
        *   `Contact`: A single-line text input.
        *   `URL`: A URL input control.
            *   **Auto-HTTPS:** If a user types a domain (e.g., `example.com`) without `http://` or `https://` (but containing at least one dot), and the field loses focus or the form is submitted, automatically prepend `https://` to the value.
*   **Submission:**
    *   A full-width button. Its label should dynamically change to "Add Task" or "Add Note" based on the selected `EntryType`.
    *   **On Submit:**
        1.  Validate that the title is not empty.
        2.  Create a new `Entry` object with a unique `id` and current `createdAt` timestamp.
        3.  Add the new entry to the beginning of the main list of entries.
        4.  Clear all input fields in the form (title, details, dueDate, contact, url).
        5.  Collapse/hide the "Options Panel".
        6.  Optionally, switch the active view/tab to show the newly added item (e.g., if a task was added, switch to the "Active Tasks" tab).

### 3.3. Main Content Area
This area displays lists of entries and is controlled by a view mode.
*   **View Modes:**
    *   `'main'`: Shows active tasks and notes in a tabbed interface.
    *   `'completed'`: Shows completed tasks.
    *   `'archived'`: Shows archived notes.

*   **Main View (`viewMode === 'main'`):**
    *   **Tabs:**
        *   Two tabs: "Active Tasks" and "Notes".
        *   Each tab should display a count of the items it contains.
        *   The active tab must be visually distinct (e.g., different text color, underline accent).
    *   **Tab Content:**
        *   When "Active Tasks" is selected: Display a list of `Entry` items where `type === 'TASK'` and `isCompleted === false`.
        *   When "Notes" is selected: Display a list of `Entry` items where `type === 'NOTE'` and `isArchived === false`.
    *   **Navigation Buttons (below tabbed content):**
        *   "View Completed Tasks": Visible if there are any completed tasks. Clicking it changes `viewMode` to `'completed'`.
        *   "View Archived Notes": Visible if there are any archived notes. Clicking it changes `viewMode` to `'archived'`.

*   **Completed Tasks View (`viewMode === 'completed'`):**
    *   **Header:** Display a heading like "Completed Tasks".
    *   **Back Button:** A button (e.g., "← Back") to return to `viewMode = 'main'`.
    *   **List:** Display `Entry` items where `type === 'TASK'` and `isCompleted === true`.
        *   **Grouping:** Group tasks by the week they were completed (e.g., "Week 21 (Jul 15 - Jul 21), 2024").
        *   **Sorting:**
            *   Groups sorted with the most recent week first.
            *   Tasks within each group sorted by `completedAt` timestamp (most recent first).

*   **Archived Notes View (`viewMode === 'archived'`):**
    *   **Header:** Display a heading like "Archived Notes".
    *   **Back Button:** A button (e.g., "← Back") to return to `viewMode = 'main'`.
    *   **List:** Display `Entry` items where `type === 'NOTE'` and `isArchived === true`.
        *   **Sorting:** Sort notes by `archivedAt` timestamp (most recent first).

### 3.4. Footer
*   **Position:** Appears at the very bottom of the page content flow (not sticky).
*   **Content:**
    *   **"Export All Data" Button:**
        *   Opens an "Export Options" modal (see Modals section).
        *   If no data exists, show an alert/message instead of opening the modal.
    *   **Copyright Notice:** Display a static copyright text (e.g., "© 2025 Your Name").

## 4. Entry Item Component (Card Display)

This component displays a single task or note. Its appearance and available actions vary based on context (active list, completed list, editing state, etc.).

### 4.1. General Appearance & Interaction
*   **Styling:** Rounded corners, subtle shadow, border. Use "Card Background Color".
*   **Visual States:**
    *   Completed tasks: Should appear visually distinct (e.g., reduced opacity, accent border, line-through on title).
    *   Archived notes: Should appear visually distinct (e.g., reduced opacity).
    *   Editing state: May have an accent border or different background to indicate focus.
*   **Click Action:** Clicking the main area of the card (excluding specific action buttons or active input fields) should open the "Detail Modal" for that entry.
*   **Drag-and-Drop (for items in "Active Tasks" and "Notes" lists only):**
    *   The entire card should be draggable.
    *   **Cursor:** `grab` on hover, `grabbing` during drag.
    *   **Visual Feedback During Drag:**
        *   Dragged Item: Reduced opacity (e.g., 0.6), slight scale transform, enhanced shadow.
        *   Drop Target: A visual indicator (e.g., a top border highlight) should appear on potential drop targets when dragging over them.
    *   **Reordering Logic:** Users should be able to reorder items within their respective lists (tasks with tasks, notes with notes). Reordering should update the main `entries` array.

### 4.2. Content (Non-Editing State)
*   **Title (`Entry.title`):** Prominently displayed.
    *   For completed tasks, the title should have a line-through text decoration.
*   **Task Checkbox (For `TASK` type, only in active lists):**
    *   Positioned to the left of the title.
    *   Allows marking a task as complete or incomplete.
    *   **Behavior:**
        *   **Checking (Marking Complete):** Opens the "Completion Notes Modal". The task is only marked complete after interacting with this modal.
        *   **Unchecking (Marking Incomplete):** Sets `isCompleted` to `false`, clears `completedAt` and `completionNotes`.
*   **Due Date Display (For `TASK` type, if `dueDate` exists and task is not completed/archived):**
    *   Displayed concisely (e.g., "Due: Mon, Jul 15, 2024") at the bottom-right or a suitable noticeable position.
*   **Creation/Archive Date Display (Contextual):**
    *   In "Completed Tasks" view: Display "Created: [Date]" or similar.
    *   In "Archived Notes" view: Display "Archived: [Date]" or similar.

### 4.3. Action Icons (Top-Right Corner)
These icons are visible only if `allowActions` is true (i.e., for items in "Active Tasks" and "Notes" lists, not for completed/archived items in their respective views).
*   **Edit Icon (Pencil):**
    *   Visible for active (non-completed, non-archived) tasks and notes.
    *   Action: Toggles inline editing mode for the card.
*   **Archive Icon (Archive Box):**
    *   Visible for active `NOTE` type entries.
    *   Action: Opens the "Confirm Archive Modal".
*   **Delete Icon (Trash Can):**
    *   Visible for active tasks and notes.
    *   Action: Opens the "Confirm Delete Modal".

### 4.4. Inline Editing Mode
Triggered by the "Edit" icon on an entry card.
*   The card's content is replaced by input fields for:
    *   `Title`: Text input.
    *   `Details`: Textarea.
    *   `Due Date`: Date input.
    *   `Contact`: Text input.
    *   `URL`: URL input.
*   **Action Buttons:**
    *   "Save": Updates the entry in the main data store with all modified fields. Title is required. Exits editing mode.
    *   "Cancel": Discards any changes. Exits editing mode.

## 5. Modals

All modals should appear as overlays covering the main content, typically with a semi-transparent backdrop (optionally with blur). Modal content should be centered.

### 5.1. Detail Modal
*   **Trigger:** Clicking an `EntryItem` card (when not in inline edit mode or clicking an action button).
*   **Layout:**
    *   **Header:**
        *   Entry Title (prominently displayed).
        *   **Action Icons (Top-Right of Modal):**
            *   **Edit Icon:** For active tasks/notes. Closes the modal and enables inline editing on the corresponding card in the list.
            *   **Archive/Unarchive Icon:** For `NOTE` type. Opens "Confirm Archive Modal". Icon should reflect current archive state (e.g., unarchive icon if already archived).
            *   **Delete Icon:** Opens "Confirm Delete Modal".
            *   **Close Button (X icon):** Closes the modal.
    *   **Body (Scrollable):**
        *   Displays "Label: Value" pairs for all relevant fields of the `Entry`:
            *   Type, Details, Due Date, Contact, URL (clickable link, opens in new tab), Created At.
            *   If task is completed: Completed At, Completion Notes (if any).
            *   If note is archived: Archived At.
    *   **Footer (Conditional, for `TASK` type entries):**
        *   A button: "Mark as Complete" or "Mark as Incomplete" based on current `isCompleted` state.
        *   **Action (Marking Complete):** Opens the "Completion Notes Modal".

### 5.2. Confirm Delete Modal
*   **Trigger:** Initiating a delete action (from `EntryItem` card or `DetailModal`).
*   **Content:**
    *   Title: e.g., "Confirm Deletion".
    *   Icon: A warning or trash icon.
    *   Message: "Are you sure you want to delete '[Entry Title]'? This action cannot be undone." (Item name should be dynamic).
    *   Buttons: "Cancel", "Delete" (styled as a destructive action, e.g., red background).
*   **Action:** If "Delete" is confirmed, remove the entry from the main data store.

### 5.3. Completion Notes Modal
*   **Trigger:** When a task is being marked as complete (from `EntryItem` checkbox or `DetailModal` button).
*   **Content:**
    *   Title: e.g., "Completion Notes for '[Task Title]'". (Task title should be dynamic).
    *   Icon: A checkmark or completion icon.
    *   Textarea: For entering `completionNotes`.
    *   Buttons:
        *   "Skip & Complete": Marks the task as complete, sets `isCompleted = true`, `completedAt` to now. `completionNotes` remains empty or undefined.
        *   "Save Notes & Complete Task": Marks the task as complete, sets `isCompleted = true`, `completedAt` to now, and saves the entered text into `completionNotes`.
*   **Action:** Updates the task entry in the main data store and closes the modal.

### 5.4. Confirm Archive Modal
*   **Trigger:** Initiating an archive/unarchive action for a `NOTE` (from `EntryItem` card or `DetailModal`).
*   **Content:**
    *   Title: Dynamically "Confirm Archive" or "Confirm Unarchive".
    *   Icon: An archive or unarchive icon.
    *   Message: Dynamically "Are you sure you want to archive '[Note Title]'?" or "Are you sure you want to unarchive '[Note Title]'?".
    *   Buttons: "Cancel", "Archive"/"Unarchive" (styled as a primary action).
*   **Action:** If confirmed, toggle the `isArchived` status of the note and set/clear `archivedAt`. Updates the note entry.

### 5.5. Export Options Modal
*   **Trigger:** Clicking the "Export All Data" button in the footer (only if data exists).
*   **Content:**
    *   Title: e.g., "Export Data".
    *   Icon: An export or download icon.
    *   Message: e.g., "Choose the format for your data export."
    *   Buttons: "Export as JSON", "Export as CSV", "Cancel".
*   **Action:**
    *   "Export as JSON": Triggers download of all `entries` as a JSON file.
    *   "Export as CSV": Triggers download of all `entries` as a CSV file.
    *   Closes the modal after action or cancellation.

## 6. State Management & Data Flow

*   **Primary Data Store:** A single list/array containing all `Entry` objects. This list is the source of truth.
*   **Persistence:**
    *   The primary data store must be saved to local browser storage (e.g., `localStorage`) whenever it changes.
    *   On application load, retrieve data from local storage to initialize the application state.
*   **Key Application States:**
    *   The list of all `entries`.
    *   Current active tab (e.g., `ActiveTasks` or `Notes`).
    *   Current view mode (`main`, `completed`, `archived`).
    *   ID of the entry currently being edited inline (if any).
    *   ID of the item currently being dragged (if any).
    *   Visibility states for all modals, along with data for the selected entry for modals.
*   **Derived Data:**
    *   Lists for active tasks, active notes, completed tasks, and archived notes should be derived (filtered and sorted) from the main `entries` list. These derivations should be efficient (e.g., memoized if using a reactive framework).
*   **UI Updates:** The UI must reactively update whenever the underlying data or state changes.

## 7. Utility Functions

Implement helper functions, particularly for date manipulation and display.

### 7.1. Date Utilities
*   `getWeekOfYear(dateString)`: Input: ISO date string. Output: Object `{ week: number, year: number }`.
*   `getWeekDates(weekNumber, year)`: Input: Week number, year. Output: Object `{ start: DateObject, end: DateObject }` (Monday as week start).
*   `formatWeekDateRange(dateStringInput)`: Input: ISO date string. Output: Formatted string like "(Jul 15 - Jul 21)".
*   `formatDate(dateString?)`: Input: Optional ISO date string. Output: Formatted string like "July 15, 2024, 10:30 AM".
*   `formatDueDate(dateString?)`: Input: Optional ISO date string (YYYY-MM-DD or full ISO). Output: Formatted string like "Mon, Jul 15, 2024".
*   `formatDateShort(dateString?)`: Input: Optional ISO date string. Output: Formatted string like "Jul 15, 2024".
*   `formatArchivedAtDate(dateString?)`: Input: Optional ISO date string. Output: Formatted string like "Jul 15, 2024".

## 8. Data Export Functionality

*   **Trigger:** Via "Export Options Modal".
*   **Filename Convention:** Downloaded files should follow a pattern like `task-notes-organizer-export-YYYYMMDD_HHMMSS.[json|csv]`.
*   **JSON Export:** Serialize the entire `entries` array into a well-formatted JSON string.
*   **CSV Export:**
    *   Convert the `entries` array into CSV format.
    *   The first row should be headers (corresponding to `Entry` object keys).
    *   Subsequent rows represent each entry.
    *   Ensure proper CSV escaping for fields containing commas, quotes, or newlines.

## 9. Styling & Theme (Exclusive Dark Theme)

*   **Overall Aesthetic:** Modern, clean, minimalist, with good readability.
*   **Color Palette (Dark Purple/Magenta Inspired - Example Values):**
    *   `--bg-color`: Very dark desaturated purple (e.g., `rgb(26 23 40)`) - Main page background.
    *   `--app-bar-bg-color`: Dark, slightly desaturated purple (e.g., `rgb(49 46 69)`) - AppBar background.
    *   `--card-bg-color`: Dark purple, distinct from main bg (e.g., `rgb(36 32 55)`) - Entry cards, input form, modals.
    *   `--text-primary`: Light lavender/gray (e.g., `rgb(235 232 245)`) - Main text.
    *   `--text-secondary`: Medium lavender/gray (e.g., `rgb(188 182 213)`) - Subtitles, placeholder text, less important info.
    *   `--text-placeholder`: (e.g., `rgb(138 132 163)`)
    *   `--border-color`: Subtle, dark shade (e.g., `rgb(59 55 80)`) - Borders, dividers.
    *   `--accent-color`: Bright Violet (e.g., `rgb(167 139 250)`) - Primary interactive elements, highlights, active states.
    *   `--accent-color-hover`: Darker/modified Violet (e.g., `rgb(139 92 246)`) - Hover state for accent elements.
    *   `--accent-text-color`: White or very light color (e.g., `rgb(255 255 255)`) - Text on accent-colored backgrounds.
    *   `--highlight-color`: Bright Magenta (e.g., `rgb(236 72 153)`) - Due dates, secondary highlights.
    *   `--completed-accent-color`: Greenish (e.g., `rgb(52 211 153)`) - For completed task indicators.
    *   `--completed-text-color`: Grayed-out text for completed items (e.g., `rgb(156 163 175)`).
    *   `--input-bg-color`: Darker input background (e.g., `rgb(31 27 48)`).
    *   `--input-border-color`: Visible but not too bright border for inputs (e.g., `rgb(79 70 115)`).
    *   `--button-secondary-bg-color`: Darker secondary button background (e.g., `rgb(69 63 96)`).
    *   `--destructive-color`: Red (e.g., `rgb(239 68 68)`) - For delete buttons/actions.
    *   `--destructive-color-hover`: Darker Red (e.g., `rgb(220 38 38)`).
    *   These should be defined as CSS custom properties for easy management.
*   **Typography:** Primary font: 'Inter' (or similar sans-serif). Use appropriate weights for hierarchy.
*   **Layout:** Use a responsive layout system (e.g., flexbox, grid).
*   **Custom Styles:**
    *   Custom styled scrollbars consistent with the dark theme.
    *   Clear visual cues for drag-and-drop operations.
    *   Modal overlay with backdrop blur effect.

## 10. Accessibility (A11Y)

*   Use semantic HTML elements wherever appropriate.
*   Provide `aria-label`s for icon buttons and other non-descriptive interactive elements.
*   Use ARIA roles where necessary (e.g., `tablist`, `tab`, `dialog`).
*   Ensure sufficient color contrast throughout the application, meeting WCAG AA standards for the dark theme.
*   All interactive elements must be navigable and operable via keyboard.
*   Implement clear and visible focus indicators for keyboard users.

## 11. Error Handling & Edge Cases

*   **Empty States:** Provide user-friendly messages when lists are empty (e.g., "No active tasks yet.", "No notes to display.").
*   **Input Validation:** Primarily, the title field in the input form must not be empty. Provide feedback if submitted empty.
*   **Local Storage Issues:** While not explicitly detailed for complex handling, the application should gracefully handle cases where local storage might be unavailable or full (though simple error logging might suffice for this scope).

This set of instructions provides a comprehensive guide for an AI to build the Task & Notes Organizer application with the specified features and characteristics.
