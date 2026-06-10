'use client';

import React from 'react';
import { ComboItem } from '../types';
import { useBookingStore } from '../store/bookingStore';
import { FoodComboCard } from './FoodComboCard';

interface FoodComboListProps {
  combos: ComboItem[];
}

export const FoodComboList: React.FC<FoodComboListProps> = ({ combos }) => {
  const selectedCombos = useBookingStore((state) => state.session.combos);
  const addOrUpdateCombo = useBookingStore((state) => state.addOrUpdateCombo);

  const getComboQuantity = (comboId: string) => {
    const found = selectedCombos.find((c) => c.id === comboId);
    return found ? found.quantity : 0;
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px',
        width: '100%',
      }}
    >
      {combos.map((combo) => {
        const quantity = getComboQuantity(combo.id);

        return (
          <FoodComboCard
            key={combo.id}
            combo={combo}
            quantity={quantity}
            onDecrease={() => addOrUpdateCombo(combo, quantity - 1)}
            onIncrease={() => addOrUpdateCombo(combo, quantity + 1)}
          />
        );
      })}
    </div>
  );
};
