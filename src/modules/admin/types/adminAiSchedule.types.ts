export type AiProviderType = string;

export interface EffectivePrimeTimeInfo {
  source: 'pricing_rule' | 'custom_config';
  rule_id: number | null;
  rule_name: string;
  time_from: string;
  time_to: string;
  applicable_days: string[];
  is_today_prime: boolean;
  modifier_type: string;
  modifier_value: number;
  display_text: string;
}

export interface AiScheduleConfigDTO {
  id?: number;
  cinema_id?: number | null;
  cinema_name?: string | null;
  opening_time: string;
  closing_time: string;
  default_buffer_minutes: number;
  staggering_gap_minutes: number;
  sync_prime_time_from_pricing_rules: boolean;
  custom_prime_time_start: string | null;
  custom_prime_time_end: string | null;
  default_base_price: number;
  ai_provider?: string;
  ai_model_name: string;
  ai_base_url?: string | null;
  ai_temperature: number;
  ai_timeout_seconds?: number;
  has_custom_api_key?: boolean;
  masked_api_key?: string | null;
  effective_prime_time?: EffectivePrimeTimeInfo;
}

export interface UpdateAiScheduleConfigRequest {
  cinema_id?: number | null;
  opening_time?: string;
  closing_time?: string;
  default_buffer_minutes?: number;
  staggering_gap_minutes?: number;
  sync_prime_time_from_pricing_rules?: boolean;
  custom_prime_time_start?: string | null;
  custom_prime_time_end?: string | null;
  default_base_price?: number;
  ai_provider?: string;
  ai_model_name?: string;
  ai_api_key?: string | null;
  ai_base_url?: string | null;
  ai_temperature?: number;
  ai_timeout_seconds?: number;
}

export interface AiTestConnectionRequest {
  ai_provider?: string;
  ai_api_key?: string | null;
  ai_model_name?: string;
  ai_base_url?: string | null;
  ai_timeout_seconds?: number;
}

export interface AiTestConnectionResponse {
  success: boolean;
  message: string;
  latency_ms?: number;
}

export interface AiStrategyOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  prompt?: string;
  recommended_for?: string;
}

export interface AiDraftShowtimeItem {
  temp_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster?: string;
  duration: number;
  room_id: number;
  room_name: string;
  room_type?: string;
  room_capacity?: number;
  showtime_start: string;
  showtime_end: string;
  base_price: number;
  buffer_minutes: number;
  is_prime_time: boolean;
  booked_seats?: number;
  is_locked?: boolean;
}

export interface AiConflictItem {
  temp_id: string;
  room_id: number;
  movie_title: string;
  conflict_with: string;
  conflict_start: string;
  conflict_end: string;
  message: string;
}

export interface AiWarningItem {
  type: string;
  temp_id?: string;
  message: string;
}

export interface AiDraftValidationResult {
  is_valid: boolean;
  conflicts: AiConflictItem[];
  warnings: AiWarningItem[];
}

export interface AiToolCallItem {
  id?: string;
  name: string;
  args?: Record<string, any>;
  result?: any;
  latency_ms?: number;
}

export interface AiThinkingStep {
  title: string;
  detail?: string;
  status?: 'completed' | 'in_progress' | 'warning';
}

export interface AiTokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  latency_ms?: number;
  model?: string;
  estimated_cost_vnd?: number;
}

export interface AiDraftSummary {
  total_showtimes: number;
  total_rooms_used: number;
  estimated_total_capacity: number;
  estimated_expected_revenue: number;
  prime_time_showtimes_count: number;
  prime_time_coverage_percent: number;
  strategy_id?: string;
  mode: 'preset' | 'prompt';
  schedule_mode?: 'smart_fill' | 'optimize' | 'replace_all';
  target_date: string;
  cinema_id: number;
  cinema_name: string;
  prime_time_info: EffectivePrimeTimeInfo;
  strategy_explanation: string;
  thinking_steps?: AiThinkingStep[];
  reasoning?: string;
  tool_calls?: AiToolCallItem[];
  usage?: AiTokenUsage;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  draftCount?: number;
  draftSummary?: AiDraftSummary;
  showtimes?: AiDraftShowtimeItem[];
  validation?: AiDraftValidationResult;
  suggestedFollowups?: string[];
  thinking_steps?: AiThinkingStep[];
  tool_calls?: AiToolCallItem[];
  usage?: AiTokenUsage;
}

export interface GenerateAiDraftRequest {
  cinema_id: number;
  target_date: string;
  mode?: 'preset' | 'prompt';
  strategy_id?: string;
  prompt?: string;
  selected_movie_ids?: number[];
  selected_room_ids?: number[];
  schedule_mode?: 'smart_fill' | 'optimize' | 'replace_all';
  clean_existing_date?: boolean;
  current_draft_showtimes?: AiDraftShowtimeItem[];
  chat_history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  time_range?: { start?: string; end?: string };
  override_config?: {
    ai_provider?: string;
    ai_api_key?: string;
    ai_base_url?: string;
    ai_model_name?: string;
    ai_timeout_seconds?: number;
    buffer_minutes?: number;
    staggering_gap_minutes?: number;
    opening_time?: string;
    closing_time?: string;
    default_base_price?: number;
  };
}

export interface GenerateAiDraftResponse {
  summary: AiDraftSummary;
  draft_showtimes: AiDraftShowtimeItem[];
  existing_showtimes: any[];
  validation: AiDraftValidationResult;
}

export interface ApplyAiDraftRequest {
  cinema_id: number;
  target_date: string;
  draft_showtimes: AiDraftShowtimeItem[];
  clean_existing_date?: boolean;
}

export interface ApplyAiDraftResponse {
  showtimes_count: number;
  seats_count: number;
}

