
import React, { useState, useCallback } from 'react';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

const ImportDataModal: React.FC<ImportDataModalProps> = ({ isOpen, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImportClick = useCallback(() => {
    if (selectedFile) {
      onImport(selectedFile);
    }
  }, [selectedFile, onImport]);

  if (!isOpen) return null;

  const buttonBaseClass = "px-4 py-2.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--card-bg-color))] transition-colors duration-150 w-full";
  const primaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--accent-color))] text-[rgb(var(--accent-text-color))] hover:bg-[rgb(var(--accent-color-hover))] focus:ring-[rgb(var(--accent-color))]`;
  const secondaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--button-secondary-text-color))] hover:bg-opacity-80 focus:ring-[rgb(var(--accent-color))]`;
  const disabledPrimaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--text-placeholder))] cursor-not-allowed`;
  
  const fileInputClass = "block w-full text-sm text-[rgb(var(--text-secondary))] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[rgb(var(--accent-color))] file:text-[rgb(var(--accent-text-color))] hover:file:bg-[rgb(var(--accent-color-hover))] file:cursor-pointer file:transition-colors file:duration-150 focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent-color))] border border-[rgb(var(--input-border-color))] rounded-md p-2 bg-[rgb(var(--input-bg-color))] placeholder-[rgb(var(--text-placeholder))]";


  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="import-data-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[rgba(var(--accent-color),0.1)] mb-4">
            <svg className="h-6 w-6 text-[rgb(var(--accent-color))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
            </svg>
          </div>
          <h3 id="import-data-title" className="text-lg font-semibold text-[rgb(var(--text-primary))]">
            Import Data
          </h3>
          <div className="mt-2 px-1 py-3">
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              Select a JSON or CSV file to import.
            </p>
            <p className="text-xs text-[rgb(var(--highlight-color))] mt-1">
              Warning: Importing will replace all current data.
            </p>
          </div>
          <div className="mt-4">
            <label htmlFor="file-upload" className="sr-only">Choose file</label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".json,.csv"
              onChange={handleFileChange}
              className={fileInputClass}
            />
          </div>
          <div className="mt-5 sm:mt-6 flex flex-col space-y-3">
            <button
              type="button"
              className={selectedFile ? primaryButtonClass : disabledPrimaryButtonClass}
              onClick={handleImportClick}
              disabled={!selectedFile}
            >
              Import File
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

export default ImportDataModal;
