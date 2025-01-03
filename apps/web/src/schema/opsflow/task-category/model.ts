import type { Tags } from '@/schema/_common/model';
import type { TaskField } from '@/schema/opsflow/_types/task-field-type';
import type { TaskStatusOptions } from '@/schema/opsflow/task/type';

export interface TaskCategoryModel {
    category_id: string;
    name: string;
    state: 'ACTIVE' | 'DELETED';
    description: string;
    status_options: TaskStatusOptions;
    fields:TaskField[];
    tags: Tags;
    package_id: string;
    domain_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}
