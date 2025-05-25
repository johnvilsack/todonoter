import React from 'react';
import { Entry } from '../types';
import EntryItem from './EntryItem';

interface ActiveTaskListProps {
  tasks: Entry[];
  onToggleComplete: (id: string) => void; // For uncompleting
  onDeleteRequest: (entry: Entry) => void;
  editingTaskId: string | null;
  onStartEditTask: (id: string) => void;
  onSaveTaskEdit: (id: string, title: string, details: string, dueDate?: string, contact?: string, url?: string) => void;
  onCancelEditTask: (id: string) => void;
  onOpenDetailModal: (entry: Entry) => void;
  onOpenCompletionNotesModal: (task: Entry) => void; // For completing
  draggedItemId: string | null;
  onDragStartHandler: (id: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDropHandler: (targetId: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ActiveTaskList: React.FC<ActiveTaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onDeleteRequest,
  editingTaskId,
  onStartEditTask,
  onSaveTaskEdit,
  onCancelEditTask,
  onOpenDetailModal,
  onOpenCompletionNotesModal,
  draggedItemId,
  onDragStartHandler,
  onDropHandler,
  onDragEndHandler
}) => {
  if (tasks.length === 0) {
    return <p className="text-center text-[rgb(var(--text-placeholder))] py-10">No active tasks!</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <EntryItem
          key={task.id}
          entry={task}
          onToggleComplete={onToggleComplete}
          onDeleteRequest={onDeleteRequest}
          editingTaskId={editingTaskId} 
          onStartEdit={onStartEditTask} 
          onSaveEdit={onSaveTaskEdit}   
          onCancelEdit={onCancelEditTask} 
          allowActions={true}
          onOpenDetailModal={onOpenDetailModal}
          onOpenCompletionNotesModal={onOpenCompletionNotesModal}
          draggedItemId={draggedItemId}
          onDragStartHandler={onDragStartHandler}
          onDropHandler={onDropHandler}
          onDragEndHandler={onDragEndHandler}
        />
      ))}
    </div>
  );
};

export default ActiveTaskList;