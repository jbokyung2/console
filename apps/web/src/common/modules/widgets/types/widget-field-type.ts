import type { DateRange } from '@/schema/dashboard/_types/dashboard-type';
import type { PrivateDataTableModel } from '@/schema/dashboard/private-data-table/model';
import type { PublicDataTableModel } from '@/schema/dashboard/public-data-table/model';

import type WidgetFieldValueManager from '@/common/modules/widgets/_widget-field-value-manager';
import type { FormatRulesOptions } from '@/common/modules/widgets/_widget-fields/advanced-format-rules/type';
import type { CategoryByOptions } from '@/common/modules/widgets/_widget-fields/category-by/type';
import type { _ColorSchemaOptions as ColorSchemaOptions } from '@/common/modules/widgets/_widget-fields/color-schema/type';
import type { ComparisonOptions } from '@/common/modules/widgets/_widget-fields/comparison/type';
import type { CustomTableColumnWidthOptions } from '@/common/modules/widgets/_widget-fields/custom-table-column-width/type';
import type { DataFieldHeatmapColorOptions } from '@/common/modules/widgets/_widget-fields/data-field-heatmap-color/type';
import type { DataFieldOptions } from '@/common/modules/widgets/_widget-fields/data-field/type';
import type { DateFormatOptions } from '@/common/modules/widgets/_widget-fields/date-format/type';
import type { DateRangeOptions } from '@/common/modules/widgets/_widget-fields/date-range/type';
import type { DisplaySeriesLabelOptions } from '@/common/modules/widgets/_widget-fields/display-series-label/type';
import type { GroupByOptions } from '@/common/modules/widgets/_widget-fields/group-by/type';
import type { IconOptions } from '@/common/modules/widgets/_widget-fields/icon/type';
import type { LegendOptions } from '@/common/modules/widgets/_widget-fields/legend/type';
import type { MaxOptions } from '@/common/modules/widgets/_widget-fields/max/type';
import type { MinOptions } from '@/common/modules/widgets/_widget-fields/min/type';
import type { MissingValueOptions } from '@/common/modules/widgets/_widget-fields/missing-value/type';
import type { NumberFormatOptions } from '@/common/modules/widgets/_widget-fields/number-format/type';
import type { PieChartTypeOptions } from '@/common/modules/widgets/_widget-fields/pie-chart-type/type';
import type { StackByOptions } from '@/common/modules/widgets/_widget-fields/stack-by/type';
import type { SubTotalOptions } from '@/common/modules/widgets/_widget-fields/sub-total/type';
import type { TableColumnWidthOptions } from '@/common/modules/widgets/_widget-fields/table-column-width/type';
import type { TextWrapOptions } from '@/common/modules/widgets/_widget-fields/text-wrap/type';
import type { TooltipNumberFormatOptions } from '@/common/modules/widgets/_widget-fields/tooltip-number-format/type';
import type { TotalOptions } from '@/common/modules/widgets/_widget-fields/total/type';
import type { WidgetHeightOptions } from '@/common/modules/widgets/_widget-fields/widget-height/type';
import type { XAxisOptions } from '@/common/modules/widgets/_widget-fields/x-axis/type';
import type { YAxisOptions } from '@/common/modules/widgets/_widget-fields/y-axis/type';
import type { WidgetConfig } from '@/common/modules/widgets/types/widget-config-type';
import type {
    WidgetFieldValues,
} from '@/common/modules/widgets/types/widget-field-value-type';


export type WidgetFieldOptions = DataFieldOptions | XAxisOptions | YAxisOptions
    | StackByOptions | GroupByOptions | CategoryByOptions
    | FormatRulesOptions | MinOptions | MaxOptions | LegendOptions | IconOptions | SubTotalOptions | TotalOptions
    | ComparisonOptions | ColorSchemaOptions | PieChartTypeOptions | DateFormatOptions
    | NumberFormatOptions | DataFieldHeatmapColorOptions | TextWrapOptions | TableColumnWidthOptions | CustomTableColumnWidthOptions
    | MissingValueOptions | WidgetHeightOptions | DisplaySeriesLabelOptions | DateRangeOptions
    | TooltipNumberFormatOptions;

export interface WidgetFieldSchema<FieldOption=WidgetFieldOptions> {
    options?: Partial<FieldOption>;
}

export type FieldDataTargetType = 'data_info' | 'label_info';

export type WidgetFieldName = 'dataField' | 'tableDataField' | 'xAxis' | 'yAxis'
    | 'stackBy' | 'groupBy' | 'categoryBy'
    | 'min' | 'max'
    | 'icon' | 'comparison' | 'legend'
    | 'subTotal' | 'total'
    | 'progressBar'
    | 'formatRules' | 'advancedFormatRules'
    | 'granularity' | 'dateRange' | 'colorSchema' | 'pieChartType'
    | 'dateFormat' | 'numberFormat' | 'tooltipNumberFormat' | 'dataFieldHeatmapColor'
    | 'displayAnnotation' | 'displaySeriesLabel' | 'textWrap' | 'tableColumnWidth' | 'customTableColumnWidth'
    | 'missingValue' | 'widgetHeight'
    | 'widgetHeader';

export interface WidgetFieldComponentProps<FieldOptions, FieldValue = any> {
    dataTable?: PublicDataTableModel|PrivateDataTableModel;
    allValueMap?: {
        [key in WidgetFieldName]: WidgetFieldValues;
    }
    widgetFieldSchema?: WidgetFieldSchema<FieldOptions>;
    isValid?: boolean;
    value?: FieldValue;
    widgetConfig?: WidgetConfig;
    widgetId?: string;
    dateRange?: DateRange;
}

// TODO: replace this with WidgetFieldComponentProps
export interface _WidgetFieldComponentProps<FieldOptions> {
    widgetFieldSchema?: WidgetFieldSchema<FieldOptions>;
    fieldManager: WidgetFieldValueManager;
    widgetConfig: WidgetConfig;
    widgetId: string;
}

export interface WidgetFieldComponentEmit<ValueType> {
    (e: 'update:value', value: ValueType): void;
    (e: 'update:is-valid', value: boolean): void;
    (e: 'show-error-modal', value?: number): void;
}
