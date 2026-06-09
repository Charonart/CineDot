'use client';

import React from 'react';
import { Seat, SeatMap as SeatMapModel } from '../types/booking.type';
import { SeatButton } from './SeatButton';
import { SelectedSeat } from '../types';

interface SeatMapProps {
  seatMap: SeatMapModel;
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ seatMap, selectedSeats, onToggleSeat }) => {
  const selectedSeatIds = new Set(selectedSeats.map((seat) => seat.id));
  const aisleSet = new Set(seatMap.layout.aislesAfterSeatNumbers);

  const getRowSeats = (row: string) =>
    seatMap.seats
      .filter((seat) => seat.row === row)
      .sort((a, b) => a.number - b.number);

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
            marginBottom: '10px',
          }}
        >
          {seatMap.layout.screenLabel}
        </span>
      </div>

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
            padding: '0 20px',
          }}
          className="seat-grid"
        >
          {seatMap.layout.rowOrder.map((row) => {
            const rowSeats = getRowSeats(row);
            if (rowSeats.length === 0) return null;
            const isCouple = rowSeats.every((seat) => seat.type === 'couple');

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

                <div
                  style={{
                    display: 'flex',
                    gap: isCouple ? '12px' : '8px',
                    alignItems: 'center',
                  }}
                >
                  {rowSeats.map((seat) => (
                    <React.Fragment key={seat.id}>
                      <SeatButton
                        seat={seat}
                        isSelected={selectedSeatIds.has(seat.id)}
                        onToggle={onToggleSeat}
                      />
                      {aisleSet.has(seat.number) && (
                        <span aria-hidden="true" style={{ width: '18px', flexShrink: 0 }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

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
