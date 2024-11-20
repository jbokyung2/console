import type { JsonSchema } from '@cloudforet/mirinae/types/controls/forms/json-schema-form/type';

import type { Tags } from '@/schema/_common/model';
import type { SchemaType } from '@/schema/identity/schema/type';

export interface SchemaModel {
    schema_id: string;
    name:string;
    schema_type: SchemaType;
    schema: JsonSchema;
    provider: string;
    related_schemas: string[];
    options: {
        help: {
            en: string;
            ko: string;
        };
        external_link: string;
    };
    tags: Tags;
    is_managed: boolean;
    domain_id: string;
    created_at: string;
    updated_at: string;
}
