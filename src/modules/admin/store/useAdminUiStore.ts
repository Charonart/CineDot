import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUiState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAdminUiStore = create<AdminUiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: 'cinedot_admin_ui_storage',
    }
  )
);
