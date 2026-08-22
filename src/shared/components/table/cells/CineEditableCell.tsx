'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Edit2, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ColumnDef } from '@/shared/types/dataTable.types';

interface CineEditableCellProps<T> {
  row: T;
  column: ColumnDef<T>;
  value: any;
  onCellSave?: (row: T, field: string, newValue: any) => Promise<void> | void;
}

export function CineEditableCell<T extends Record<string, any>>({
  row,
  column,
  value,
  onCellSave,
}: CineEditableCellProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState<any>(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      } else if (selectRef.current) {
        selectRef.current.focus();
      }
    }
  }, [isEditing]);

  const handleSave = async (newValToSave: any) => {
    if (newValToSave === value) {
      setIsEditing(false);
      return;
    }

    if (column.validate) {
      const error = column.validate(newValToSave, row);
      if (error) {
        alert(error);
        return;
      }
    }

    setIsSaving(true);
    try {
      if (onCellSave) {
        await onCellSave(row, column.key, newValToSave);
      }
      setCurrentVal(newValToSave);
      setIsEditing(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể lưu thay đổi vào ô dữ liệu.');
      setCurrentVal(value); // Revert on failure
    } finally {
      setIsSaving(false);
    }
  };

  // 1. BOOLEAN TOGGLE SWITCH (1-Click edit)
  if (column.dataType === 'boolean') {
    const isChecked = !!value;

    const handleToggleBoolean = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!column.editable || isSaving) return;
      const nextVal = !isChecked;
      await handleSave(nextVal);
    };

    return (
      <div className="flex items-center justify-center">
        <button
          type="button"
          disabled={!column.editable || isSaving}
          onClick={handleToggleBoolean}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
            column.editable ? 'cursor-pointer hover:scale-105' : 'cursor-default'
          } ${
            isChecked
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {isSaving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isChecked ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          )}
          <span>{isChecked ? 'Hoạt Động' : 'Đã Khóa'}</span>
        </button>
      </div>
    );
  }

  // 2. AVATAR CELL
  if (column.dataType === 'avatar') {
    const name = row.fullname || row.name || row.username || 'User';
    const firstChar = String(name).charAt(0).toUpperCase();

    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center font-black text-xs shrink-0 overflow-hidden shadow-2xs">
          {value ? (
            <img src={value} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{firstChar}</span>
          )}
        </div>
      </div>
    );
  }

  // 3. EDITING MODE ACTIVE
  if (isEditing) {
    if (column.dataType === 'select' || column.dataType === 'badge') {
      const options = column.options || [];

      return (
        <div className="relative flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <select
            ref={selectRef}
            value={String(currentVal ?? '')}
            onChange={(e) => {
              setCurrentVal(e.target.value);
              handleSave(e.target.value);
            }}
            onBlur={() => setIsEditing(false)}
            className="w-full px-2 py-1 rounded-lg border border-[#7C6FE8] text-xs font-bold bg-white focus:outline-none shadow-sm cursor-pointer"
          >
            {options.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type={column.dataType === 'number' || column.dataType === 'currency' ? 'number' : 'text'}
          value={currentVal ?? ''}
          onChange={(e) => setCurrentVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave(currentVal);
            if (e.key === 'Escape') {
              setCurrentVal(value);
              setIsEditing(false);
            }
          }}
          onBlur={() => handleSave(currentVal)}
          className="w-full px-2 py-1 rounded-lg border border-[#7C6FE8] text-xs font-semibold bg-white focus:outline-none shadow-xs"
        />
        {isSaving && <Loader2 className="w-3.5 h-3.5 text-[#7C6FE8] animate-spin shrink-0" />}
      </div>
    );
  }

  // 4. DISPLAY READ-ONLY / DOUBLE CLICK TO EDIT
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (column.editable) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  // Custom cell renderer if provided
  if (column.cell) {
    return (
      <div onDoubleClick={handleDoubleClick} className="w-full">
        {column.cell({ row, value: currentVal, index: 0, isEditing, onInlineChange: (newV) => handleSave(newV) })}
      </div>
    );
  }

  if (column.renderCell) {
    return (
      <div onDoubleClick={handleDoubleClick} className="w-full">
        {column.renderCell(row, isEditing, (newV) => handleSave(newV))}
      </div>
    );
  }

  // Format or Default Display
  let displayContent: React.ReactNode = currentVal;

  if (column.format) {
    displayContent = column.format(currentVal, row);
  } else if (column.dataType === 'currency' || column.dataType === 'number') {
    if (typeof currentVal === 'number') {
      displayContent = (
        <span className="font-mono font-bold text-slate-900">
          {currentVal.toLocaleString('vi-VN')}
        </span>
      );
    }
  } else if (column.dataType === 'badge' || column.dataType === 'select') {
    const matchedOpt = column.options?.find((o) => String(o.value) === String(currentVal));
    const label = matchedOpt?.label || currentVal || '---';

    displayContent = (
      <span
        className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
          matchedOpt?.badgeClass || 'bg-purple-50 text-[#7C6FE8] border-purple-100'
        }`}
      >
        {label}
      </span>
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      title={column.editable ? 'Nhấp đúp để chỉnh sửa ô này' : undefined}
      className={`w-full group/cell relative py-0.5 rounded-md transition-colors ${
        column.editable
          ? 'cursor-pointer hover:bg-purple-50/70 hover:outline-dashed hover:outline-1 hover:outline-[#7C6FE8]/50'
          : ''
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="truncate">{displayContent ?? '---'}</span>
        {column.editable && (
          <Edit2 className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover/cell:opacity-100 transition-opacity shrink-0" />
        )}
      </div>
    </div>
  );
}
