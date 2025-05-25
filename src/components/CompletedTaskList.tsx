
import React from 'react';
import { Entry } from '../types';
import { getWeekOfYear, formatWeekDateRange } from '../utils/dateUtils';
import EntryItem from './EntryItem';

interface CompletedTaskListProps {
  tasks: Entry[];
  onOpenDetailModal: (entry: Entry) => void;
}

const CompletedTaskList: React.FC<CompletedTaskListProps> = ({ tasks, onOpenDetailModal }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-[rgb(var(--text-placeholder))] py-10">No completed tasks yet.</p>;
  }

  const groupedTasks: Record<string, Entry[]> = tasks.reduce((acc, task) => {
    if (task.completedAt) {
      const { week, year } = getWeekOfYear(task.completedAt);
      const weekRange = formatWeekDateRange(task.completedAt);
      const key = `Week ${week} ${weekRange}, ${year}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(task);
    }
    return acc;
  }, {} as Record<string, Entry[]>);
  
  const sortedGroupKeys = Object.keys(groupedTasks).sort((a, b) => {
    const matchA = a.match(/Week (\d+) .*?, (\d+)/);
    const matchB = b.match(/Week (\d+) .*?, (\d+)/);
    
    if (!matchA || !matchB) return 0;

    const yearA = parseInt(matchA[2]);
    const yearB = parseInt(matchB[2]);
    if (yearA !== yearB) return yearB - yearA; 

    const weekA = parseInt(matchA[1]);
    const weekB = parseInt(matchB[1]);
    return weekB - weekA; 
  });


  return (
    <div className="space-y-5">
      {sortedGroupKeys.map(groupKey => (
        <div key={groupKey}>
          <h3 className="text-md font-semibold text-[rgb(var(--text-secondary))] mb-2 pb-1 border-b border-[rgb(var(--divider-color))]">{groupKey}</h3>
          <div className="space-y-3">
            {groupedTasks[groupKey]
              .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()) 
              .map(task => (
                <EntryItem 
                  key={task.id} 
                  entry={task} 
                  allowActions={false} 
                  onOpenDetailModal={onOpenDetailModal}
                  draggedItemId={null} 
                  onDragStartHandler={() => {}}
                  onDropHandler={() => {}}
                  onDragEndHandler={() => {}}
                />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompletedTaskList;
