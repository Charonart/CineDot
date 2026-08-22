export type ModifierType = 'percentage' | 'fixed_amount';

export interface PricingRuleConditions {
  days?: string[];
  time_from?: string;
  time_to?: string;
  time_range?: {
    from?: string;
    to?: string;
  };
  dates?: string[];
  date_range?: {
    from?: string;
    to?: string;
  };
  seat_types?: string[];
  cinema_ids?: number[];
  min_seats?: number;
  user_ids?: number[];
  min_age?: number;
  max_age?: number;
  genders?: string[];
  [key: string]: any;
}

export interface AdminPricingRuleItem {
  id: number;
  pricing_rule_id: number;
  name: string;
  rule_category: string;
  conditions: PricingRuleConditions | string | null;
  modifier_type: ModifierType;
  modifier_value: number;
  priority: number;
  is_active: boolean;
}

export interface CreatePricingRulePayload {
  name: string;
  rule_category?: string;
  conditions?: PricingRuleConditions | string;
  modifier_type: ModifierType;
  modifier_value: number;
  priority?: number;
  is_active?: boolean;
}

export interface UpdatePricingRulePayload {
  name?: string;
  rule_category?: string;
  conditions?: PricingRuleConditions | string;
  modifier_type?: ModifierType;
  modifier_value?: number;
  priority?: number;
  is_active?: boolean;
}

export interface PricingRuleFilterParams {
  search?: string;
  rule_category?: string;
  is_active?: boolean | string;
  page?: number;
  per_page?: number;
}

export interface PricingRulePaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export type ConditionBlockType =
  | 'days'
  | 'time_range'
  | 'seat_types'
  | 'date_range'
  | 'dates'
  | 'cinema_ids'
  | 'age_range'
  | 'min_seats'
  | 'genders';
