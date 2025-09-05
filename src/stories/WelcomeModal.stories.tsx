import type { Meta, StoryObj } from '@storybook/react';
import WelcomeModal from '../components/WelcomeModal';

const meta = {
  title: 'Components/WelcomeModal',
  component: WelcomeModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof WelcomeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Welcome modal closed'),
  },
};

export const Hidden: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Welcome modal closed'),
  },
};