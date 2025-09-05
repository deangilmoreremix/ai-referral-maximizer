import type { Meta, StoryObj } from '@storybook/react';
import PersonalizerModal from '../components/PersonalizerModal';

const meta = {
  title: 'Components/PersonalizerModal',
  component: PersonalizerModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
    onApply: { action: 'settingsApplied' },
  },
} satisfies Meta<typeof PersonalizerModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onApply: (industry, targetAudience, businessSize, specialRequirements) => {
      console.log('Settings applied:', { industry, targetAudience, businessSize, specialRequirements });
    },
  },
};

export const Hidden: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Modal closed'),
    onApply: (industry, targetAudience, businessSize, specialRequirements) => {
      console.log('Settings applied:', { industry, targetAudience, businessSize, specialRequirements });
    },
  },
};