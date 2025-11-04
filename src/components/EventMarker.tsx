import React from 'react';
import { HistoricalEvent } from '../types';

interface EventMarkerProps {
  event: HistoricalEvent;
  position: number;
  zoom: number;
}

const IMAGE_ZOOM_THRESHOLD = 0.000000005; // pixels per millisecond

const EventMarker: React.FC<EventMarkerProps> = ({ event, position, zoom }) => {
  const showImage = zoom > IMAGE_ZOOM_THRESHOLD && event.imageUrl;

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
      style={{ left: `${position}px` }}
    >
      <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-900 cursor-pointer" />
      
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-800 border border-gray-600 rounded-lg p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
        <h4 className="font-bold">{event.title}</h4>
        <p className="text-gray-300">{new Date(event.date).toLocaleDateString()}</p>
        <p className="mt-1">{event.description}</p>
        {event.imageUrl && (
            <img src={event.imageUrl} alt={event.title} className="mt-2 rounded-md w-full h-auto object-cover" />
        )}
      </div>

      {showImage && (
        <div 
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-24 h-24 bg-cover bg-center rounded-md border-2 border-white shadow-lg pointer-events-none"
          style={{ backgroundImage: `url(${event.imageUrl})` }}
        />
      )}
    </div>
  );
};

export default EventMarker;
