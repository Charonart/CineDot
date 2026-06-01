'use client';

import React from 'react';
import { SeatItem } from '../data/seatMapData';
import { SeatButton } from './SeatButton';

interface SeatMapProps {
  seats: SeatItem[];
  selectedSeats: SeatItem[];
  onToggleSeat: (seat: SeatItem) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onToggleSeat }) => {
  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];

  const getRowSeats = (row: string) => {
    return seats.filter((s) => s.row === row);
  };

  return (
    <div 
      className="seat-map-section"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '40px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Screen area curve and indicator */}
      <div 
        className="screen-area"
        style={{
          width: '100%',
          maxWidth: '560px',
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative',
        }}
      >
        <span 
          style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.25em', 
            color: 'var(--text3)', 
            fontWeight: 700,
            display: 'inline-block',
            marginBottom: '10px'
          }}
        >
          MÀN HÌNH CHÍNH
        </span>
        <div 
          className="screen-curve"
          style={{
            height: '6px',
            background: 'linear-gradient(to right, rgba(79, 60, 147, 0.05), #CFC9EB, rgba(79, 60, 147, 0.05))',
            borderRadius: '50% / 100% 100% 0 0',
            boxShadow: '0 4px 15px rgba(207, 201, 235, 0.4)',
          }}
        />
      </div>

      {/* Seat Map scrolling wrap for smaller mobile viewports */}
      <div 
        className="seat-scroll-container"
        style={{
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px 0 20px 0',
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            margin: '0 auto', 
            minWidth: 'fit-content',
            padding: '0 20px'
          }}
          className="seat-grid"
        >
          {rows.map((row) => {
            const rowSeats = getRowSeats(row);
            const isCouple = row === 'J';

            return (
              <div 
                key={row} 
                className="seat-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isCouple ? '16px' : '8px',
                  justifyContent: 'center',
                }}
              >
                {/* Left row labels */}
                <span 
                  className="seat-row-label"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text3)',
                    width: '24px',
                    textAlign: 'center',
                    marginRight: '12px',
                  }}
                >
                  {row}
                </span>

                {/* Seat buttons mapping */}
                <div 
                  style={{ 
                    display: 'flex', 
                    gap: isCouple ? '12px' : '8px',
                    alignItems: 'center' 
                  }}
                >
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.id === seat.id);
                    return (
                      <SeatButton
                        key={seat.id}
                        seat={seat}
                        isSelected={isSelected}
                        onToggle={onToggleSeat}
                      />
                    );
                  })}
                </div>

                {/* Right row labels */}
                <span 
                  className="seat-row-label"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text3)',
                    width: '24px',
                    textAlign: 'center',
                    marginLeft: '12px',
                  }}
                >
                  {row}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
