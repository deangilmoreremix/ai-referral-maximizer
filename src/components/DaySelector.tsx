import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DaySelectorProps {
  selectedDay: number;
  onDayChange: (day: number) => void;
  totalDays: number;
}

const DaySelector: React.FC<DaySelectorProps> = ({ 
  selectedDay,
  onDayChange,
  totalDays
}) => {
  const handlePreviousDay = () => {
    if (selectedDay > 1) {
      onDayChange(selectedDay - 1);
    }
  };

  const handleNextDay = () => {
    if (selectedDay < totalDays) {
      onDayChange(selectedDay + 1);
    }
  };

  const handleDaySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDayChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex items-center justify-between py-3 px-1 mb-4 border-b border-gray-200">
      <div className="flex items-center">
        <Calendar size={18} className="text-blue-600 mr-2" />
        <span className="text-gray-700 font-medium">14-Day Content Plan</span>
      </div>
      
      <div className="flex items-center">
        <button 
          onClick={handlePreviousDay}
          disabled={selectedDay <= 1}
          className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="mx-2 flex items-center">
          <span className="mr-2 text-sm text-gray-600">Day:</span>
          <select 
            value={selectedDay} 
            onChange={handleDaySelect}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleNextDay}
          disabled={selectedDay >= totalDays}
          className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default DaySelector;