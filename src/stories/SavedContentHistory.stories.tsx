import type { Meta, StoryObj } from '@storybook/react';
import SavedContentHistory from '../components/SavedContentHistory';
import { BookOpen, FileCode, Tag, Mail, Sparkles } from 'lucide-react';

const mockContentTypes = {
  'Service Brochures': {
    type: 'Service Brochures',
    icon: <BookOpen size={24} className="text-blue-600" />,
    title: 'Service Brochures',
    description: 'Generate professional service descriptions to showcase your rebranding expertise.'
  },
  'Detailed Case Studies': {
    type: 'Detailed Case Studies',
    icon: <FileCode size={24} className="text-purple-600" />,
    title: 'Case Studies',
    description: 'Create persuasive case studies highlighting successful rebranding projects.'
  },
  'Comprehensive Pricing Sheets': {
    type: 'Comprehensive Pricing Sheets',
    icon: <Tag size={24} className="text-green-600" />,
    title: 'Pricing Sheets',
    description: 'Build comprehensive pricing documents with packages and value propositions.'
  },
  'Complete Email Sequences': {
    type: 'Complete Email Sequences',
    icon: <Mail size={24} className="text-red-600" />,
    title: 'Email Sequences',
    description: 'Create 14-day email sequences to nurture leads and drive conversions.',
    hasMultipleDays: true,
    totalDays: 14
  },
  'Interactive Lead Magnets': {
    type: 'Interactive Lead Magnets',
    icon: <Sparkles size={24} className="text-amber-600" />,
    title: 'Lead Magnets',
    description: 'Generate valuable lead magnets to attract and capture potential clients.'
  }
};

const mockContentStorage = {
  'Service Brochures': {
    content: 'Mock content for Service Brochures',
    timestamp: Date.now() - 86400000 // 1 day ago
  },
  'Detailed Case Studies': {
    content: 'Mock content for Case Studies',
    timestamp: Date.now() - 3600000 // 1 hour ago
  },
  'Comprehensive Pricing Sheets': {
    content: 'Mock content for Pricing Sheets',
    timestamp: Date.now() - 7200000 // 2 hours ago
  }
};

const emptyContentStorage = {};

const meta = {
  title: 'Components/SavedContentHistory',
  component: SavedContentHistory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    contentStorage: { control: 'object' },
    contentTypes: { control: 'object' },
    onSelectContent: { action: 'contentSelected' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '700px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SavedContentHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithContent: Story = {
  args: {
    contentStorage: mockContentStorage,
    contentTypes: mockContentTypes,
    onSelectContent: (contentType) => console.log(`Content selected: ${contentType}`),
  },
};

export const Empty: Story = {
  args: {
    contentStorage: emptyContentStorage,
    contentTypes: mockContentTypes,
    onSelectContent: (contentType) => console.log(`Content selected: ${contentType}`),
  },
};