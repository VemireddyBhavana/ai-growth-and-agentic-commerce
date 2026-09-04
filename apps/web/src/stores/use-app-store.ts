import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { SessionUser } from '@ai-sales-assistant/types';

interface AppState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isSidebarOpen: boolean;
  activeChatSessionId: string | null;

  // Actions
  setUser: (user: SessionUser | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setActiveChatSessionId: (id: string | null) => void;
  resetState: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isSidebarOpen: true,
        activeChatSessionId: null,

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: Boolean(user),
            },
            false,
            'setUser'
          ),

        toggleSidebar: () =>
          set(
            (state) => ({ isSidebarOpen: !state.isSidebarOpen }),
            false,
            'toggleSidebar'
          ),

        setSidebarOpen: (isSidebarOpen) =>
          set({ isSidebarOpen }, false, 'setSidebarOpen'),

        setActiveChatSessionId: (activeChatSessionId) =>
          set({ activeChatSessionId }, false, 'setActiveChatSessionId'),

        resetState: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              activeChatSessionId: null,
            },
            false,
            'resetState'
          ),
      }),
      {
        name: 'ai-sales-assistant-storage',
        partialize: (state) => ({
          isSidebarOpen: state.isSidebarOpen,
          activeChatSessionId: state.activeChatSessionId,
        }),
      }
    ),
    { name: 'AppStore' }
  )
);
