import React, { useState, useEffect, useRef } from 'react';
import { Layers, Clock, Users, Heart } from 'lucide-react';

interface Statistic {
  id: string;
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
  color?: string;
  startOnScroll?: boolean;
}

interface StatisticsCounterProps {
  stats: Statistic[];
  startOnScroll?: boolean;
}

const StatisticsCounter: React.FC<StatisticsCounterProps> = ({ 
  stats, 
  startOnScroll = true 
}) => {
  const [shouldStart, setShouldStart] = useState(!startOnScroll);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Initialize counts
  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    stats.forEach(stat => {
      initialCounts[stat.id] = 0;
    });
    setCounts(initialCounts);
  }, [stats]);
  
  // Set up intersection observer for scroll animation
  useEffect(() => {
    if (!startOnScroll) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShouldStart(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [startOnScroll]);
  
  // Animate counters
  useEffect(() => {
    if (!shouldStart || hasAnimated) return;
    
    stats.forEach(stat => {
      const duration = stat.duration || 2000; // Default duration 2 seconds
      const increment = stat.value / (duration / 16); // Update every 16ms (60fps)
      let currentValue = 0;
      
      const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= stat.value) {
          currentValue = stat.value;
          clearInterval(timer);
        }
        
        setCounts(prev => ({
          ...prev,
          [stat.id]: Math.floor(currentValue)
        }));
      }, 16);
      
      return () => clearInterval(timer);
    });
    
    setHasAnimated(true);
  }, [shouldStart, stats, hasAnimated]);
  
  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'indigo': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'green': return 'text-green-600 bg-green-50 border-green-100';
      case 'red': return 'text-red-600 bg-red-50 border-red-100';
      case 'amber': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };
  
  const getIconForStat = (stat: Statistic) => {
    switch (stat.id) {
      case 'contentTypes':
        return <Layers size={18} className="mr-2" />;
      case 'timeReduction':
        return <Clock size={18} className="mr-2" />;
      case 'users':
        return <Users size={18} className="mr-2" />;
      case 'satisfaction':
        return <Heart size={18} className="mr-2" />;
      default:
        return null;
    }
  };
  
  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(stat => {
        const colorClasses = getColorClass(stat.color);
        const icon = getIconForStat(stat);
        
        return (
          <div 
            key={stat.id} 
            className={`rounded-xl border p-4 text-center hover-lift transition-all duration-300 ${colorClasses}`}
          >
            <div className="flex flex-col items-center">
              <div className={`text-3xl md:text-4xl font-bold animate-number-counter flex items-center justify-center ${colorClasses.split(' ')[0]}`}>
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span>{counts[stat.id] || 0}{stat.suffix || ''}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCounter;