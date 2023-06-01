import type { WidgetConfig } from '@/services/dashboards/widgets/_configs/config';
import { GRANULARITY } from '@/services/dashboards/widgets/_configs/config';
import {
    getWidgetFilterOptionsSchema, getWidgetFilterSchemaPropertyNames,
} from '@/services/dashboards/widgets/_helpers/widget-schema-helper';

const complianceCheckStatusWidgetConfig: WidgetConfig = {
    widget_config_id: 'complianceCheckStatus',
    widget_component: () => ({
        component: import('@/services/dashboards/widgets/compliance-check-status/ComplianceCheckStatusWidget.vue'),
    }),
    title: 'Compliance Check Status',
    labels: ['Asset'],
    description: {
        // translation_id: 'DASHBOARDS.WIDGET.COST_MAP.DESC', // TODO: Add translation
        preview_image: 'widget-img_complianceCheckStatus--thumbnail.png',
    },
    scopes: ['WORKSPACE'],
    theme: {
        inherit: false,
    },
    sizes: ['md'],
    options: {
        granularity: GRANULARITY.ACCUMULATED,
    },
    options_schema: {
        default_properties: getWidgetFilterSchemaPropertyNames('provider', 'project', 'service_account', 'asset_compliance_type', 'asset_account'),
        schema: {
            type: 'object',
            properties: {
                ...getWidgetFilterOptionsSchema(
                    'project',
                    'service_account',
                    'provider',
                    'asset_compliance_type',
                    'asset_account',
                ),
            },
            order: getWidgetFilterSchemaPropertyNames(
                'project',
                'service_account',
                'provider',
                'asset_compliance_type',
                'asset_account',
            ),
        },
    },
};

export default complianceCheckStatusWidgetConfig;
