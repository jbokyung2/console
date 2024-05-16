import type { NewWidgetConfig } from '@/common/modules/widgets/types/widget-config-type';


const stackedColumnChart: NewWidgetConfig = {
    widget_name: 'stackedColumnChart',
    meta: {
        title: 'Stacked Column Chart',
        sizes: ['lg', 'full'],
        granularity: 'MONTHLY',
    },
    data_mapping_schema: {
        data_field_y: {
            label: 'Data Field (Y Axis)',
        },
        data_field_x: {
            label: 'Data Field (X Axis)',
            enable_granularity: true,
        },
    },
    chart_options_schema: {
        max_group_by: {
            type: 'number',
            label: 'Maximum number of Group By',
        },
        data_field_x_count: {
            type: 'number',
            label: 'Count of Data Field (X Axis)',
        },
    },
};


export default stackedColumnChart;
