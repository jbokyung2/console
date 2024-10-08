<script setup lang="ts">

import { computed, reactive } from 'vue';


import type { Query } from '@cloudforet/core-lib/space-connector/type';
import { PI, PTooltip } from '@cloudforet/mirinae';
import { numberFormatter } from '@cloudforet/utils';

import type { Currency } from '@/store/modules/display/type';
import { useAllReferenceStore } from '@/store/reference/all-reference-store';
import type { ProjectReferenceMap } from '@/store/reference/project-reference-store';

import { hexToRgba } from '@/lib/helper/color-convert-helper';

import { useProxyValue } from '@/common/composables/proxy-state';
import { REFERENCE_FIELD_MAP } from '@/common/modules/widgets/_constants/widget-constant';
import { DEFAULT_COMPARISON_COLOR } from '@/common/modules/widgets/_constants/widget-field-constant';
import {
    getFormattedDate,
    getRefinedDateFormatByGranularity,
} from '@/common/modules/widgets/_helpers/widget-date-helper';
import { getFormattedNumber } from '@/common/modules/widgets/_helpers/widget-helper';
import type { TableWidgetField } from '@/common/modules/widgets/types/widget-data-table-type';
import type { TableDataItem } from '@/common/modules/widgets/types/widget-data-type';
import type { WidgetSize } from '@/common/modules/widgets/types/widget-display-type';
import type {
    TableDataFieldValue, ComparisonValue, TotalValue,
    DateFormatValue,
    NumberFormatValue, DataFieldHeatmapColorValue,
} from '@/common/modules/widgets/types/widget-field-value-type';
import type { DataInfo } from '@/common/modules/widgets/types/widget-model';

import {
    blue, green, red, yellow,
} from '@/styles/colors';

const HEATMAP_COLOR_HEX_MAP = {
    RED: red[200],
    BLUE: blue[200],
    YELLOW: yellow[200],
    GREEN: green[200],
};
const SKIP_HEATMAP_FIELD = ['subTotal', 'comparison'];


interface Props {
  fields: TableWidgetField[];
  items?: any[];
  pageTotal?: TableDataItem;
  currency?: Currency;
  size?: WidgetSize;
  widgetId: string;
  dataInfo?: DataInfo;
  sortBy: Query['sort'];
  thisPage: number;
  fieldType: TableDataFieldValue['fieldType'];
  criteria?: string;
  dataField?: string|string[];
  granularity?: string;
  // optional field info
  comparisonInfo?: ComparisonValue;
  subTotalInfo?: TotalValue;
  totalInfo?: TotalValue;
  dateFormatInfo?: DateFormatValue;
  numberFormatInfo?: NumberFormatValue;
  dataFieldHeatmapColorInfo?: DataFieldHeatmapColorValue;
}
const props = defineProps<Props>();
const emit = defineEmits<{(e: 'update:sort-by', value: Query['sort']): void;
  (e: 'update:this-page', value: number): void;
  (e: 'load'): void;
}>();
const allReferenceStore = useAllReferenceStore();

const storeState = reactive({
    project: computed<ProjectReferenceMap>(() => allReferenceStore.getters.project),
    workspace: computed(() => allReferenceStore.getters.workspace),
    region: computed(() => allReferenceStore.getters.region),
    serviceAccount: computed(() => allReferenceStore.getters.serviceAccount),
});

const state = reactive({
    proxySortBy: useProxyValue('sortBy', props, emit),
    proxyThisPage: useProxyValue('thisPage', props, emit),
    refinedDateFormat: computed<string|undefined>(() => {
        if (!props.granularity || !props.dateFormatInfo) return undefined;
        return getRefinedDateFormatByGranularity(props.granularity, props.dateFormatInfo.value);
    }),
    totalItem: computed<TableDataItem|undefined>(() => props.pageTotal),
});

const getComparisonInfo = (fieldName: string) => `${fieldName} Compared to ${props.granularity || 'Previous'}`;
const getField = (field: TableWidgetField): string => {
    if (field.fieldInfo?.type === 'dataField' && field.fieldInfo?.reference) return storeState[field.fieldInfo.reference][field.label]?.name || field.label || field.name;
    if (field.fieldInfo?.type === 'dataField' && field.fieldInfo?.additionalType === 'dateFormat' && !!state.refinedDateFormat) return getFormattedDate(field.name, state.refinedDateFormat);
    return field.label || field.name;
};

const valueFormatter = (value, field: TableWidgetField) => {
    const _value = value || 0;
    let _unit = field.fieldInfo?.unit;
    let dataField = field.name.replace('comparison_', '');
    if (props.fieldType === 'dynamicField') {
        dataField = props.criteria as string;
        _unit = props.dataInfo?.[dataField]?.unit;
    }
    return getFormattedNumber(_value, dataField, props.numberFormatInfo, _unit);
};

const getValue = (item: TableDataItem, field: TableWidgetField) => {
    if (field.fieldInfo?.type === 'labelField') {
        if (Object.keys(REFERENCE_FIELD_MAP).includes(field.name)) {
            const referenceKey = REFERENCE_FIELD_MAP[field.name];
            const referenceValueKey = item[field.name];
            return storeState[referenceKey][referenceValueKey]?.label || storeState[referenceKey][referenceValueKey]?.name || referenceValueKey || '-';
        }
        if (field.fieldInfo?.additionalType === 'dateFormat' && !!state.refinedDateFormat && item[field.name] !== 'Total') {
            return getFormattedDate(item[field.name], state.refinedDateFormat);
        }
        return item[field.name] || '-';
    }
    if (props.fieldType === 'staticField') {
        const itemValue = item[field.name];
        if (field.fieldInfo?.additionalType === 'comparison') {
            const targetValue = itemValue?.target ?? 0;
            const subjectValue = itemValue?.subject ?? 0;
            const fixedValue = Math.abs(targetValue - subjectValue);
            const percentageValue = fixedValue / (targetValue || 1) * 100;
            if (!fixedValue || fixedValue === 0) return '-';
            if (item[props.fields[0].name] === 'Total') return valueFormatter(fixedValue, field);
            if (props.comparisonInfo?.format === 'fixed') return valueFormatter(fixedValue, field);
            if (props.comparisonInfo?.format === 'percent') return `${numberFormatter(percentageValue)}%`;
            if (props.comparisonInfo?.format === 'all') return `${valueFormatter(fixedValue, field)} (${numberFormatter(percentageValue)}%)`;
            return '-';
        }
        return valueFormatter(itemValue, field) || '-';
    }
    if (props.fieldType === 'dynamicField') {
        const dynamicData = item[props.criteria || ''] ?? [];
        const dynamicDataItem = dynamicData.find((data) => data[props.dataField as string] === field.name);
        if (field.fieldInfo?.additionalType === 'comparison') {
            const targetValue = dynamicDataItem?.value?.target ?? 0;
            const subjectValue = dynamicDataItem?.value?.subject ?? 0;
            const fixedValue = Math.abs(targetValue - subjectValue);
            const percentageValue = fixedValue / (targetValue || 1) * 100;
            if (!fixedValue || fixedValue === 0) return '-';
            if (item[props.fields[0].name] === 'Total') return valueFormatter(fixedValue, field);
            if (props.comparisonInfo?.format === 'fixed') return valueFormatter(fixedValue, field);
            if (props.comparisonInfo?.format === 'percent') return `${numberFormatter(percentageValue)}%`;
            if (props.comparisonInfo?.format === 'all') return `${valueFormatter(fixedValue, field)} (${numberFormatter(percentageValue)}%)`;
            return '-';
        }
        return valueFormatter(dynamicDataItem?.value, field) || 0;
    }
    return '-';
};
const getComparisonValueIcon = (item: TableDataItem, field: TableWidgetField): { icon: string; color: string; }|undefined => {
    if (props.fieldType === 'staticField') {
        const subtraction = (item?.[field.name]?.target ?? 0) - (item?.[field.name]?.subject ?? 0);
        if (subtraction > 0) return { icon: 'ic_arrow-up-bold-alt', color: props.comparisonInfo?.increaseColor || DEFAULT_COMPARISON_COLOR.INCREASE };
        if (subtraction < 0) return { icon: 'ic_arrow-down-bold-alt', color: props.comparisonInfo?.decreaseColor || DEFAULT_COMPARISON_COLOR.DECREASE };
    } else {
        const dynamicData = item[props.criteria || ''] ?? [];
        const dynamicDataItem = dynamicData.find((data) => data[props.dataField as string] === field.name);
        const subtraction = (dynamicDataItem?.value?.target ?? 0) - (dynamicDataItem?.value?.subject ?? 0);
        if (subtraction > 0) return { icon: 'ic_arrow-up-bold-alt', color: props.comparisonInfo?.increaseColor || DEFAULT_COMPARISON_COLOR.INCREASE };
        if (subtraction < 0) return { icon: 'ic_arrow-down-bold-alt', color: props.comparisonInfo?.decreaseColor || DEFAULT_COMPARISON_COLOR.DECREASE };
    }
    return undefined;
};
const getValueTooltipText = (item: TableDataItem, field: TableWidgetField) => {
    if (field.fieldInfo?.type === 'labelField' || field.fieldInfo?.additionalType === 'comparison') return '';
    if (props.fieldType === 'staticField') {
        let _unit;
        if (field.name === 'sub_total') {
            const filteredFieldWithUnit = (props.dataField as string[])?.filter((_field) => props.dataInfo?.[_field]?.unit);
            _unit = filteredFieldWithUnit.map((_field) => (props.dataInfo ?? {})[_field]?.unit).join(', ');
        } else _unit = props.dataInfo?.[field.name || '']?.unit;
        return `• Unit: ${_unit ?? '-'} \n• ${field.name}: ${numberFormatter(item[field.name])}`;
    }
    const dataInfo = props.dataInfo?.[props.criteria || ''];
    const dynamicData = item[props.criteria || ''] ?? [];
    const dynamicDataItem = dynamicData.find((data) => data[props.dataField as string] === field.name);
    return `• Unit: ${dataInfo?.unit ?? '-'} \n• ${props.criteria}: ${numberFormatter(dynamicDataItem?.value) || 0}`;
};

const getSortIcon = (field: TableWidgetField) => {
    let _fieldName = field.name;
    if (field.name === 'sub_total' && props.criteria) _fieldName = `_total_${props.criteria}`;
    if (!state.proxySortBy.some((d) => d.key === _fieldName)) {
        return 'ic_caret-down';
    }
    return state.proxySortBy[0]?.desc ? 'ic_caret-down-filled' : 'ic_caret-up-filled';
};

const handleClickSort = async (sortKey: string) => {
    let _sortKey = sortKey;
    if (sortKey === 'sub_total' && props.criteria) _sortKey = `_total_${props.criteria}`;
    let resultSortBy: { key: string; desc: boolean }[];
    if (state.proxySortBy.length && state.proxySortBy[0].key === _sortKey) {
        resultSortBy = [{ key: _sortKey, desc: !state.proxySortBy[0].desc }];
    } else {
        resultSortBy = [{ key: _sortKey, desc: true }];
    }
    state.proxySortBy = resultSortBy;
    state.proxyThisPage = 1;
    emit('load');
};
const isSortable = (field: TableWidgetField) => {
    const isDynamicDataField = props.fieldType === 'dynamicField' && field.fieldInfo?.type === 'dataField' && field.name !== 'sub_total';
    const isStaticSubTotal = props.fieldType === 'staticField' && field.name === 'sub_total';
    return !isDynamicDataField && !isStaticSubTotal;
};

const getHeatmapColorStyle = (item: TableDataItem, field: TableWidgetField) => {
    const _style: Record<string, string> = {};
    const heatmapSkipCondition = field.fieldInfo?.type === 'labelField'
        || (field?.fieldInfo?.additionalType && SKIP_HEATMAP_FIELD.includes(field?.fieldInfo?.additionalType));
    if (heatmapSkipCondition) return _style;

    let _dataField = '';
    let _value = 0;
    let _totalValue = 100;
    if (props.fieldType === 'staticField') {
        _value = item[field.name] || 0;
        _totalValue = state.totalItem?.[field.name] || 100;
        _dataField = field.name;
    } else if (props.fieldType === 'dynamicField') {
        _value = item[props.criteria || '']?.find((data) => data[props.dataField as string] === field.name)?.value || 0;
        _totalValue = state.totalItem?.[props.criteria || '']?.find((data) => data[props.dataField as string] === field.name)?.value || 100;
        _dataField = props.criteria as string;
    }

    const opacity = 0.1 + (0.9 * (_value / _totalValue));
    const _colorInfo = props.dataFieldHeatmapColorInfo?.[_dataField]?.value;
    if (_colorInfo && _colorInfo !== 'NONE') {
        const rgbaString = hexToRgba(HEATMAP_COLOR_HEX_MAP[_colorInfo], opacity);
        if (rgbaString) _style.backgroundColor = rgbaString;
    }

    return _style;
};

// const getTimeDiffSubText = (field: TableWidgetField): string => {
//     if (!props.dataInfo?.[field.name]) return '';
//     const { timediff } = props.dataInfo[field.name];
//     if (!timediff || !Object.entries(timediff ?? {}).length) return '';
//     const [key, value] = Object.entries(timediff)[0];
//     return `( ${value} ${key} )`;
// };



</script>

<template>
    <div class="widget-data-table">
        <table ref="tableRef">
            <thead>
                <tr>
                    <th v-for="(field, fieldColIndex) in props.fields"
                        :key="`th-${props.widgetId}-${fieldColIndex}`"
                        :style="{
                            minWidth: field.width || undefined,
                            width: field.width || undefined,
                        }"
                        :class="{
                            'last-label': fieldColIndex === props.fields.filter((_field) => _field.fieldInfo?.type === 'labelField').length - 1,
                            'sub-total-freeze': field.fieldInfo?.additionalType === 'subTotal' && props.subTotalInfo?.freeze,
                        }"
                    >
                        <span class="th-contents"
                              :class="{
                                  'data-field': field.fieldInfo?.type === 'dataField',
                                  'sub-total': field.fieldInfo?.additionalType === 'subTotal',
                              }"
                        >
                            <span class="th-text">
                                {{ field.fieldInfo?.additionalType === 'comparison' ? 'Δ' : "" }}{{ getField(field) }}
                                <!--                                <span class="timediff-sub-text">{{ getTimeDiffSubText(field) }}</span>-->
                            </span>
                            <p-tooltip v-if="field.fieldInfo?.additionalType === 'comparison'"
                                       class="comparison-info"
                                       position="bottom"
                                       :contents="getComparisonInfo(getField(field))"
                            >
                                <p-i name="ic_info-circle"
                                     width="0.875rem"
                                     height="0.875rem"
                                />
                            </p-tooltip>
                            <p-i v-else-if="isSortable(field)"
                                 :name="getSortIcon(field)"
                                 class="sort-icon"
                                 @click="handleClickSort(field.name)"
                            />
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody ref="tbodyRef">
                <tr v-for="(item, rowIndex) in props.items"
                    :key="`tr-${props.widgetId}-${rowIndex}`"
                    :data-index="rowIndex"
                >
                    <td v-for="(field, colIndex) in props.fields"
                        :key="`td-${props.widgetId}-${rowIndex}-${colIndex}`"
                        :class="{
                            'link-item': field?.link,
                            'last-label': colIndex === props.fields.filter((_field) => _field.fieldInfo?.type === 'labelField').length - 1,
                            'sub-total': field.fieldInfo?.additionalType === 'subTotal',
                            'sub-total-freeze': field.fieldInfo?.additionalType === 'subTotal' && props.subTotalInfo?.freeze,
                            'total': item[props.fields[0].name] === 'Total' && props.items?.length === rowIndex + 1,
                            'total-freeze': item[props.fields[0].name] === 'Total' && props.items?.length === rowIndex + 1 && props.totalInfo?.freeze,
                        }"
                        :style="rowIndex !== props.items?.length - 1 ? getHeatmapColorStyle(item, field) : {}"
                    >
                        <span ref="labelRef"
                              class="td-contents"
                              :class="{
                                  'data-field': field.fieldInfo?.type === 'dataField',
                              }"
                        >
                            <p-tooltip class="value-tooltip"
                                       :contents="getValueTooltipText(item, field)"
                                       position="bottom"
                            ><span class="common-text-box">{{ getValue(item, field) }}</span></p-tooltip>
                            <p-i v-if="field.fieldInfo?.additionalType === 'comparison' && getComparisonValueIcon(item, field)"
                                 :name="getComparisonValueIcon(item, field)?.icon"
                                 :color="getComparisonValueIcon(item, field)?.color"
                                 class="comparison-icon"
                                 width="0.75rem"
                                 height="0.75rem"
                            />
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped lang="postcss">
.widget-data-table {
    @apply bg-white w-full relative;
    max-height: 100%;
    overflow: auto;

    table {
        @apply min-w-full;
        border-collapse: separate;
        border-spacing: 0;
        padding: 0;
    }
    thead {
        @apply sticky;
        top: 0;
        z-index: 1;
    }

    th {
        @apply text-label-sm text-gray-700 border-t border-b-2 border-gray-200 bg-white;
        border-bottom-width: 0.225rem;
        font-weight: 500;
        height: 1.75rem;
        min-width: 7.5rem;
        padding: 0.1875rem 0.5rem;

        &.last-label {
            @apply border-r;
        }
        &.sub-total-freeze {
            @apply border-l border-violet-200 sticky;
            right: 0;
            top: 0;
        }

        .th-contents {
            @apply flex items-center justify-between pl-4 gap-1;
            .comparison-info {
                min-width: 0.875rem;
            }
            .th-text {
                @apply flex items-center gap-1;
                .timediff-sub-text {
                    @apply text-gray-400 text-paragraph-sm;
                }
            }

            &.data-field {
                @apply justify-end;
            }
            &.sub-total {
                @apply font-bold text-gray-700;
            }

            .sort-icon {
                @apply text-gray-500 float-right my-px;
                &:hover { cursor: pointer; }
            }
        }
    }

    tbody {
        tr {
            &:nth-child(odd) {
                td {
                    @apply bg-gray-100;
                    &.sub-total {
                        @apply bg-violet-150;
                    }
                }
            }
            &:hover {
                background-color: rgba(theme('colors.gray.200'), 0.7);
                td {
                    &.sub-total {
                        background-color: rgba(theme('colors.violet.200'), 1);
                    }
                }
            }
        }
    }

    td {
        @apply z-0 align-middle text-label-sm text-gray-900;
        height: 1.75rem;
        padding: 0.1875rem 0.5rem;
        min-width: 7.5rem;

        &:hover {
            @apply bg-gray-200;
        }
        &.last-label {
            @apply border-r border-gray-200;
        }

        &.sub-total {
            @apply bg-violet-100;

            .td-contents {
                @apply font-bold text-gray-900;
            }
        }
        &.sub-total-freeze {
            @apply border-l border-violet-200 sticky;
            right: 0;
            top: 0;
        }
        &.total {
            @apply bg-violet-100 font-bold text-gray-900 border-r-0;
        }
        &.total-freeze {
            @apply border-t border-violet-200 sticky;
            bottom: 0;
        }

        .td-contents {
            @apply flex items-center pl-4 gap-1;
            width: 100%;

            .comparison-icon {
                min-width: 0.75rem;
            }

            &.data-field {
                @apply justify-end;
            }
        }
    }
}

</style>
