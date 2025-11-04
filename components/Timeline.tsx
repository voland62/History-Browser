import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { History } from '../types';
import HistoryBand from './HistoryBand';
import TimelineRuler from './TimelineRuler';

interface TimelineProps {
  histories: History[];
  onEditHistory: (historyId: string) => void;
}

const MAX_ZOOM = 10; // pixels per millisecond

const Timeline: React.FC<TimelineProps> = ({ histories, onEditHistory }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const { minDateOverall, maxDateOverall } = useMemo(() => {
    const allEvents = histories.flatMap(h => h.events);
    if (allEvents.length === 0) {
      const now = new Date().getTime();
      const oneYear = 31536000000;
      return { minDateOverall: now - oneYear, maxDateOverall: now + oneYear };
    }
    const minDate = Math.min(...allEvents.map(e => e.date));
    const maxDate = Math.max(...allEvents.map(e => e.date));
    return { minDateOverall: minDate, maxDateOverall: maxDate };
  }, [histories]);

  const MIN_ZOOM = useMemo(() => {
    if (!containerWidth) return 0.0000001;
    const totalDuration = maxDateOverall - minDateOverall;
    if (totalDuration <= 0) return 1;
    // Calculate zoom to fit the entire history span within 95% of the view width for padding
    return (containerWidth * 0.95) / totalDuration;
  }, [containerWidth, minDateOverall, maxDateOverall]);
  
  const [view, setView] = useState(() => ({
    centerDate: (minDateOverall + maxDateOverall) / 2 || new Date('1000-01-01').getTime(),
    zoom: 0.0000000001, // Default zoom, will be adjusted in effect
  }));

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, date: 0 });

  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setContainerWidth(timelineRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (!initializedRef.current && containerWidth > 0 && maxDateOverall > minDateOverall) {
      const totalDuration = maxDateOverall - minDateOverall;
      const initialZoom = (containerWidth * 0.95) / totalDuration;
      setView(v => ({...v, zoom: initialZoom }));
      initializedRef.current = true;
    }
  }, [containerWidth, minDateOverall, maxDateOverall]);
  
  const dateToPixel = useCallback((date: number) => {
    const offsetFromCenter = (date - view.centerDate) * view.zoom;
    return containerWidth / 2 + offsetFromCenter;
  }, [view.centerDate, view.zoom, containerWidth]);

  const pixelToDate = useCallback((pixel: number) => {
    const offsetFromCenter = (pixel - containerWidth / 2) / view.zoom;
    return view.centerDate + offsetFromCenter;
  }, [view.centerDate, view.zoom, containerWidth]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, date: view.centerDate };
    e.currentTarget.style.cursor = 'grabbing';
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dTime = dx / view.zoom;
    setView(v => ({...v, centerDate: dragStartRef.current.date - dTime }));
  }, [isDragging, view.zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (timelineRef.current) {
      timelineRef.current.style.cursor = 'grab';
    }
  }, []);
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);


  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const newZoom = e.deltaY < 0 ? view.zoom * zoomFactor : view.zoom / zoomFactor;
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

    const mouseX = e.clientX - (timelineRef.current?.getBoundingClientRect().left || 0);
    const dateAtMouse = pixelToDate(mouseX);
    
    const newCenterDate = dateAtMouse - (mouseX - containerWidth / 2) / clampedZoom;

    setView({ zoom: clampedZoom, centerDate: newCenterDate });
  };
  
  const startDate = pixelToDate(0);
  const endDate = pixelToDate(containerWidth);
  const bandHeight = 40;
  const rulerHeight = 30;

  return (
    <div
      ref={timelineRef}
      className="flex-grow relative overflow-hidden cursor-grab select-none bg-gray-800/50"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
        <div className="relative w-full h-full">
          {histories.map((history, index) => (
            <HistoryBand
              key={history.id}
              history={history}
              bottom={rulerHeight + 10 + (histories.length - 1 - index) * bandHeight}
              dateToPixel={dateToPixel}
              startDate={startDate}
              endDate={endDate}
              zoom={view.zoom}
              onEditHistory={onEditHistory}
            />
          ))}
        </div>
      <TimelineRuler
        dateToPixel={dateToPixel}
        pixelToDate={pixelToDate}
        width={containerWidth}
        zoom={view.zoom}
      />
    </div>
  );
};

export default Timeline;