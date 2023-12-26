import type { Tags } from '@/schema/_common/model';

export interface CloudServiceUpdateParameters {
    cloud_service_id: string;
    name?: string;
    ip_addresses?: string[];
    account?: string;
    instance_type?: string;
    instance_size?: number;
    data: {[key:string]: any};
    metadata?: {[key:string]: any};
    reference?: {[key:string]: any};
    tags?: Tags;
    region_code?: string;
    project_id?: string;
}