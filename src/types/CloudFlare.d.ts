export interface GetRecordsRet {
  result: Result[];
  success: boolean;
  errors: any[];
  messages: any[];
  result_info: ResultInfo;
}

interface ResultInfo {
  page: number;
  per_page: number;
  count: number;
  total_count: number;
  total_pages: number;
}

interface Result {
  id: string;
  zone_id: string;
  zone_name: string;
  name: string;
  type: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  locked: boolean;
  meta: Meta;
  comment: object;
  tags: any[];
  created_on: string;
  modified_on: string;
  priority?: number;
}

interface Meta {
  auto_added: boolean;
  managed_by_apps: boolean;
  managed_by_argo_tunnel: boolean;
  source: string;
}

