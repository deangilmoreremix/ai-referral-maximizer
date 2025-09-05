import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleTouchStart = () => {
    setIsDragging(true);
  };
  
  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    
    // Constrain position between 0 and 100
    const constrainedPosition = Math.max(0, Math.min(100, position));
    setSliderPosition(constrainedPosition);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };
  
  const handleEnd = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Auto-animate slider on initial render
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      let position = 50;
      let direction = -1; // Start by moving left
      
      const interval = setInterval(() => {
        position += direction;
        
        // Change direction when reaching bounds
        if (position <= 30) {
          direction = 1;
        } else if (position >= 70) {
          direction = -1;
        }
        
        setSliderPosition(position);
      }, 20);
      
      // Stop animation after a few cycles
      setTimeout(() => {
        clearInterval(interval);
        setSliderPosition(50);
      }, 3000);
    }, 500);
    
    return () => {
      clearTimeout(initialDelay);
    };
  }, []);
  
  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 overflow-hidden rounded-lg shadow-md"
    >
      {/* Before Image (Full width) */}
      <div className="absolute inset-0">
        <img 
          src={beforeImage} 
          alt="Before" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          {beforeLabel}
        </div>
      </div>
      
      {/* After Image (Clipped based on slider position) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt="After" 
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ width: `${100 / (sliderPosition / 100)}%` }}
        />
        <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-70 text-white px-3 py-1 rounded text-sm">
          {afterLabel}
        </div>
      </div>
      
      {/* Slider Control */}
      <div 
        className="absolute top-0 bottom-0"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute inset-0 w-1 bg-white"></div>
      </div>
      
      <div
        className="absolute top-1/2 transform -translate-y-1/2 cursor-ew-resize z-10"
        style={{ left: `calc(${sliderPosition}% - 12px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-600"
          >
            <path d="M21 12H3M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
      
      {/* Text overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
        <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
          Generic content with limited appeal
        </div>
        <div className="bg-blue-600 bg-opacity-70 text-white px-3 py-1 rounded text-sm">
          Persuasive, personalized messaging
        </div>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black to-transparent opacity-20"></div>
    </div>
  );
};

export default ComparisonSlider;