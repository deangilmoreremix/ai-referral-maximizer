import type { Meta, StoryObj } from '@storybook/react';
import OnboardingTour from '../components/OnboardingTour';
import { OnboardingProvider } from '../components/OnboardingProvider';

// Create a mock app structure for the tour to target
const MockAppForTour = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 p-4">
    <header className="bg-white shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Enablement Resource Center</h1>
        <div className="flex space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-md history-button">History</button>
          <button className="px-3 py-2 border border-gray-300 rounded-md personalize-button">Personalize</button>
          <button className="px-3 py-2 border border-gray-300 rounded-md api-toggle-button">API Toggle</button>
        </div>
      </div>
    </header>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="col-span-1 content-type-section">
        <h2 className="text-lg font-medium mb-4">Select Content Type</h2>
        <div className="space-y-4">
          <div className="border rounded p-4">Content Card 1</div>
          <div className="border rounded p-4">Content Card 2</div>
          <div className="border rounded p-4">Content Card 3</div>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-2 content-preview-section">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-4">Content Preview</h2>
          <div className="model-selector-section bg-gray-50 p-4 mb-4">
            Model Selector Here
          </div>
          <div className="p-4 bg-gray-100 min-h-[300px]">Content will appear here</div>
        </div>
      </div>
    </div>
    
    {children}
  </div>
);

const meta = {
  title: 'Components/OnboardingTour',
  component: OnboardingTour,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isFirstVisit: { control: 'boolean' },
    onComplete: { action: 'tourCompleted' },
  },
  decorators: [
    (Story) => (
      <OnboardingProvider>
        <MockAppForTour>
          <Story />
        </MockAppForTour>
      </OnboardingProvider>
    ),
  ],
} satisfies Meta<typeof OnboardingTour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstVisit: Story = {
  args: {
    isFirstVisit: true,
    onComplete: () => console.log('Tour completed'),
  },
};

export const ReturningUser: Story = {
  args: {
    isFirstVisit: false,
    onComplete: () => console.log('Tour completed'),
  },
};