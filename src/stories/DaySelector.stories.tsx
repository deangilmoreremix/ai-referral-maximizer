import type { Meta, StoryObj } from '@storybook/react';
import DaySelector from '../components/DaySelector';

const meta = {
  title: 'Components/DaySelector',
  component: DaySelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedDay: { control: { type: 'number', min: 1, max: 14 } },
    totalDays: { control: { type: 'number', min: 1, max: 30 } },
    onDayChange: { action: 'dayChanged' }
  },
} satisfies Meta<typeof DaySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedDay: 1,
    onDayChange: (day) => console.log(`Day changed to ${day}`),
    totalDays: 14,
  },
};

export const MidPoint: Story = {
  args: {
    selectedDay: 7,
    onDayChange: (day) => console.log(`Day changed to ${day}`),
    totalDays: 14,
  },
};

export const LastDay: Story = {
  args: {
    selectedDay: 14,
    onDayChange: (day) => console.log(`Day changed to ${day}`),
    totalDays: 14,
  },
};

export const CustomDayCount: Story = {
  args: {
    selectedDay: 3,
    onDayChange: (day) => console.log(`Day changed to ${day}`),
    totalDays: 7,
  },
};