
import React from 'react';

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

const ExportOptionsModal: React.FC<ExportOptionsModalProps> = ({ isOpen, onClose, onExportJSON, onExportCSV }) => {
  if (!isOpen) return null;

  const buttonBaseClass = "px-4 py-2.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--card-bg-color))] transition-colors duration-150 w-full";
  const primaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--accent-color))] text-[rgb(var(--accent-text-color))] hover:bg-[rgb(var(--accent-color-hover))] focus:ring-[rgb(var(--accent-color))]`;
  const secondaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--button-secondary-text-color))] hover:bg-opacity-80 focus:ring-[rgb(var(--accent-color))]`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="export-options-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[rgba(var(--accent-color),0.1)] mb-4">
            <svg className="h-6 w-6 text-[rgb(var(--accent-color))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <h3 id="export-options-title" className="text-lg font-semibold text-[rgb(var(--text-primary))]">
            Export Data
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              Choose the format for your data export.
            </p>
          </div>
          <div className="mt-5 sm:mt-6 flex flex-col space-y-3">
            <button
              type="button"
              className={primaryButtonClass}
              onClick={onExportJSON}
            >
              Export as JSON
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={onExportCSV}
            >
              Export as CSV
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptionsModal;
