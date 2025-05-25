
import React from 'react';
import { Entry } from '../types';
import EntryItem from './EntryItem';

interface ArchivedNoteListProps {
  notes: Entry[];
  onOpenDetailModal: (entry: Entry) => void;
}

const ArchivedNoteList: React.FC<ArchivedNoteListProps> = ({ notes, onOpenDetailModal }) => {
  if (notes.length === 0) {
    return <p className="text-center text-[rgb(var(--text-placeholder))] py-10">No archived notes.</p>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <EntryItem
          key={note.id}
          entry={note}
          allowActions={false} 
          onOpenDetailModal={onOpenDetailModal}
          draggedItemId={null}
          onDragStartHandler={() => {}}
          onDropHandler={() => {}}
          onDragEndHandler={() => {}}
        />
      ))}
    </div>
  );
};

export default ArchivedNoteList;
