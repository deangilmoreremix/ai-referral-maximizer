import type { Meta, StoryObj } from '@storybook/react';
import FeatureTooltip from '../components/FeatureTooltip';

const meta = {
  title: 'Components/FeatureTooltip',
  component: FeatureTooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    title: { control: 'text' },
    children: { control: 'text' },
    isDismissed: { control: 'boolean' },
    onDismiss: { action: 'dismissed' },
    position: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ margin: '100px', position: 'relative' }}>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Feature Button
        </button>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeatureTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TopPosition: Story = {
  args: {
    id: 'feature-1',
    title: 'Feature Title',
    children: 'This is a helpful tooltip that explains how to use this feature.',
    isDismissed: false,
    onDismiss: () => console.log('Tooltip dismissed'),
    position: 'top',
  },
};

export const RightPosition: Story = {
  args: {
    id: 'feature-2',
    title: 'Feature Title',
    children: 'This is a helpful tooltip that explains how to use this feature.',
    isDismissed: false,
    onDismiss: () => console.log('Tooltip dismissed'),
    position: 'right',
  },
};

export const BottomPosition: Story = {
  args: {
    id: 'feature-3',
    title: 'Feature Title',
    children: 'This is a helpful tooltip that explains how to use this feature.',
    isDismissed: false,
    onDismiss: () => console.log('Tooltip dismissed'),
    position: 'bottom',
  },
};

export const LeftPosition: Story = {
  args: {
    id: 'feature-4',
    title: 'Feature Title',
    children: 'This is a helpful tooltip that explains how to use this feature.',
    isDismissed: false,
    onDismiss: () => console.log('Tooltip dismissed'),
    position: 'left',
  },
};

export const Dismissed: Story = {
  args: {
    id: 'feature-5',
    title: 'Feature Title',
    children: 'This tooltip should not be visible because isDismissed is true.',
    isDismissed: true,
    onDismiss: () => console.log('Tooltip dismissed'),
    position: 'top',
  },
};