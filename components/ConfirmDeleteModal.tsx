import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  const buttonBaseClass = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--card-bg-color))] transition-colors duration-150";
  const confirmButtonClass = `${buttonBaseClass} bg-[rgb(var(--destructive-color))] text-white hover:bg-[rgb(var(--destructive-color-hover))] focus:ring-[rgb(var(--destructive-color))]`;
  const cancelButtonClass = `${buttonBaseClass} bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--button-secondary-text-color))] hover:bg-opacity-80 focus:ring-[rgb(var(--accent-color))]`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[rgba(var(--destructive-color),0.1)] mb-4">
            <svg className="h-6 w-6 text-[rgb(var(--destructive-color))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 id="confirm-delete-title" className="text-lg font-semibold text-[rgb(var(--text-primary))]">
            Confirm Deletion
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              Are you sure you want to delete "<strong>{itemName}</strong>"? This action cannot be undone.
            </p>
          </div>
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="button"
              className={`${confirmButtonClass} w-full sm:w-auto`}
              onClick={onConfirm}
            >
              Delete
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

export default ConfirmDeleteModal;