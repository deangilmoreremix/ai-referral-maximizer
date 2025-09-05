import React, { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

// Define relationship type categories
const RELATIONSHIP_CATEGORIES = {
  'Education': 'Education-Based Connections',
  'Family': 'Family Connections',
  'Activity': 'Activity-Based Connections', 
  'Professional': 'Professional Connections',
  'Community': 'Community Connections',
  'Second-Degree': 'Second-Degree Connections',
  'Service': 'Service-Based Connections'
};

// Define relationship types grouped by category
const RELATIONSHIP_TYPES = {
  // Education-Based Connections
  'high-school': { name: 'High School Classmate', category: 'Education' },
  'middle-school': { name: 'Middle School Classmate', category: 'Education' },
  'elementary-school': { name: 'Elementary School Classmate', category: 'Education' },
  'college': { name: 'College/University Classmate', category: 'Education' },
  'graduate-school': { name: 'Graduate School Colleague', category: 'Education' },
  'school-club': { name: 'School Club/Organization Member', category: 'Education' },
  'fraternity-sorority': { name: 'Fraternity/Sorority Connection', category: 'Education' },
  'alumni': { name: 'Alumni Association Member', category: 'Education' },
  
  // Family Connections
  'immediate-family': { name: 'Immediate Family Member', category: 'Family' },
  'extended-family': { name: 'Extended Family', category: 'Family' },
  'cousin': { name: 'Cousin', category: 'Family' },
  'in-law': { name: 'In-Law', category: 'Family' },
  'step-family': { name: 'Step-Family Relation', category: 'Family' },
  'family-friend': { name: 'Family Friend', category: 'Family' },
  
  // Activity-Based Connections
  'sports-teammate': { name: 'Sports Teammate', category: 'Activity' },
  'gym': { name: 'Gym/Fitness Connection', category: 'Activity' },
  'hobby-group': { name: 'Hobby Group Member', category: 'Activity' },
  'religious-community': { name: 'Religious Community Member', category: 'Activity' },
  'volunteer': { name: 'Volunteer Group Connection', category: 'Activity' },
  
  // Professional Connections
  'current-colleague': { name: 'Current Colleague', category: 'Professional' },
  'former-colleague': { name: 'Former Colleague', category: 'Professional' },
  'professional-association': { name: 'Professional Association Member', category: 'Professional' },
  'conference': { name: 'Industry Conference Connection', category: 'Professional' },
  'mentor': { name: 'Mentor/Mentee Relationship', category: 'Professional' },
  
  // Community Connections
  'neighbor': { name: 'Neighbor', category: 'Community' },
  'parent-connection': { name: 'Parent Connection (Through Kids)', category: 'Community' },
  'local-community': { name: 'Local Community Group Member', category: 'Community' },
  
  // Second-Degree Connections
  'friend-of-friend': { name: 'Friend of a Friend', category: 'Second-Degree' },
  'spouses-network': { name: 'Spouse\'s/Partner\'s Network', category: 'Second-Degree' },
  'mutual-connection': { name: 'Introduced by Mutual Connection', category: 'Second-Degree' },
  
  // Service-Based Connections
  'client': { name: 'Client/Customer Relationship', category: 'Service' },
  'vendor': { name: 'Vendor Relationship', category: 'Service' },
  'service-provider': { name: 'Service Provider Relationship', category: 'Service' }
};

export type RelationshipType = keyof typeof RELATIONSHIP_TYPES;

interface RelationshipTypeSelectorProps {
  selectedRelationship: RelationshipType | null;
  onChange: (relationship: RelationshipType | null) => void;
  className?: string;
  label?: string;
}

const RelationshipTypeSelector: React.FC<RelationshipTypeSelectorProps> = ({
  selectedRelationship,
  onChange,
  className = '',
  label = 'Relationship Type'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get relationship name for display
  const getRelationshipName = () => {
    if (!selectedRelationship) return 'Select relationship type';
    return RELATIONSHIP_TYPES[selectedRelationship]?.name || selectedRelationship;
  };
  
  // Filter relationship types based on search term
  const filteredRelationships = Object.entries(RELATIONSHIP_TYPES).filter(([id, info]) => {
    if (!searchTerm) return true;
    return (
      info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Group relationship types by category
  const groupedRelationships = filteredRelationships.reduce((acc, [id, info]) => {
    if (!acc[info.category]) {
      acc[info.category] = [];
    }
    acc[info.category].push({ id, name: info.name });
    return acc;
  }, {} as Record<string, { id: string, name: string }[]>);
  
  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div
        className="mt-1 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <button
          type="button"
          className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
        >
          <span className="block truncate">
            {getRelationshipName()}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {/* Search box */}
            <div className="sticky top-0 z-10 bg-white px-2 py-1.5 border-b">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search relationships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchTerm('');
                    }}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
              
              {/* Clear selection button */}
              {selectedRelationship && (
                <button
                  type="button"
                  className="mt-1 w-full flex justify-center text-xs text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                    setIsOpen(false);
                  }}
                >
                  Clear selection
                </button>
              )}
            </div>

            {/* Group by category */}
            <ul className="py-1 divide-y divide-gray-200" role="listbox">
              {Object.entries(groupedRelationships).map(([category, relationships]) => (
                <li key={category} className="py-1">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                    {RELATIONSHIP_CATEGORIES[category as keyof typeof RELATIONSHIP_CATEGORIES] || category}
                  </div>
                  <ul>
                    {relationships.map(({ id, name }) => (
                      <li
                        key={id}
                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                          selectedRelationship === id ? 'bg-green-50 text-green-900' : 'text-gray-900'
                        }`}
                        role="option"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(id as RelationshipType);
                          setIsOpen(false);
                        }}
                      >
                        <span className="font-normal block truncate">
                          {name}
                        </span>
                        {selectedRelationship === id && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              
              {Object.keys(groupedRelationships).length === 0 && (
                <li className="py-4 px-3 text-sm text-gray-500 text-center">
                  No relationships found matching "{searchTerm}"
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationshipTypeSelector;