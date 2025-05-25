
import React, { useState, useRef } from 'react';
import { EntryType } from '../types';

interface InputFormProps {
  onAddEntry: (title: string, details: string, type: EntryType, dueDate?: string, contact?: string, url?: string) => void;
}

const SegmentedControlButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ label, isActive, onClick, isFirst, isLast }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2.5 text-sm font-medium focus:outline-none focus:z-10 transition-colors duration-200 ease-in-out
        flex-1 
        ${isFirst ? 'rounded-l-md' : ''}
        ${isLast ? 'rounded-r-md' : ''}
        border 
        border-[rgb(var(--input-border-color))]
        ${!isActive && !isFirst && !isLast ? 'border-l-0' : ''}
        ${isActive
          ? 'bg-[rgb(var(--accent-color))] text-[rgb(var(--accent-text-color))]'
          : 'bg-transparent text-[rgb(var(--text-secondary))] hover:bg-[rgba(var(--accent-color),0.1)]'
        }
      `}
    >
      {label}
    </button>
  );
};


const InputForm: React.FC<InputFormProps> = ({ onAddEntry }) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState<EntryType>(EntryType.Task);
  const [showOptions, setShowOptions] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [contact, setContact] = useState('');
  const [url, setUrl] = useState('');
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleUrlBlur = () => {
    const currentUrl = urlInputRef.current?.value.trim();
    if (currentUrl && !currentUrl.match(/^(https?:\/\/)/i) && currentUrl.includes('.')) {
      const simpleDomainRegex = /^(?!https?:\/\/)([\w-]+\.)+[\w-]+(\/[\S]*)?$/i;
      if (simpleDomainRegex.test(currentUrl)) {
        setUrl(`https://${currentUrl}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title cannot be empty.');
      return;
    }
    
    handleUrlBlur(); 
    const finalUrl = urlInputRef.current?.value.trim(); 

    onAddEntry(title.trim(), details.trim(), type, dueDate || undefined, contact.trim() || undefined, finalUrl || undefined);
    setTitle('');
    setDetails('');
    setDueDate('');
    setContact('');
    setUrl(''); 
    if (urlInputRef.current) urlInputRef.current.value = ''; 
    setShowOptions(false); 
  };

  const inputBaseClass = "mt-1 block w-full px-3 py-2 bg-[rgb(var(--input-bg-color))] border border-[rgb(var(--input-border-color))] rounded-md shadow-sm focus:ring-1 focus:ring-[rgb(var(--accent-color))] focus:border-[rgb(var(--accent-color))] text-sm text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-placeholder))] transition-colors duration-150";
  const labelClass = "block text-xs font-medium text-[rgb(var(--text-secondary))] mb-0.5";
  const buttonBaseClass = "py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-transform transform hover:scale-[1.01] active:scale-[0.99] duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--card-bg-color)))]";
  const primaryButtonClass = `${buttonBaseClass} text-[rgb(var(--accent-text-color))] bg-[rgb(var(--accent-color))] hover:bg-[rgb(var(--accent-color-hover))] focus:ring-[rgb(var(--accent-color))]`;
  
  return (
    <div className="bg-[rgb(var(--card-bg-color))] p-3 sm:p-4 shadow-lg rounded-lg mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex rounded-md">
          <SegmentedControlButton
            label="Task"
            isActive={type === EntryType.Task}
            onClick={() => setType(EntryType.Task)}
            isFirst
          />
          <SegmentedControlButton
            label="Note"
            isActive={type === EntryType.Note}
            onClick={() => setType(EntryType.Note)}
            isLast
          />
        </div>

        <div className="relative">
          <label htmlFor="title" className="sr-only">Quick Entry / Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === EntryType.Task ? "New task..." : "New note title..."}
            className={`${inputBaseClass} pr-12`} // Adjusted padding for the styled button
            required
          />
          <button
            type="button"
            onClick={() => setShowOptions(prev => !prev)}
            className="absolute inset-y-0 right-0.5 top-0.5 bottom-0.5 flex items-center justify-center w-10 h-[calc(100%-0.25rem)] text-[rgb(var(--text-secondary))] bg-[rgb(var(--button-secondary-bg-color))] hover:bg-opacity-80 focus:bg-opacity-90 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent-color))] transition-colors"
            aria-label={showOptions ? "Hide additional options" : "Show additional options"}
            title={showOptions ? "Hide Options" : "Add Details"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {showOptions 
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> 
                : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> 
              }
            </svg>
          </button>
        </div>
        
        {showOptions && (
          <div className="space-y-3 transition-all duration-300 ease-in-out border-t border-[rgb(var(--divider-color))] pt-4">
            <div>
              <label htmlFor="details" className={labelClass}>Details</label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Add more details..."
                className={inputBaseClass}
              />
            </div>
            <div>
              <label htmlFor="dueDate" className={labelClass}>Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`${inputBaseClass} appearance-none`}
              />
            </div>
            <div>
              <label htmlFor="contact" className={labelClass}>Contact</label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Name, email, phone..."
                className={inputBaseClass}
              />
            </div>
            <div>
              <label htmlFor="url" className={labelClass}>URL (Optional)</label>
              <input
                ref={urlInputRef}
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="example.com or https://example.com"
                className={inputBaseClass}
              />
            </div>
          </div>
        )}
        
        <button
            type="submit"
            className={`${primaryButtonClass} w-full`}
        >
            Add {type === EntryType.Task ? 'Task' : 'Note'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
