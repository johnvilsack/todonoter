

import React, { useState } from 'react';

interface CompletionNotesModalProps {
  isOpen: boolean;
  onClose: () => void; // This will be called by App.tsx after onSave if needed
  onSave: (notes: string) => void;
  taskTitle: string;
}

const CompletionNotesModal: React.FC<CompletionNotesModalProps> = ({ isOpen, onClose, onSave, taskTitle }) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSaveAndComplete = () => {
    onSave(notes);
    // App.tsx's handleSaveCompletionNotes will call handleCloseCompletionNotesModal
  };

  const handleSkipAndComplete = () => {
    onSave(''); // Save with empty notes, which App.tsx handles as completion
    // App.tsx's handleSaveCompletionNotes will call handleCloseCompletionNotesModal
  };
  
  // Use a more explicit onClose for the overlay click and escape key, distinct from skip/save
  const handleDirectClose = () => {
    onClose(); // This is the original onClose prop for direct dismissal
  };


  const inputBaseClass = "mt-1 block w-full px-3 py-2 bg-[rgb(var(--input-bg-color))] border border-[rgb(var(--input-border-color))] rounded-md shadow-sm focus:ring-1 focus:ring-[rgb(var(--accent-color))] focus:border-[rgb(var(--accent-color))] text-sm text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-placeholder))]";
  const buttonBaseClass = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--card-bg-color))] transition-colors duration-150";
  const primaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--accent-color))] text-[rgb(var(--accent-text-color))] hover:bg-[rgb(var(--accent-color-hover))] focus:ring-[rgb(var(--accent-color))]`;
  const secondaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--button-secondary-text-color))] hover:bg-opacity-80 focus:ring-[rgb(var(--accent-color))]`;


  return (
    <div className="modal-overlay" onClick={handleDirectClose} role="dialog" aria-modal="true" aria-labelledby="completion-notes-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[rgba(var(--completed-accent-color),0.15)] sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-[rgb(var(--completed-accent-color))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 id="completion-notes-title" className="text-lg font-semibold leading-6 text-[rgb(var(--text-primary))]">
              Completion Notes
            </h3>
            <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">
              For task: "<strong>{taskTitle}</strong>"
            </p>
            <div className="mt-4">
              <label htmlFor="completion-notes-input" className="sr-only">Completion Notes</label>
              <textarea
                id="completion-notes-input"
                rows={4}
                className={inputBaseClass}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this completion (optional)..."
              />
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            className={`${primaryButtonClass} w-full sm:w-auto`}
            onClick={handleSaveAndComplete}
          >
            Save Notes & Complete
          </button>
          <button
            type="button"
            className={`${secondaryButtonClass} w-full sm:w-auto`}
            onClick={handleSkipAndComplete} // Updated onClick handler
          >
            Skip & Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionNotesModal;
