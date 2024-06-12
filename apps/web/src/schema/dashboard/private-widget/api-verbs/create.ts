import type { Tags } from '@/schema/_common/model';

import type { WidgetType } from '@/common/modules/widgets/types/widget-model';

export interface PrivateWidgetCreateParameters {
    dashboard_id: string;
    name?: string;
    description?: string;
    widget_type?: WidgetType;
    data_table_id?: string;
    options?: Record<string, any>;
    tags?: Tags;
}