import React, { useState, useEffect, ChangeEvent } from 'react';
import { History, HistoricalEvent } from '../types';

interface HistoryEditorProps {
  history: History;
  onSave: (history: History) => void;
  onClose: () => void;
  isCreating: boolean;
}

const HistoryEditor: React.FC<HistoryEditorProps> = ({ history, onSave, onClose, isCreating }) => {
  const [editedHistory, setEditedHistory] = useState<History>(history);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '', imageUrl: '' });

  useEffect(() => {
    setEditedHistory(history);
  }, [history]);

  const handleHistoryNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedHistory({ ...editedHistory, name: e.target.value });
  };

  const handleNewEventChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewEvent({ ...newEvent, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert('Event title and date are required.');
      return;
    }
    const newHistoricalEvent: HistoricalEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      date: new Date(newEvent.date).getTime(),
      description: newEvent.description,
      imageUrl: newEvent.imageUrl || undefined,
    };
    setEditedHistory({
      ...editedHistory,
      events: [...editedHistory.events, newHistoricalEvent].sort((a,b) => a.date - b.date)
    });
    setNewEvent({ title: '', date: '', description: '', imageUrl: '' });
  };

  const handleRemoveEvent = (eventId: string) => {
    setEditedHistory({
        ...editedHistory,
        events: editedHistory.events.filter(e => e.id !== eventId)
    });
  }

  const handleSave = () => {
    onSave(editedHistory);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">{isCreating ? 'Create New History' : `Editing: ${history.name}`}</h2>
        </header>
        
        <main className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">History Name</label>
            <input
              type="text"
              value={editedHistory.name}
              onChange={handleHistoryNameChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Events</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {editedHistory.events.map(event => (
                <li key={event.id} className="bg-gray-700 p-2 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleRemoveEvent(event.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                </li>
              ))}
              {editedHistory.events.length === 0 && <p className="text-sm text-gray-500">No events yet.</p>}
            </ul>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Add New Event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="title" placeholder="Event Title" value={newEvent.title} onChange={handleNewEventChange} className="bg-gray-700 p-2 rounded"/>
              <input type="date" name="date" value={newEvent.date} onChange={handleNewEventChange} className="bg-gray-700 p-2 rounded"/>
              <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleNewEventChange} className="md:col-span-2 bg-gray-700 p-2 rounded h-20"/>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">Event Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              </div>
            </div>
             <button onClick={handleAddEvent} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Add Event
            </button>
          </div>
        </main>

        <footer className="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">
            Save History
          </button>
        </footer>
      </div>
    </div>
  );
};

export default HistoryEditor;
