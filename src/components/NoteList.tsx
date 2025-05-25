

import React from 'react';
import { Entry } from '../types';
import EntryItem from './EntryItem';

interface NoteListProps {
  notes: Entry[]; 
  onDeleteRequest: (entry: Entry) => void;
  onArchiveRequest: (entry: Entry) => void; // Updated from onArchive
  editingNoteId: string | null;
  onStartEdit: (id: string) => void;
  onSaveEdit: (id: string, title: string, details: string, dueDate?: string, contact?: string, url?: string) => void;
  onCancelEdit: (id: string) => void;
  onOpenDetailModal: (entry: Entry) => void;
  draggedItemId: string | null;
  onDragStartHandler: (id: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDropHandler: (targetId: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  onDeleteRequest,
  onArchiveRequest, // Updated prop name
  editingNoteId,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onOpenDetailModal,
  draggedItemId,
  onDragStartHandler,
  onDropHandler,
  onDragEndHandler,
}) => {
  if (notes.length === 0) {
    return <p className="text-center text-[rgb(var(--text-placeholder))] py-10">No active notes.</p>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <EntryItem
          key={note.id}
          entry={note}
          onDeleteRequest={onDeleteRequest}
          onArchiveRequest={onArchiveRequest} // Pass updated prop
          isEditing={editingNoteId === note.id} 
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          allowActions={true}
          onOpenDetailModal={onOpenDetailModal}
          draggedItemId={draggedItemId}
          onDragStartHandler={onDragStartHandler}
          onDropHandler={onDropHandler}
          onDragEndHandler={onDragEndHandler}
        />
      ))}
    </div>
  );
};

export default NoteList;
