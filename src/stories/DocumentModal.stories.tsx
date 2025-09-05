import type { Meta, StoryObj } from '@storybook/react';
import DocumentModal from '../components/DocumentModal';

const meta = {
  title: 'Components/DocumentModal',
  component: DocumentModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
    onDownload: { action: 'downloaded' },
    title: { control: 'text' },
    fileName: { control: 'text' },
    day: { control: { type: 'number', min: 1, max: 14 } },
    hasMultipleDays: { control: 'boolean' },
  },
} satisfies Meta<typeof DocumentModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onDownload: () => console.log('Document downloaded'),
    title: 'Service Brochure',
    fileName: 'service-brochure.pdf',
    hasMultipleDays: false,
  },
};

export const MultiDayContent: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onDownload: () => console.log('Document downloaded'),
    title: 'Email Sequence',
    fileName: 'email-sequence-day-3.pdf',
    day: 3,
    hasMultipleDays: true,
  },
};

export const Hidden: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Modal closed'),
    onDownload: () => console.log('Document downloaded'),
    title: 'Service Brochure',
    fileName: 'service-brochure.pdf',
    hasMultipleDays: false,
  },
};