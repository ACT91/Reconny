export interface User {
  id: string
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export enum JobStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PipelineStage {
  SUBFINDER = '01_subfinder',
  HTTPX_PROBE = '02_httpx_probe',
  TECH_DETECT = '03_tech_detect',
  KATANA_CRAWL = '04_katana_crawl',
  JS_EXTRACT = '05_js_extract',
  ENDPOINT_EXTRACT = '06_endpoint_extract',
  JS_DOWNLOAD = '07_js_download',
  JS_MINING = '08_js_mining',
  MERGE_ENDPOINTS = '09_merge_endpoints',
  URL_BUILD = '10_url_build',
  HTTPX_ENDPOINT = '11_httpx_endpoint',
  NUCLEI_SCAN = '12_nuclei_scan',
  AI_ANALYSIS = '13_ai_analysis',
}

export interface Job {
  id: string
  user_id: string
  project_id?: string
  target_domain: string
  status: JobStatus
  current_stage?: PipelineStage
  progress_percent: number
  created_at: string
  started_at?: string
  completed_at?: string
  error_message?: string
  logs?: string
}

export interface Asset {
  id: string
  job_id: string
  domain: string
  url?: string
  is_alive: boolean
  status_code?: number
  technologies?: Record<string, any>
  web_server?: string
  title?: string
  content_length?: number
  discovered_at: string
}

export interface Endpoint {
  id: string
  job_id: string
  asset_id?: string
  url: string
  path?: string
  method: string
  source: string
  is_alive: boolean
  status_code?: string
  discovered_at: string
}

export interface Vulnerability {
  id: string
  job_id: string
  endpoint_id?: string
  template_id: string
  name: string
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  url: string
  matched_at?: string
  extracted_results?: any
  description?: string
  remediation?: string
  references?: string[]
  discovered_at: string
}

export interface JSFile {
  id: string
  job_id: string
  asset_id?: string
  url: string
  file_path?: string
  size_bytes?: number
  downloaded: boolean
  analyzed: boolean
  endpoints_found: number
  discovered_at: string
}

export interface ScanResults {
  job_id: string
  results: {
    'subdomains.txt'?: string[]
    'live_hosts.txt'?: string[]
    'endpoints_final.txt'?: string[]
    'nuclei_results.json'?: any
    'ai_report.json'?: {
      target: string
      risk_score: number
      analysis: string
      recommendations: string[]
    }
  }
}
