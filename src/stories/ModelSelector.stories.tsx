import type { Meta, StoryObj } from '@storybook/react';
import ModelSelector from '../components/ModelSelector';

// Mock the getAvailableModels function
jest.mock('../services/edgeFunctionService', () => ({
  getAvailableModels: () => [
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Most powerful model with advanced reasoning" },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fast and efficient for most content needs" },
    { id: "gemini-2.0-flash-light", name: "Gemini 2.0 Flash Light", description: "Lightweight model for simple content" }
  ]
}));

const meta = {
  title: 'Components/ModelSelector',
  component: ModelSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedModel: { 
      control: 'select', 
      options: ['gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-light']
    },
    onModelChange: { action: 'modelChanged' },
  },
  decorators: [
    (Story) => (
      <div className="bg-white p-4 rounded-lg shadow" style={{ width: '700px' }}>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ModelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedModel: 'gemini-2.5-pro',
    onModelChange: (model) => console.log(`Model changed to ${model}`)
  },
};

export const FlashSelected: Story = {
  args: {
    selectedModel: 'gemini-2.0-flash',
    onModelChange: (model) => console.log(`Model changed to ${model}`)
  },
};

export const LightModelSelected: Story = {
  args: {
    selectedModel: 'gemini-2.0-flash-light',
    onModelChange: (model) => console.log(`Model changed to ${model}`)
  },
};