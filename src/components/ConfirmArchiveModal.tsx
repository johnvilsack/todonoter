

import React from 'react';

interface ConfirmArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isArchiving: boolean; // True if archiving, false if unarchiving
}

const ConfirmArchiveModal: React.FC<ConfirmArchiveModalProps> = ({ isOpen, onClose, onConfirm, itemName, isArchiving }) => {
  if (!isOpen) return null;

  const actionText = isArchiving ? "Archive" : "Unarchive";
  const titleText = isArchiving ? "Confirm Archive" : "Confirm Unarchive";
  const messageText = `Are you sure you want to ${actionText.toLowerCase()} "${itemName}"?`;

  const buttonBaseClass = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--card-bg-color))] transition-colors duration-150";
  const confirmButtonClass = `${buttonBaseClass} bg-[rgb(var(--accent-color))] text-[rgb(var(--accent-text-color))] hover:bg-[rgb(var(--accent-color-hover))] focus:ring-[rgb(var(--accent-color))]`;
  const cancelButtonClass = `${buttonBaseClass} bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--button-secondary-text-color))] hover:bg-opacity-80 focus:ring-[rgb(var(--accent-color))]`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="confirm-archive-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[rgba(var(--accent-color),0.1)] mb-4">
            {isArchiving ? (
              <svg className="h-6 w-6 text-[rgb(var(--accent-color))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15V3.75m0 0L10.5 5.25M12 3.75L13.5 5.25" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-[rgb(var(--accent-color))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 3.75V15m0 0L10.5 13.5M12 15L13.5 13.5" />
              </svg>
            )}
          </div>
          <h3 id="confirm-archive-title" className="text-lg font-semibold text-[rgb(var(--text-primary))]">
            {titleText}
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              {messageText}
            </p>
          </div>
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="button"
              className={`${confirmButtonClass} w-full sm:w-auto`}
              onClick={onConfirm}
            >
              {actionText}
            </button>
            <button
              type="button"
              className={`${cancelButtonClass} w-full sm:w-auto`}
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

export default ConfirmArchiveModal;
