'use client';

import { useState, useEffect, useMemo } from 'react';
import { FoodItem, FoodCategory, SelectedFoodItem } from '../types/food-booking.types';
import { fetchFoodItems } from '../services/food-booking.service';
import { getRemainingBookingSeconds, formatSecondsToMMSS } from '@/modules/booking/services/bookingTimerService';

export function useFoodBooking(initialCombo?: string, showtimeId: string = 'showtime-101', combosParam?: string) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('ALL');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(() => getRemainingBookingSeconds(showtimeId));
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const items = await fetchFoodItems();
        if (isMounted) {
          setFoodItems(items);

          const initialQuantities: Record<string, number> = {};

          // Restore from combosParam URL string e.g. "food-1:1,food-2:2"
          if (combosParam) {
            combosParam.split(',').forEach((pair) => {
              const [id, qStr] = pair.split(':');
              if (id && qStr) {
                const q = parseInt(qStr, 10);
                if (q > 0) initialQuantities[id] = q;
              }
            });
          }

          // Restore from initialCombo if no combosParam
          if (Object.keys(initialQuantities).length === 0 && initialCombo) {
            const matchedItem = items.find(
              (i: FoodItem) =>
                i.id.toLowerCase().includes(initialCombo.toLowerCase()) ||
                i.name.toLowerCase().includes(initialCombo.toLowerCase())
            );
            if (matchedItem) {
              initialQuantities[matchedItem.id] = 1;
            }
          }

          if (Object.keys(initialQuantities).length > 0) {
            setQuantities(initialQuantities);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [initialCombo, combosParam]);

  // Filter food items by active category
  const filteredFoodItems = useMemo(() => {
    if (activeCategory === 'ALL') return foodItems;
    return foodItems.filter((i) => i.category === activeCategory);
  }, [foodItems, activeCategory]);

  // Continuous Countdown timer synced with sessionStorage expiration
  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getRemainingBookingSeconds(showtimeId);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setIsTimeout(true);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [showtimeId]);

  const formattedCountdown = useMemo(() => {
    return formatSecondsToMMSS(timeLeft);
  }, [timeLeft]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedFoodList = useMemo<SelectedFoodItem[]>(() => {
    return foodItems
      .filter((item) => (quantities[item.id] || 0) > 0)
      .map((item) => ({
        food: item,
        quantity: quantities[item.id] || 0,
      }));
  }, [foodItems, quantities]);

  const totalFoodPrice = useMemo(() => {
    return selectedFoodList.reduce((sum, curr) => sum + curr.food.price * curr.quantity, 0);
  }, [selectedFoodList]);

  return {
    foodItems: filteredFoodItems,
    activeCategory,
    setActiveCategory,
    quantities,
    updateQuantity,
    selectedFoodList,
    totalFoodPrice,
    formattedCountdown,
    isTimeout,
    loading,
  };
}
