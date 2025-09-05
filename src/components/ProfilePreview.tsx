import React from 'react';
import { User, MapPin, Briefcase, Building2, Clock, Award } from 'lucide-react';
import { 
  categorizeAndEnhanceSkills, 
  calculateProfileCompleteness,
  getCategoryColor
} from '../utils/profileAnalyzer';

interface ProfilePreviewProps {
  profileData: any;
  analysisResults?: any;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profileData, analysisResults }) => {
  if (!profileData && !analysisResults) return null;
  
  const data = analysisResults || profileData;
  const skillsData = data.skills ? categorizeAndEnhanceSkills(data.skills) : null;
  
  return (
    <div className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800">Profile Preview</h3>
        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {data.isComplete ? 'Complete Profile' : 'Basic Profile'}
        </div>
      </div>
      
      {/* Profile header with image and basic info */}
      <div className="flex mb-4">
        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mr-3">
          {data.profileImageUrl ? (
            <img src={data.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={24} className="text-gray-500" />
          )}
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900">{data.fullName || data.name || 'Professional Profile'}</h4>
          <p className="text-sm text-gray-600">{data.title || data.headline || ''}</p>
          
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
            {data.location && (
              <div className="flex items-center">
                <MapPin size={12} className="mr-1" />
                {data.location}
              </div>
            )}
            
            {(data.companyName || data.company) && (
              <div className="flex items-center">
                <Briefcase size={12} className="mr-1" />
                {data.companyName || data.company}
              </div>
            )}
            
            {data.industry && (
              <div className="flex items-center">
                <Building2 size={12} className="mr-1" />
                {data.industry}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile completeness meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-600 flex items-center">
            <Clock size={12} className="mr-1" />
            Profile Completeness
          </span>
          <span className="font-medium">{calculateProfileCompleteness(data)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${calculateProfileCompleteness(data)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Description if available */}
      {data.description && (
        <div className="mb-4 text-sm text-gray-700 border-l-2 border-blue-200 pl-3 py-1 italic">
          {data.description.length > 200 
            ? data.description.substring(0, 200) + '...' 
            : data.description}
        </div>
      )}
      
      {/* Skills section with visualization */}
      {skillsData && skillsData.enhancedSkills.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Award size={14} className="mr-1.5 text-blue-600" />
            Key Skills
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {skillsData.enhancedSkills.slice(0, 10).map((skill, index) => {
              // Use fixed classes for each category to avoid Tailwind class generation issues
              const getSkillClass = (category: string) => {
                const classes = {
                  technical: 'bg-blue-100 text-blue-800 border border-blue-200',
                  marketing: 'bg-purple-100 text-purple-800 border border-purple-200',
                  management: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
                  design: 'bg-pink-100 text-pink-800 border border-pink-200',
                  sales: 'bg-orange-100 text-orange-800 border border-orange-200',
                  finance: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
                  other: 'bg-gray-100 text-gray-800 border border-gray-200'
                };
                return classes[category as keyof typeof classes] || classes.other;
              };
              
              return (
                <div 
                  key={index} 
                  className={`text-xs rounded-full px-2 py-1 ${
                    skill.isMarketable 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : getSkillClass(skill.category)
                  }`}
                >
                  {skill.name}
                  {skill.endorsements > 0 && (
                    <span className="ml-1 bg-white text-gray-600 rounded-full text-xs px-1">
                      {skill.endorsements}
                    </span>
                  )}
                </div>
              );
            })}
            {skillsData.enhancedSkills.length > 10 && (
              <div className="text-xs text-gray-500 flex items-center">
                +{skillsData.enhancedSkills.length - 10} more
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Experience section - compact version */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-3">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Experience</h5>
          <div className="space-y-2">
            {data.experience.slice(0, 2).map((exp: any, index: number) => (
              <div key={index} className="text-xs pl-2 border-l-2 border-gray-200">
                <div className="font-medium">{exp.position || exp.title}</div>
                <div className="text-gray-600">{exp.company || exp.companyName}</div>
                <div className="text-gray-500">
                  {exp.startDate || exp.dateRange || ''}
                  {exp.endDate && ` - ${exp.endDate}`}
                  {exp.duration && !exp.dateRange && !exp.startDate && exp.duration}
                </div>
              </div>
            ))}
            {data.experience.length > 2 && (
              <div className="text-xs text-gray-500">
                +{data.experience.length - 2} more positions
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Industry insights */}
      {data.industryInsights && data.industryInsights.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <h5 className="text-sm font-medium text-gray-700 mb-1">Industry Insights</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            {data.industryInsights.slice(0, 2).map((insight: string, index: number) => (
              <li key={index} className="flex">
                <span className="text-blue-500 mr-1">•</span> {insight}
              </li>
            ))}
            {data.industryInsights.length > 2 && (
              <li className="text-xs text-gray-500 italic">
                +{data.industryInsights.length - 2} more insights available
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Display source of analysis at the bottom */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <div>
          {data.fileName ? `Analyzed document: ${data.fileName}` : 
           data.name ? `LinkedIn profile: ${data.name}` : 
           'Analysis results'}
        </div>
        <div>
          {data.meta?.analysisTimestamp ? new Date(data.meta.analysisTimestamp).toLocaleDateString() : 
           new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;