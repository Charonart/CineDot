'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin.service';
import {
  AdminPricingRuleItem,
  CreatePricingRulePayload,
  PricingRuleFilterParams,
  PricingRulePaginationMeta,
  UpdatePricingRulePayload,
} from '../types/adminPricingRule.types';

export function useAdminPricingRules(initialParams?: PricingRuleFilterParams) {
  const [rulesList, setRulesList] = useState<AdminPricingRuleItem[]>([]);
  const [pagination, setPagination] = useState<PricingRulePaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mutation states
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [params, setParams] = useState<PricingRuleFilterParams>(initialParams || {});

  const fetchRules = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await adminService.getPricingRules(params);
      if (res && (res.success || Array.isArray(res.data))) {
        const rawData = res.data?.data || res.data || [];
        const items = Array.isArray(rawData) ? rawData : [];

        // Map items ensuring id field is populated
        const mappedItems: AdminPricingRuleItem[] = items.map((r: any) => ({
          ...r,
          id: r.id || r.pricing_rule_id,
          pricing_rule_id: r.pricing_rule_id || r.id,
          modifier_value: Number(r.modifier_value) || 0,
          priority: Number(r.priority) || 0,
          is_active: Boolean(r.is_active),
        }));

        setRulesList(mappedItems);

        if ((res as any).meta || (res.data as any)?.meta) {
          const meta = (res as any).meta || (res.data as any)?.meta;
          setPagination({
            current_page: meta.current_page || 1,
            last_page: meta.last_page || 1,
            per_page: meta.per_page || 15,
            total: meta.total || mappedItems.length,
          });
        } else {
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: mappedItems.length,
            total: mappedItems.length,
          });
        }
      } else {
        setRulesList([]);
      }
    } catch (err: any) {
      console.error('Error fetching pricing rules:', err);
      setError(err?.response?.data?.message || err.message || 'Lỗi khi tải danh sách quy tắc giá.');
      setRulesList([]);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [params]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = async (payload: CreatePricingRulePayload) => {
    setIsCreating(true);
    try {
      const res = await adminService.createPricingRule(payload);
      await fetchRules();
      return res;
    } finally {
      setIsCreating(false);
    }
  };

  const updateRule = async (id: number | string, payload: UpdatePricingRulePayload) => {
    setIsUpdating(true);
    try {
      const res = await adminService.updatePricingRule(id, payload);
      await fetchRules();
      return res;
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleActive = async (id: number | string) => {
    // Optimistic UI update
    setRulesList((prev) =>
      prev.map((r) =>
        r.id === Number(id) || r.pricing_rule_id === Number(id)
          ? { ...r, is_active: !r.is_active }
          : r
      )
    );

    try {
      const res = await adminService.togglePricingRule(id);
      return res;
    } catch (err) {
      // Revert on error
      await fetchRules();
      throw err;
    }
  };

  const deleteRule = async (id: number | string) => {
    setIsDeleting(true);
    try {
      const res = await adminService.deletePricingRule(id);
      await fetchRules();
      return res;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    rulesList,
    pagination,
    isLoading,
    isFetching,
    error,
    params,
    setParams,
    fetchRules,
    createRule,
    isCreating,
    updateRule,
    isUpdating,
    toggleActive,
    deleteRule,
    isDeleting,
  };
}
