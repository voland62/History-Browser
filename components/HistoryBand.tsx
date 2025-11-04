import React from 'react';
import { History } from '../types';
import EventMarker from './EventMarker';

interface HistoryBandProps {
  history: History;
  bottom: number;
  dateToPixel: (date: number) => number;
  startDate: number;
  endDate: number;
  zoom: number;
  onEditHistory: (historyId: string) => void;
}

const HistoryBand: React.FC<HistoryBandProps> = ({ history, bottom, dateToPixel, startDate, endDate, zoom, onEditHistory }) => {
  const visibleEvents = history.events.filter(event => event.date >= startDate && event.date <= endDate);

  return (
    <div
      className="absolute w-full"
      style={{ bottom: `${bottom}px` }}
    >
      <div className={`h-[30px] ${history.color} border-t border-b flex items-center group`}>
        <h3 className="text-sm font-semibold pl-2 sticky left-2 bg-gray-900/50 backdrop-blur-sm px-2 py-1 rounded">
          {history.name}
          <button 
            onClick={() => onEditHistory(history.id)} 
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-700 hover:bg-gray-600 px-1 rounded"
          >
            Edit
          </button>
        </h3>
        {visibleEvents.map(event => (
          <EventMarker
            key={event.id}
            event={event}
            position={dateToPixel(event.date)}
            zoom={zoom}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(HistoryBand);