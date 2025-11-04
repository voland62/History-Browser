import React, { useState, useCallback } from 'react';
import Timeline from './components/Timeline';
import Controls from './components/Controls';
import HistoryEditor from './components/HistoryEditor';
import { History, HistoricalEvent } from './types';
import { DEFAULT_HISTORIES, PREDEFINED_HISTORIES, COLORS } from './constants';

function App() {
  const [histories, setHistories] = useState<History[]>(DEFAULT_HISTORIES);
  const [editingHistory, setEditingHistory] = useState<History | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleAddHistory = useCallback((template: Omit<History, 'id' | 'events'>) => {
    const newHistory: History = {
      ...template,
      id: `${template.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
      events: [],
    };
    setHistories(prev => [...prev, newHistory]);
  }, []);

  const handleCreateNewHistory = useCallback(() => {
    const newHistory: History = {
      id: `new-history-${Date.now()}`,
      name: 'Untitled History',
      color: COLORS[histories.length % COLORS.length],
      events: [],
    };
    setIsCreatingNew(true);
    setEditingHistory(newHistory);
  }, [histories.length]);
  
  const handleEditHistory = useCallback((historyId: string) => {
    const historyToEdit = histories.find(h => h.id === historyId);
    if (historyToEdit) {
      setIsCreatingNew(false);
      setEditingHistory(historyToEdit);
    }
  }, [histories]);

  const handleSaveHistory = useCallback((updatedHistory: History) => {
    setHistories(prev => {
      const existing = prev.find(h => h.id === updatedHistory.id);
      if (existing) {
        return prev.map(h => h.id === updatedHistory.id ? updatedHistory : h);
      }
      return [...prev, updatedHistory];
    });
    setEditingHistory(null);
    setIsCreatingNew(false);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditingHistory(null);
    setIsCreatingNew(false);
  }, []);

  return (
    <div className="bg-gray-900 text-white w-screen h-screen overflow-hidden flex flex-col font-sans">
      <header className="absolute top-0 left-0 p-4 z-20">
        <h1 className="text-2xl font-bold tracking-wider text-white/90">Interactive History Timeline</h1>
      </header>
      <Controls
        predefinedHistories={PREDEFINED_HISTORIES}
        onAddHistory={handleAddHistory}
        onCreateNew={handleCreateNewHistory}
      />
      <Timeline histories={histories} onEditHistory={handleEditHistory} />
      {editingHistory && (
        <HistoryEditor
          history={editingHistory}
          onSave={handleSaveHistory}
          onClose={handleCloseEditor}
          isCreating={isCreatingNew}
        />
      )}
    </div>
  );
}

export default App;
