import type { Meta, StoryObj } from '@storybook/react';

import ImportPage from './ImportPage';

const meta: Meta<typeof ImportPage> = {
  component: ImportPage,
};

export default meta;

type Story = StoryObj<typeof ImportPage>;

export const Primary: Story = {};
