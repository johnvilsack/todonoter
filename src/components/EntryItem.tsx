

import React, { useState, useEffect } from 'react';
import { Entry, EntryType } from '../types';
import { formatDueDate, formatDateShort, formatArchivedAtDate } from '../utils/dateUtils';

interface EntryItemProps {
  entry: Entry;
  onToggleComplete?: (id: string) => void; 
  onDeleteRequest?: (entry: Entry) => void; 
  onArchiveRequest?: (entry: Entry) => void; // Changed from onArchive(id:string)
  isEditing?: boolean; 
  editingTaskId?: string | null; 
  onStartEdit?: (id: string) => void; 
  onSaveEdit?: (id: string, title: string, details: string, dueDate?: string, contact?: string, url?: string) => void; 
  onCancelEdit?: (id: string) => void; 
  allowActions: boolean; 
  onOpenDetailModal: (entry: Entry) => void;
  onOpenCompletionNotesModal?: (task: Entry) => void;

  draggedItemId: string | null;
  onDragStartHandler: (id: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDropHandler: (targetId: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ActionButton: React.FC<{ onClick: (e: React.MouseEvent) => void; ariaLabel: string; title: string; children: React.ReactNode; className?: string }> = 
  ({ onClick, ariaLabel, title, children, className }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-full transition-colors duration-150 ${className}`}
    aria-label={ariaLabel}
    title={title}
  >
    {children}
  </button>
);

const EntryItem: React.FC<EntryItemProps> = ({
  entry,
  onToggleComplete,
  onDeleteRequest,
  onArchiveRequest, // Updated prop name
  isEditing: isEditingNote, 
  editingTaskId,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  allowActions,
  onOpenDetailModal,
  onOpenCompletionNotesModal,
  draggedItemId,
  onDragStartHandler,
  onDropHandler,
  onDragEndHandler,
}) => {
  const { id, title, details, type, createdAt, isCompleted, dueDate, contact, url, isArchived, archivedAt } = entry;

  const isEditingCurrentEntry = (type === EntryType.Note && isEditingNote) || (type === EntryType.Task && editingTaskId === id);

  const [editTitle, setEditTitle] = useState(title);
  const [editDetails, setEditDetails] = useState(details || '');
  const [editDueDate, setEditDueDate] = useState(dueDate || '');
  const [editContact, setEditContact] = useState(contact || '');
  const [editUrl, setEditUrl] = useState(url || '');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (isEditingCurrentEntry) {
      setEditTitle(title);
      setEditDetails(details || '');
      setEditDueDate(dueDate || '');
      setEditContact(contact || '');
      setEditUrl(url || '');
    }
  }, [isEditingCurrentEntry, title, details, dueDate, contact, url]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editTitle.trim()) {
      alert('Title cannot be empty.');
      return;
    }
    if (onSaveEdit) {
      onSaveEdit(id, editTitle.trim(), editDetails.trim(), editDueDate, editContact, editUrl);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCancelEdit) onCancelEdit(id);
  };
  
  const cardBaseStyle = "p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out relative border"; 
  
  let cardSpecificStyle = "bg-[rgb(var(--card-bg-color))] border-[rgb(var(--border-color))] hover:shadow-lg";
  let titleColor = "text-[rgb(var(--text-primary))]";
  let dateColor = "text-[rgb(var(--text-secondary))]";
  const actionIconColor = "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--accent-color))]";
  const deleteIconColor = "text-[rgb(var(--destructive-color))] hover:text-[rgb(var(--destructive-color-hover))]";


  if (isCompleted) {
    cardSpecificStyle = `bg-[rgb(var(--card-bg-color))] border-transparent border-[rgba(var(--completed-accent-color),0.3)] opacity-60`;
    titleColor = "text-[rgb(var(--completed-text-color))] line-through";
    dateColor = "text-[rgb(var(--completed-text-color))]";
  } else if (isArchived) {
    cardSpecificStyle = `bg-[rgb(var(--card-bg-color))] border-transparent border-[rgba(var(--text-secondary),0.3)] opacity-50`;
    titleColor = "text-[rgb(var(--text-secondary))]";
  } else if (isEditingCurrentEntry) {
    cardSpecificStyle = `bg-[rgba(var(--accent-color),0.05)] border-[rgb(var(--accent-color))] shadow-xl`;
  }

  const isCurrentlyBeingDragged = draggedItemId === id;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) {
        const targetElement = e.target as HTMLElement;
        if (targetElement.closest('button, input, textarea, a')) { 
            return; 
        }
    }
    if (!isEditingCurrentEntry) onOpenDetailModal(entry);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    if (allowActions && draggedItemId && draggedItemId !== id) setIsDragOver(true);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
     if (allowActions && draggedItemId && draggedItemId !== id) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleLocalDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    if(allowActions) onDropHandler(id, e);
  }
  
  const inputBaseClass = "w-full px-3 py-2 border border-[rgb(var(--input-border-color))] rounded-md shadow-sm focus:ring-1 focus:ring-[rgb(var(--accent-color))] focus:border-[rgb(var(--accent-color))] sm:text-sm bg-[rgb(var(--input-bg-color))] text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-placeholder))]";
  const labelClass = "block text-xs font-medium text-[rgb(var(--text-secondary))] mb-0.5";

  return (
    <div
      onClick={handleCardClick}
      draggable={allowActions && !isEditingCurrentEntry}
      onDragStart={(e) => allowActions && !isEditingCurrentEntry && onDragStartHandler(id, e)}
      onDragEnd={(e) => allowActions && !isEditingCurrentEntry && onDragEndHandler(e)}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleLocalDrop}
      className={`${cardBaseStyle} ${cardSpecificStyle} ${isCurrentlyBeingDragged ? 'dragging-item' : ''} ${isDragOver ? 'drag-over-target-indicator' : ''} ${allowActions && !isEditingCurrentEntry ? 'drag-handle' : 'cursor-default'}`}
      aria-roledescription={allowActions && !isEditingCurrentEntry ? "Draggable item" : undefined}
      role="article" 
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(e); }}
    >
      {isEditingCurrentEntry ? (
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <div>
            <label htmlFor={`edit-title-${id}`} className={labelClass}>Title</label>
            <input id={`edit-title-${id}`} type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={inputBaseClass} aria-label="Edit title" />
          </div>
          <div>
            <label htmlFor={`edit-details-${id}`} className={labelClass}>Details</label>
            <textarea id={`edit-details-${id}`} value={editDetails} onChange={(e) => setEditDetails(e.target.value)} rows={3} className={inputBaseClass} placeholder="Edit details..." aria-label="Edit details" />
          </div>
          <div>
            <label htmlFor={`edit-dueDate-${id}`} className={labelClass}>Due Date</label>
            <input id={`edit-dueDate-${id}`} type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className={inputBaseClass} aria-label="Edit due date" />
          </div>
          <div>
            <label htmlFor={`edit-contact-${id}`} className={labelClass}>Contact</label>
            <input id={`edit-contact-${id}`} type="text" value={editContact} onChange={(e) => setEditContact(e.target.value)} className={inputBaseClass} placeholder="Edit contact..." aria-label="Edit contact" />
          </div>
          <div>
            <label htmlFor={`edit-url-${id}`} className={labelClass}>URL</label>
            <input id={`edit-url-${id}`} type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className={inputBaseClass} placeholder="Edit URL..." aria-label="Edit URL" />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button onClick={handleCancel} className="px-3 py-1.5 text-sm font-medium text-[rgb(var(--button-secondary-text-color))] bg-[rgb(var(--button-secondary-bg-color))] hover:opacity-80 rounded-md transition-opacity">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1.5 text-sm font-medium text-[rgb(var(--accent-text-color))] bg-[rgb(var(--accent-color))] hover:bg-[rgb(var(--accent-color-hover))] rounded-md transition-colors">Save</button>
          </div>
        </div>
      ) : (
        <>
          {allowActions && (
            <div className="absolute top-1.5 right-1.5 flex items-center space-x-0.5 z-10">
              {onStartEdit && !isArchived && !isCompleted && (
                <ActionButton onClick={(e) => { e.stopPropagation(); onStartEdit(id);}} ariaLabel={`Edit ${type.toLowerCase()} ${title}`} title="Edit" className={actionIconColor}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </ActionButton>
              )}
              {type === EntryType.Note && onArchiveRequest && !isArchived && (
                 <ActionButton onClick={(e) => { e.stopPropagation(); onArchiveRequest(entry);}} ariaLabel={`Archive note ${title}`} title="Archive note" className={actionIconColor}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                 </ActionButton>
              )}
              {onDeleteRequest && ( 
                <ActionButton onClick={(e) => { e.stopPropagation(); onDeleteRequest(entry);}} ariaLabel={`Delete ${type.toLowerCase()} ${title}`} title="Delete" className={deleteIconColor}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </ActionButton>
              )}
            </div>
          )}

          <div className="flex items-start">
            {type === EntryType.Task && (onToggleComplete || onOpenCompletionNotesModal) && ( 
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => { 
                    e.stopPropagation(); 
                    if (!isCompleted && onOpenCompletionNotesModal) {
                        onOpenCompletionNotesModal(entry);
                    } else if (isCompleted && onToggleComplete) {
                        onToggleComplete(id); 
                    }
                }} 
                className="form-checkbox h-4 w-4 text-[rgb(var(--accent-color))] bg-transparent border-2 border-[rgb(var(--input-border-color))] rounded focus:ring-2 focus:ring-[rgb(var(--accent-color))] focus:ring-offset-0 mr-3 mt-0.5 cursor-pointer flex-shrink-0"
                aria-label={`Mark task ${title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                disabled={!allowActions && isCompleted}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className={`flex-grow min-w-0 ${allowActions ? 'pr-16 sm:pr-20' : ''}`}> 
              <h3 className={`text-base font-medium break-words ${titleColor}`}>
                {title}
              </h3>
              {isCompleted && !allowActions && createdAt && (
                   <p className={`text-xs ${dateColor} mt-0.5`}>Created: {formatDateShort(createdAt)}</p>
              )}
              {isArchived && !allowActions && archivedAt && (
                   <p className={`text-xs ${dateColor} mt-0.5`}>Archived: {formatArchivedAtDate(archivedAt)}</p>
              )}
            </div>
          </div>
          
          {dueDate && !isCompleted && !isArchived && (
            <div className="text-right mt-1">
              <p className="text-xs font-medium text-[rgb(var(--highlight-color))]">
                Due: {formatDueDate(dueDate)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EntryItem;
