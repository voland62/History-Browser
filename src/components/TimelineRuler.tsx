import React from 'react';

interface TimelineRulerProps {
  dateToPixel: (date: number) => number;
  pixelToDate: (pixel: number) => number;
  width: number;
  zoom: number;
}

const MS_PER_YEAR = 31536000000;
const MS_PER_DAY = 86400000;
const MS_PER_HOUR = 3600000;

const MS_PER_THOUSAND_YEARS = MS_PER_YEAR * 1000;
const MS_PER_TEN_THOUSAND_YEARS = MS_PER_YEAR * 10000;
const MS_PER_HUNDRED_THOUSAND_YEARS = MS_PER_YEAR * 100000;


const TimelineRuler: React.FC<TimelineRulerProps> = ({ dateToPixel, pixelToDate, width, zoom }) => {
  if (width === 0) return null;

  const startDate = new Date(pixelToDate(0));
  const endDate = new Date(pixelToDate(width));
  const viewDuration = endDate.getTime() - startDate.getTime();

  let majorTickSpacing: number;
  let minorTickSpacing: number;
  let labelFormat: (date: Date) => string;

  const kiloYearFormatter = (date: Date) => {
    const year = date.getFullYear();
    const kiloYears = Math.round(Math.abs(year) / 1000);
    if (kiloYears === 0) return '1 CE';
    return year < 0 ? `${kiloYears}k BCE` : `${kiloYears}k CE`;
  };

  if (viewDuration > 50000 * MS_PER_YEAR) { // > 50k years
    majorTickSpacing = MS_PER_HUNDRED_THOUSAND_YEARS;
    minorTickSpacing = MS_PER_TEN_THOUSAND_YEARS;
    labelFormat = kiloYearFormatter;
  } else if (viewDuration > 5000 * MS_PER_YEAR) { // > 5k years
    majorTickSpacing = MS_PER_TEN_THOUSAND_YEARS;
    minorTickSpacing = MS_PER_THOUSAND_YEARS;
    labelFormat = kiloYearFormatter;
  } else if (viewDuration > 500 * MS_PER_YEAR) { // Centuries
    majorTickSpacing = MS_PER_THOUSAND_YEARS;
    minorTickSpacing = 100 * MS_PER_YEAR;
    labelFormat = date => date.getFullYear().toString();
  } else if (viewDuration > 50 * MS_PER_YEAR) { // Decades
    majorTickSpacing = 10 * MS_PER_YEAR;
    minorTickSpacing = MS_PER_YEAR;
    labelFormat = date => date.getFullYear().toString();
  } else if (viewDuration > 5 * MS_PER_YEAR) { // Years
    majorTickSpacing = MS_PER_YEAR;
    minorTickSpacing = MS_PER_YEAR / 4;
    labelFormat = date => date.getFullYear().toString();
  } else if (viewDuration > MS_PER_DAY * 90) { // Months
    majorTickSpacing = MS_PER_DAY * 30;
    minorTickSpacing = MS_PER_DAY * 7;
    labelFormat = date => date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  } else if (viewDuration > MS_PER_DAY * 7) { // Days
    majorTickSpacing = MS_PER_DAY;
    minorTickSpacing = MS_PER_DAY / 4;
    labelFormat = date => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } else if (viewDuration > MS_PER_HOUR * 12) { // Hours
    majorTickSpacing = MS_PER_HOUR;
    minorTickSpacing = MS_PER_HOUR / 4;
    labelFormat = date => date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } else { // Minutes
    majorTickSpacing = 60 * 1000 * 5;
    minorTickSpacing = 60 * 1000;
    labelFormat = date => date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const ticks = [];
  const startTickTime = Math.floor(startDate.getTime() / minorTickSpacing) * minorTickSpacing;

  for (let time = startTickTime; time < endDate.getTime(); time += minorTickSpacing) {
    const isMajor = time % majorTickSpacing === 0;
    const x = dateToPixel(time);
    if (x >= 0 && x <= width) {
      ticks.push({
        time,
        x,
        isMajor,
        label: isMajor ? labelFormat(new Date(time)) : null,
      });
    }
  }

  const centerTime = pixelToDate(width/2);
  const centerDate = new Date(centerTime);
  const centerLabel = centerDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  
  return (
    <div className="absolute bottom-0 left-0 w-full h-[30px] bg-gray-900/80 backdrop-blur-sm z-10 border-t border-gray-700">
      <svg width={width} height={30} className="w-full h-full">
        {ticks.map(tick => (
          <line
            key={tick.time}
            x1={tick.x}
            y1={tick.isMajor ? 10 : 15}
            x2={tick.x}
            y2={20}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
          />
        ))}
        {ticks.filter(t => t.isMajor).map(tick => (
          <text
            key={`label-${tick.time}`}
            x={tick.x + 4}
            y={15}
            fill="rgba(255,255,255,0.7)"
            fontSize="10"
          >
            {tick.label}
          </text>
        ))}
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-[30px] bg-red-500"></div>
      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
        {centerLabel}
      </div>
    </div>
  );
};

export default TimelineRuler;
