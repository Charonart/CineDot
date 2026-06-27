"use client";

import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X, Plus, Trash2, Loader2, User } from 'lucide-react';
import { useMovieCredits, useAddMovieCredit, useDeleteMovieCredit } from '@/modules/movie/hooks/useAdminMovies';

interface CreditsFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number | string | null;
  movieTitle: string;
}

export function CreditsFormDialog({ isOpen, onClose, movieId, movieTitle }: CreditsFormDialogProps) {
  const { data: credits, isLoading } = useMovieCredits(movieId || '');
  const addCreditMutation = useAddMovieCredit(movieId || '');
  const deleteCreditMutation = useDeleteMovieCredit(movieId || '');

  const [personId, setPersonId] = useState('');
  const [creditType, setCreditType] = useState<'cast' | 'crew'>('cast');
  const [characterName, setCharacterName] = useState('');
  const [jobName, setJobName] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personId) {
      setError('Vui lòng nhập Person ID');
      return;
    }
    setError('');

    const payload = {
      person_id: Number(personId),
      credit_type: creditType,
      character_name: creditType === 'cast' ? characterName : undefined,
      job: creditType === 'crew' ? jobName : undefined,
      order: creditType === 'cast' ? Number(sortOrder) : undefined,
    };

    addCreditMutation.mutate(payload, {
      onSuccess: () => {
        setPersonId('');
        setCharacterName('');
        setJobName('');
        setSortOrder('1');
      },
    });
  };

  const handleDelete = (creditId: number | string, type: 'cast' | 'crew') => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân sự này khỏi phim?')) {
      deleteCreditMutation.mutate({ creditId, type });
    }
  };

  const isMutating = addCreditMutation.isPending || deleteCreditMutation.isPending;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true" />

      {/* Center Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E9E9F8] flex flex-col max-h-[90vh] transition-all transform duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E9E9F8] flex items-center justify-between shrink-0 bg-gray-50/50">
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-[#1C1D22]">
                Quản lý Credits & Nhân sự
              </DialogTitle>
              <p className="text-xs text-[#8B949E] mt-0.5 truncate font-medium">Phim: {movieTitle}</p>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors outline-none shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Split: Left side = List, Right side = Add form */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left list pane */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-[#E9E9F8] space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
                  <span className="text-xs text-[#8B949E] mt-3 font-semibold">Đang tải credits...</span>
                </div>
              ) : (
                <>
                  {/* Cast section */}
                  <div>
                    <h3 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-3">Diễn viên (Cast)</h3>
                    {(!credits?.cast || credits.cast.length === 0) ? (
                      <p className="text-xs text-gray-400 italic">Chưa có diễn viên nào</p>
                    ) : (
                      <div className="space-y-3">
                        {credits.cast.map((c: any) => (
                          <div key={c.personId} className="flex items-center justify-between p-2.5 bg-gray-50 border border-transparent hover:border-[#E9E9F8] rounded-xl transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-100 flex items-center justify-center shrink-0">
                                {c.avatarUrl ? (
                                  <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#1C1D22]">{c.name}</span>
                                <span className="text-[11px] text-[#8B949E] font-medium mt-0.5">vai {c.role || 'Chưa rõ'}</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDelete(c.personId || c.creditId, 'cast')}
                              disabled={isMutating}
                              className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors outline-none shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Crew section */}
                  <div>
                    <h3 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider mb-3">Đoàn làm phim (Crew)</h3>
                    {(!credits?.crew || credits.crew.length === 0) ? (
                      <p className="text-xs text-gray-400 italic">Chưa có thành viên đoàn phim</p>
                    ) : (
                      <div className="space-y-3">
                        {credits.crew.map((c: any) => (
                          <div key={c.personId} className="flex items-center justify-between p-2.5 bg-gray-50 border border-transparent hover:border-[#E9E9F8] rounded-xl transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-100 flex items-center justify-center shrink-0">
                                {c.avatarUrl ? (
                                  <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#1C1D22]">{c.name}</span>
                                <span className="text-[11px] text-[#8B949E] font-medium mt-0.5">{c.job || 'Crew'} ({c.department})</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDelete(c.personId || c.creditId, 'crew')}
                              disabled={isMutating}
                              className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors outline-none shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Form pane */}
            <form onSubmit={handleAdd} className="w-full md:w-80 p-6 bg-gray-50/50 flex flex-col justify-between overflow-y-auto shrink-0 border-t md:border-t-0 border-[#E9E9F8]">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#1C1D22] uppercase tracking-wider">Thêm nhân sự mới</h3>
                
                {/* Person ID */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider">Person ID</label>
                  <input
                    type="number"
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                    placeholder="Ví dụ: 819, 7467"
                    className="w-full bg-white border border-[#E9E9F8] rounded-xl px-3.5 py-2 outline-none text-xs focus:border-[#4F46E5] transition-all"
                  />
                  {error && <span className="text-[10px] text-red-500 font-semibold">{error}</span>}
                </div>

                {/* Credit Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider">Vai trò</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCreditType('cast')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${creditType === 'cast' ? 'bg-white shadow-sm text-[#4F46E5]' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Diễn viên
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreditType('crew')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${creditType === 'crew' ? 'bg-white shadow-sm text-[#4F46E5]' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Đoàn phim
                    </button>
                  </div>
                </div>

                {/* Dynamic fields */}
                {creditType === 'cast' ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider">Tên nhân vật vai diễn</label>
                      <input
                        type="text"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder="Ví dụ: The Narrator"
                        className="w-full bg-white border border-[#E9E9F8] rounded-xl px-3.5 py-2 outline-none text-xs focus:border-[#4F46E5] transition-all"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider">Thứ tự hiển thị</label>
                      <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        placeholder="1"
                        className="w-full bg-white border border-[#E9E9F8] rounded-xl px-3.5 py-2 outline-none text-xs focus:border-[#4F46E5] transition-all"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider">Công việc đảm nhiệm</label>
                    <input
                      type="text"
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      placeholder="Ví dụ: Director, Producer"
                      className="w-full bg-white border border-[#E9E9F8] rounded-xl px-3.5 py-2 outline-none text-xs focus:border-[#4F46E5] transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isMutating || isLoading}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-[#4F46E5]/10 disabled:opacity-50 outline-none shrink-0"
              >
                {isMutating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>Thêm nhân sự</span>
              </button>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
