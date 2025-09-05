import type { Meta, StoryObj } from '@storybook/react';
import { BookOpen, FileCode, Tag } from 'lucide-react';
import App from '../App';

// Create a component that extracts the ContentCard from App
const ContentCard = (props: any) => {
  // This is a trick to extract and render just the ContentCard component
  // In a real-world scenario, you would refactor App.tsx to export ContentCard as a separate component
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-3">
          {props.icon}
          <h3 className="text-lg font-semibold ml-2 text-gray-800">{props.title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{props.description}</p>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t flex justify-between items-center">
        {props.lastGenerated ? (
          <span className="text-xs text-gray-500">{props.lastGenerated}</span>
        ) : (
          <span className="text-xs text-gray-500">
            {props.loading ? 'Generating...' : 'Click to generate'}
          </span>
        )}
        {props.hasMultipleDays && (
          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
            14-Day Plan
          </span>
        )}
      </div>
    </div>
  );
};

const meta = {
  title: 'Components/ContentCard',
  component: ContentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'object' },
    title: { control: 'text' },
    description: { control: 'text' },
    loading: { control: 'boolean' },
    lastGenerated: { control: 'text' },
    hasMultipleDays: { control: 'boolean' },
  },
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ServiceBrochure: Story = {
  args: {
    icon: <BookOpen size={24} className="text-blue-600" />,
    title: 'Service Brochures',
    description: 'Generate professional service descriptions to showcase your rebranding expertise.',
    loading: false,
    lastGenerated: '',
    hasMultipleDays: false,
  },
};

export const CaseStudy: Story = {
  args: {
    icon: <FileCode size={24} className="text-purple-600" />,
    title: 'Case Studies',
    description: 'Create persuasive case studies highlighting successful rebranding projects.',
    loading: false,
    lastGenerated: 'Last generated: 6/12/2025 at 10:45 AM',
    hasMultipleDays: false,
  },
};

export const EmailSequence: Story = {
  args: {
    icon: <Tag size={24} className="text-green-600" />,
    title: 'Email Sequences',
    description: 'Create 14-day email sequences to nurture leads and drive conversions.',
    loading: false,
    lastGenerated: '',
    hasMultipleDays: true,
  },
};

export const Loading: Story = {
  args: {
    icon: <BookOpen size={24} className="text-blue-600" />,
    title: 'Service Brochures',
    description: 'Generate professional service descriptions to showcase your rebranding expertise.',
    loading: true,
    lastGenerated: '',
    hasMultipleDays: false,
  },
};