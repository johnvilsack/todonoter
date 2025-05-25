

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Entry, EntryType, TabView } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import InputForm from './components/InputForm';
import Tabs from './components/Tabs';
import ActiveTaskList from './components/ActiveTaskList';
import NoteList from './components/NoteList';
import CompletedTaskList from './components/CompletedTaskList';
import ArchivedNoteList from './components/ArchivedNoteList';
import DetailModal from './components/DetailModal';
import AppBar from './components/AppBar';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import CompletionNotesModal from './components/CompletionNotesModal';
import ConfirmArchiveModal from './components/ConfirmArchiveModal'; 
import ExportOptionsModal from './components/ExportOptionsModal';

type ViewMode = 'main' | 'completed' | 'archived';

const App: React.FC = () => {
  const [entries, setEntries] = useLocalStorage<Entry[]>('task-notes-entries-v3', []); 
  const [activeTab, setActiveTab] = useState<TabView>(TabView.ActiveTasks);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); 
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState<Entry | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Entry | null>(null);

  const [isCompletionNotesModalOpen, setIsCompletionNotesModalOpen] = useState(false);
  const [taskForCompletionNotes, setTaskForCompletionNotes] = useState<Entry | null>(null);

  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false); 
  const [itemToArchive, setItemToArchive] = useState<Entry | null>(null); 

  const [isExportOptionsModalOpen, setIsExportOptionsModalOpen] = useState(false);

  const handleOpenDetailModal = (entry: Entry) => {
    setSelectedEntryForDetail(entry);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEntryForDetail(null);
  };

  const requestDeleteConfirmation = (entry: Entry) => {
    setItemToDelete(entry);
    setIsDeleteConfirmOpen(true);
  };

  const cancelDeleteConfirmation = () => {
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const confirmDeleteEntry = useCallback(() => {
    if (!itemToDelete) return;
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== itemToDelete.id));
    if (editingNoteId === itemToDelete.id) setEditingNoteId(null);
    if (editingTaskId === itemToDelete.id) setEditingTaskId(null);
    if(selectedEntryForDetail?.id === itemToDelete.id) handleCloseDetailModal();
    cancelDeleteConfirmation();
  }, [setEntries, editingNoteId, editingTaskId, selectedEntryForDetail, itemToDelete]);


  const handleOpenCompletionNotesModal = (task: Entry) => {
    setTaskForCompletionNotes(task);
    setIsCompletionNotesModalOpen(true);
  };

  const handleCloseCompletionNotesModal = () => {
    setIsCompletionNotesModalOpen(false);
    setTaskForCompletionNotes(null);
  };

  const handleSaveCompletionNotes = useCallback((notes: string) => {
    if (!taskForCompletionNotes) return;
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === taskForCompletionNotes.id && entry.type === EntryType.Task
          ? { 
              ...entry, 
              isCompleted: true, 
              completedAt: new Date().toISOString(),
              completionNotes: notes.trim() || undefined 
            }
          : entry
      )
    );
    if (selectedEntryForDetail?.id === taskForCompletionNotes.id) {
        setSelectedEntryForDetail(prev => prev ? {
            ...prev, 
            isCompleted: true, 
            completedAt: new Date().toISOString(),
            completionNotes: notes.trim() || undefined
        } : null);
    }
    handleCloseCompletionNotesModal();
  }, [setEntries, taskForCompletionNotes, selectedEntryForDetail]);

  const requestArchiveConfirmation = (entry: Entry) => { 
    setItemToArchive(entry);
    setIsArchiveConfirmOpen(true);
  };

  const cancelArchiveConfirmation = () => { 
    setIsArchiveConfirmOpen(false);
    setItemToArchive(null);
  };

  const confirmArchiveNote = useCallback(() => { 
    if (!itemToArchive) return;
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === itemToArchive.id && entry.type === EntryType.Note
          ? { ...entry, isArchived: !entry.isArchived, archivedAt: !entry.isArchived ? new Date().toISOString() : undefined }
          : entry
      )
    );
    if (editingNoteId === itemToArchive.id) setEditingNoteId(null);
    if (selectedEntryForDetail?.id === itemToArchive.id) {
        setSelectedEntryForDetail(prev => prev ? {...prev, isArchived: !prev.isArchived, archivedAt: !prev.isArchived ? new Date().toISOString() : undefined} : null);
    }
    cancelArchiveConfirmation();
  }, [setEntries, editingNoteId, selectedEntryForDetail, itemToArchive]);


  const addEntry = useCallback((title: string, details: string, type: EntryType, dueDate?: string, contact?: string, url?: string) => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      title,
      details: details || undefined,
      type,
      createdAt: new Date().toISOString(),
      isCompleted: false,
      isArchived: false,
      dueDate: dueDate || undefined,
      contact: contact || undefined,
      url: url || undefined,
      completionNotes: undefined,
    };
    setEntries(prevEntries => [newEntry, ...prevEntries]);
    if (type === EntryType.Task) setActiveTab(TabView.ActiveTasks);
    else if (type === EntryType.Note) setActiveTab(TabView.Notes);
    setViewMode('main'); 
    setEditingNoteId(null); 
    setEditingTaskId(null);
  }, [setEntries]);

  const toggleTaskCompletion = useCallback((id: string, notes?: string) => { 
    setEntries(prevEntries =>
      prevEntries.map(entry => {
        if (entry.id === id && entry.type === EntryType.Task) {
          const nowCompleted = !entry.isCompleted;
          return { 
            ...entry, 
            isCompleted: nowCompleted, 
            completedAt: nowCompleted ? new Date().toISOString() : undefined,
            completionNotes: nowCompleted && notes ? notes : (nowCompleted && entry.completionNotes ? entry.completionNotes : (nowCompleted === false ? undefined : entry.completionNotes)) 
          };
        }
        return entry;
      })
    );
    if (selectedEntryForDetail?.id === id) {
        setSelectedEntryForDetail(prev => {
          if (!prev) return null;
          const nowCompleted = !prev.isCompleted;
          return {
            ...prev, 
            isCompleted: nowCompleted, 
            completedAt: nowCompleted ? new Date().toISOString() : undefined,
            completionNotes: nowCompleted && notes ? notes : (nowCompleted && prev.completionNotes ? prev.completionNotes : (nowCompleted === false ? undefined : prev.completionNotes))
          };
        });
    }
  }, [setEntries, selectedEntryForDetail]);


  const handleStartEdit = useCallback((id: string, type: EntryType) => {
    handleCloseDetailModal(); 
    if (type === EntryType.Note) {
      setEditingNoteId(id);
      setEditingTaskId(null);
    } else if (type === EntryType.Task) {
      setEditingTaskId(id);
      setEditingNoteId(null);
    }
  }, []);

  const handleSaveEdit = useCallback((id: string, newTitle: string, newDetails: string, newDueDate?: string, newContact?: string, newUrl?: string) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id
          ? { 
              ...entry, 
              title: newTitle, 
              details: newDetails.trim() || undefined,
              dueDate: newDueDate || undefined,
              contact: newContact?.trim() || undefined,
              url: newUrl?.trim() || undefined
            }
          : entry
      )
    );
    setEditingNoteId(null);
    setEditingTaskId(null);
  }, [setEntries]);

  const handleCancelEdit = useCallback(() => { 
    setEditingNoteId(null); 
    setEditingTaskId(null);
  }, []);


  const handleDragStart = useCallback((id: string, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', id); } catch (error) { console.warn("setData failed", error); }
    document.body.classList.add('is-grabbing');
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItemId(null);
    document.body.classList.remove('is-grabbing');
  }, []);
  
  const handleDrop = useCallback((targetId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const localDraggedItemId = draggedItemId || e.dataTransfer.getData('text/plain');

    const cleanup = () => {
        if (draggedItemId !== null) setDraggedItemId(null); 
        if (document.body.classList.contains('is-grabbing')) document.body.classList.remove('is-grabbing');
    };

    if (!localDraggedItemId || localDraggedItemId === targetId) {
      cleanup();
      return;
    }

    setEntries(currentEntries => {
      const entriesCopy = [...currentEntries];
      const draggedIdx = entriesCopy.findIndex(entry => entry.id === localDraggedItemId);
      const targetIdx = entriesCopy.findIndex(entry => entry.id === targetId);

      if (draggedIdx === -1 || targetIdx === -1) return currentEntries;
      
      const draggedEntry = entriesCopy[draggedIdx];
      const targetEntry = entriesCopy[targetIdx];

      if (draggedEntry.type !== targetEntry.type || 
          draggedEntry.isArchived !== targetEntry.isArchived ||
          (draggedEntry.type === EntryType.Task && draggedEntry.isCompleted !== targetEntry.isCompleted)) {
        return currentEntries; 
      }

      const [movedItem] = entriesCopy.splice(draggedIdx, 1);
      const finalTargetIdx = entriesCopy.findIndex(entry => entry.id === targetId); 
      entriesCopy.splice(finalTargetIdx, 0, movedItem); 
      return entriesCopy;
    });
    cleanup();
  }, [draggedItemId, setEntries]);

  const openExportOptionsModal = useCallback(() => {
    if (entries.length === 0) {
      alert("No data to export.");
      return;
    }
    setIsExportOptionsModalOpen(true);
  }, [entries]);

  const closeExportOptionsModal = useCallback(() => {
    setIsExportOptionsModalOpen(false);
  }, []);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getTimestampedFilename = (base: string, extension: string): string => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    return `${base}-${timestamp}.${extension}`;
  };

  const handleExportJSON = useCallback(() => {
    if (entries.length === 0) return;
    const jsonData = JSON.stringify(entries, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    triggerDownload(blob, getTimestampedFilename('task-notes-organizer-export', 'json'));
    closeExportOptionsModal();
  }, [entries, closeExportOptionsModal]);
  
  const escapeCSVField = (field: any): string => {
    if (field === null || typeof field === 'undefined') {
      return '';
    }
    let stringField = String(field);
    if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r')) {
      stringField = stringField.replace(/"/g, '""'); // Escape double quotes
      return `"${stringField}"`; // Enclose in double quotes
    }
    return stringField;
  };

  const convertToCSV = (data: Entry[]): string => {
    if (!data || data.length === 0) return '';
    const headers: (keyof Entry)[] = [
      'id', 'title', 'details', 'type', 'createdAt', 'isCompleted', 'completedAt',
      'completionNotes', 'dueDate', 'contact', 'url', 'isArchived', 'archivedAt'
    ];
    const csvRows = [
      headers.join(','), 
      ...data.map(entry =>
        headers.map(headerKey =>
          escapeCSVField(entry[headerKey])
        ).join(',')
      )
    ];
    return csvRows.join('\n');
  };

  const handleExportCSV = useCallback(() => {
    if (entries.length === 0) return;
    const csvData = convertToCSV(entries);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, getTimestampedFilename('task-notes-organizer-export', 'csv'));
    closeExportOptionsModal();
  }, [entries, closeExportOptionsModal]);


  const activeTasks = useMemo(() => entries.filter(entry => entry.type === EntryType.Task && !entry.isCompleted), [entries]);
  const activeNotes = useMemo(() => entries.filter(entry => entry.type === EntryType.Note && !entry.isArchived), [entries]);
  const completedTasks = useMemo(() => entries.filter(entry => entry.type === EntryType.Task && entry.isCompleted)
    .sort((a,b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()), [entries]);
  const archivedNotes = useMemo(() => entries.filter(entry => entry.type === EntryType.Note && entry.isArchived)
    .sort((a,b) => new Date(b.archivedAt || 0).getTime() - new Date(a.archivedAt || 0).getTime()), [entries]);


  const renderCurrentTabView = () => {
    switch (activeTab) {
      case TabView.ActiveTasks:
        return <ActiveTaskList 
                  tasks={activeTasks} 
                  onToggleComplete={(id) => { 
                      toggleTaskCompletion(id); 
                  }}
                  onDeleteRequest={requestDeleteConfirmation}
                  editingTaskId={editingTaskId}
                  onStartEditTask={(id) => handleStartEdit(id, EntryType.Task)}
                  onSaveTaskEdit={handleSaveEdit}
                  onCancelEditTask={handleCancelEdit}
                  onOpenDetailModal={handleOpenDetailModal}
                  onOpenCompletionNotesModal={handleOpenCompletionNotesModal} 
                  draggedItemId={draggedItemId} 
                  onDragStartHandler={handleDragStart} 
                  onDropHandler={handleDrop} 
                  onDragEndHandler={handleDragEnd} 
                />;
      case TabView.Notes:
        return <NoteList 
                  notes={activeNotes} 
                  onDeleteRequest={requestDeleteConfirmation}
                  onArchiveRequest={requestArchiveConfirmation} 
                  editingNoteId={editingNoteId} 
                  onStartEdit={(id) => handleStartEdit(id, EntryType.Note)}
                  onSaveEdit={handleSaveEdit} 
                  onCancelEdit={handleCancelEdit} 
                  onOpenDetailModal={handleOpenDetailModal} 
                  draggedItemId={draggedItemId} 
                  onDragStartHandler={handleDragStart} 
                  onDropHandler={handleDrop} 
                  onDragEndHandler={handleDragEnd} 
                />;
      default: return null;
    }
  };

  const mainViewButtonClass = "w-full mt-0 first:mt-0 py-2.5 px-4 border-t border-[rgb(var(--divider-color))] text-sm font-medium text-[rgb(var(--text-secondary))] bg-[rgb(var(--card-bg-color))] hover:bg-[rgba(var(--accent-color),0.1)] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent-color))] transition-colors duration-150";
  const footerButtonClass = "px-3 py-1.5 text-xs font-medium text-[rgb(var(--accent-color))] bg-[rgba(var(--accent-color),0.15)] hover:bg-[rgba(var(--accent-color),0.25)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--accent-color))] focus:ring-offset-[rgb(var(--bg-color))] transition-colors duration-150 ease-in-out";

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-color))]">
      <AppBar title="Task & Notes Hub" />
      
      <main className="pt-4 pb-20 px-2 sm:px-4 lg:px-6"> 
        <div className="max-w-2xl mx-auto">
          <InputForm onAddEntry={addEntry} /> 

          {viewMode === 'main' && (
            <>
              <div className="bg-[rgb(var(--card-bg-color))] shadow-lg rounded-lg"> 
                <Tabs activeTab={activeTab} onTabChange={tab => { handleCancelEdit(); setActiveTab(tab); }} activeTaskCount={activeTasks.length} noteCount={activeNotes.length} />
                <div className="p-3 sm:p-4 min-h-[250px]">
                  {renderCurrentTabView()}
                </div>
                {completedTasks.length > 0 && (
                  <button onClick={() => setViewMode('completed')} className={`${mainViewButtonClass} rounded-b-lg`}>View Completed Tasks</button>
                )}
                {archivedNotes.length > 0 && (
                  <button onClick={() => setViewMode('archived')} className={`${mainViewButtonClass} ${completedTasks.length === 0 ? 'rounded-b-lg' : 'rounded-none border-t'}`}>View Archived Notes</button>
                )}
              </div>
            </>
          )}

          {viewMode === 'completed' && (
            <div className="bg-[rgb(var(--card-bg-color))] shadow-lg rounded-lg p-3 sm:p-4 mt-6">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[rgb(var(--divider-color))]">
                <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Completed Tasks</h2>
                <button onClick={() => setViewMode('main')} className={`${footerButtonClass} !text-xs`}>&larr; Back</button>
              </div>
              <CompletedTaskList tasks={completedTasks} onOpenDetailModal={handleOpenDetailModal} />
            </div>
          )}
          {viewMode === 'archived' && (
            <div className="bg-[rgb(var(--card-bg-color))] shadow-lg rounded-lg p-3 sm:p-4 mt-6">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[rgb(var(--divider-color))]">
                <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Archived Notes</h2>
                <button onClick={() => setViewMode('main')} className={`${footerButtonClass} !text-xs`}>&larr; Back</button>
              </div>
              <ArchivedNoteList notes={archivedNotes} onOpenDetailModal={handleOpenDetailModal} />
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-[rgb(var(--bg-color))] border-t border-[rgb(var(--divider-color))] p-3 text-xs text-center text-[rgb(var(--text-secondary))] mt-8">
         <button onClick={openExportOptionsModal} className={`${footerButtonClass} !text-xs`}>Export All Data</button>
         <p className="mt-1.5 opacity-75">&copy; 2025 John Vilsack</p>
      </footer>

      {isDetailModalOpen && selectedEntryForDetail && (
        <DetailModal 
            entry={selectedEntryForDetail} 
            onClose={handleCloseDetailModal} 
            onToggleComplete={(id) => { 
                toggleTaskCompletion(id);
            }}
            onDeleteRequest={requestDeleteConfirmation}
            onArchiveRequest={requestArchiveConfirmation} 
            onStartEdit={handleStartEdit}
            onOpenCompletionNotesModal={handleOpenCompletionNotesModal}
        />
      )}
      {isDeleteConfirmOpen && itemToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteConfirmOpen}
          onClose={cancelDeleteConfirmation}
          onConfirm={confirmDeleteEntry}
          itemName={itemToDelete.title}
        />
      )}
      {isCompletionNotesModalOpen && taskForCompletionNotes && (
        <CompletionNotesModal
          isOpen={isCompletionNotesModalOpen}
          onClose={() => { 
            if (taskForCompletionNotes && !taskForCompletionNotes.isCompleted) { 
                 handleSaveCompletionNotes(''); 
            } else {
                 handleCloseCompletionNotesModal(); 
            }
          }}
          onSave={handleSaveCompletionNotes}
          taskTitle={taskForCompletionNotes.title}
        />
      )}
      {isArchiveConfirmOpen && itemToArchive && ( 
        <ConfirmArchiveModal
          isOpen={isArchiveConfirmOpen}
          onClose={cancelArchiveConfirmation}
          onConfirm={confirmArchiveNote}
          itemName={itemToArchive.title}
          isArchiving={!itemToArchive.isArchived} 
        />
      )}
      {isExportOptionsModalOpen && (
        <ExportOptionsModal
          isOpen={isExportOptionsModalOpen}
          onClose={closeExportOptionsModal}
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
        />
      )}
    </div>
  );
};

export default App;
