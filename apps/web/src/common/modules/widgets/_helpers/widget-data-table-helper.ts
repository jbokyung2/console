import type { PrivateDataTableModel } from '@/schema/dashboard/private-data-table/model';
import type { PublicDataTableModel } from '@/schema/dashboard/public-data-table/model';

import type { DataTableOptions } from '@/common/modules/widgets/types/widget-model';

export const getDuplicatedDataTableName = (name: string, dataTables: Partial<PublicDataTableModel | PrivateDataTableModel>[]): string => {
    let _name = name;
    const _regex = /^(.*?)\s*\((\d+)\)$/i;
    const dataTableNames = dataTables.map((dataTable) => dataTable.name);

    while (dataTableNames.includes(_name)) {
        const match = _regex.exec(_name);
        if (match) {
            const baseName = match[1];
            const numberStr = match[2];
            const newNumber = numberStr ? parseInt(numberStr) + 1 : 2;
            _name = `${baseName} (${newNumber})`;
        } else {
            _name = `${_name} (2)`;
        }
    }
    return _name;
};

export const isFieldNameValid = (fieldName: string, dataTable?: PublicDataTableModel|PrivateDataTableModel): boolean => {
    if (!dataTable) return true;
    const _dataInfoKeys = Object.keys(dataTable.data_info || {});
    const _labelsInfoKeys = Object.keys(dataTable.labels_info || {});
    const _keys = _dataInfoKeys.concat(_labelsInfoKeys);
    return !_keys.includes(fieldName);
};

export const sortObjectByKeys = (obj: DataTableOptions): DataTableOptions => {
    if (obj === null || typeof obj !== 'object') return obj;

    const sorted = {} as DataTableOptions;
    Object.keys(obj)
        .sort()
        .forEach((key) => {
            sorted[key] = sortObjectByKeys(obj[key]);
        });
    return sorted;
};
