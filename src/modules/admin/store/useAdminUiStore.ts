import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUiState {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export const useAdminUiStore = create<AdminUiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),
      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    }),
    {
      name: 'cinedot_admin_ui_storage',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
);
