import type { Meta, StoryObj } from '@storybook/vue';
import type { ComponentProps } from 'vue-component-type-helpers';

import PDynamicLayout from '@/data-display/dynamic/dynamic-layout/PDynamicLayout.vue';
import { getDynamicLayoutItemArgTypes, getDynamicLayoutItemArgs } from '@/data-display/dynamic/dynamic-layout/templates/item/story-helper';
import { I18nConnector } from '@/translations';


type PDynamicLayoutPropsAndCustomArgs = ComponentProps<typeof PDynamicLayout>;

const meta : Meta<PDynamicLayoutPropsAndCustomArgs> = {
    title: 'Data Display/Dynamic/Dynamic Layout/- Item',
    component: PDynamicLayout,
    argTypes: {
        ...getDynamicLayoutItemArgTypes(),
    },
    args: {
        ...getDynamicLayoutItemArgs(),
    },
};

export default meta;
type Story = StoryObj<typeof PDynamicLayout>;


const Template: Story = {
    render: (args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { PDynamicLayout },
        i18n: I18nConnector.i18n,
        template: `
          <p-dynamic-layout :name="name" type="item"
                              :options="options"
                              :data="data"
                              :type-options="{
                                loading,
                                timezone
                              }"
                               class="w-full"
                >
            </p-dynamic-layout>
        `,
    }),
};

export const Playground: Story = {
    ...Template,
};
