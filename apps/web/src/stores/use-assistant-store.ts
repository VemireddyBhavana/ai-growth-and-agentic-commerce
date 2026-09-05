import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  AssistantProduct,
  ChatMessage,
  ChatSession,
  CartItem,
  AssistantOrder,
  AssistantSettings,
  DynamicBundle,
  ChatApiResponse,
} from '@ai-sales-assistant/types';
import { ASSISTANT_CATALOG } from '../lib/assistant/catalog-data';
import { processShoppingAssistantMessage } from '../lib/assistant/ai-engine';

const DEFAULT_SETTINGS: AssistantSettings = {
  currency: 'INR',
  aiModel: 'agentic-4o',
  creativity: 0.7,
  soundEnabled: true,
  testMode: true,
  maxRecommendations: 3,
  autoApplyBundles: true,
  showMarginMetrics: true,
};

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-user-1',
    role: 'user',
    content: 'Hi, I need a gaming laptop under ₹70,000',
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    status: 'complete',
  },
  {
    id: 'msg-ai-1',
    role: 'assistant',
    content: 'Hello! 👋 I found some great gaming laptops within your budget. Here are my top picks:',
    timestamp: new Date(Date.now() - 3 * 60000 + 5000).toISOString(),
    status: 'complete',
    recommendations: [
      {
        product: ASSISTANT_CATALOG[0], // HP Victus
        confidenceScore: 0.95,
        matchReason: 'Top seller under ₹70,000 with RTX 3050 & 144Hz high refresh display',
        isTopPick: true,
        explainability: {
          intentFit: 'Matches budget (< ₹70k) and gaming performance criteria with RTX 3050 GPU.',
          marginContribution: 'High merchant gross margin of 22%.',
          inventoryHealth: '45 units in local warehouse, fast same-day dispatch available.',
          confidenceBreakdown: [
            { factor: 'Budget Alignment (< ₹70,000)', score: 98 },
            { factor: 'Gaming Spec (RTX 3050 + 144Hz)', score: 95 },
            { factor: 'Customer Satisfaction (4.5 ★)', score: 92 },
          ],
        },
      },
      {
        product: ASSISTANT_CATALOG[1], // Acer Nitro 5
        confidenceScore: 0.91,
        matchReason: 'AMD Ryzen 5 hexa-core processor + CoolBoost dual-fan cooling',
        isTopPick: false,
        explainability: {
          intentFit: 'Strong alternative with high multicore performance for gaming & streaming.',
          marginContribution: '21.5% margin.',
          inventoryHealth: '28 units in stock.',
          confidenceBreakdown: [
            { factor: 'Budget Alignment', score: 92 },
            { factor: 'Processor Power', score: 94 },
          ],
        },
      },
      {
        product: ASSISTANT_CATALOG[2], // ASUS TUF F15
        confidenceScore: 0.89,
        matchReason: 'Military Grade MIL-STD-810H durability + Adaptive Sync panel',
        isTopPick: false,
        explainability: {
          intentFit: 'Durable construction with anti-dust self-cleaning cooling.',
          marginContribution: '22% margin.',
          inventoryHealth: '35 units in stock.',
          confidenceBreakdown: [
            { factor: 'Durability Rating', score: 96 },
            { factor: 'Value Ratio', score: 90 },
          ],
        },
      },
    ],
  },
  {
    id: 'msg-user-2',
    role: 'user',
    content: 'HP Victus looks good. I also need a mouse.',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    status: 'complete',
  },
  {
    id: 'msg-ai-2',
    role: 'assistant',
    content: 'Great choice! 🎮 Here are some recommended gaming mice:',
    timestamp: new Date(Date.now() - 2 * 60000 + 4000).toISOString(),
    status: 'complete',
    recommendations: [
      {
        product: ASSISTANT_CATALOG[3], // Logitech G102
        confidenceScore: 0.97,
        matchReason: 'Best companion gaming mouse with 8000 DPI & LIGHTSYNC RGB',
        isTopPick: true,
        explainability: {
          intentFit: 'Precision 8000 DPI sensor and programmable buttons for competitive gaming.',
          marginContribution: '42% accessory margin.',
          inventoryHealth: '210 units ready to ship.',
          confidenceBreakdown: [
            { factor: 'Companion Compatibility', score: 99 },
            { factor: 'Price & Value', score: 97 },
          ],
        },
      },
    ],
  },
  {
    id: 'msg-user-3',
    role: 'user',
    content: 'Okay, add it.',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    status: 'complete',
  },
  {
    id: 'msg-ai-3',
    role: 'assistant',
    content: `Added to cart! 🛒\n\n**Subtotal (2 items): ₹71,298**\n\nShall I proceed to checkout?`,
    timestamp: new Date(Date.now() - 50000).toISOString(),
    status: 'complete',
    followUpSuggestions: [
      'Proceed to Checkout',
      'Continue Shopping',
      'Add Laptop Backpack',
      'Apply 15% Weekend Discount',
    ],
  },
];

function createInitialSession(): ChatSession {
  const now = new Date().toISOString();
  return {
    id: `session-${Date.now()}`,
    title: 'Gaming Setup Recommendation',
    createdAt: now,
    updatedAt: now,
    messages: INITIAL_CHAT_MESSAGES,
  };
}

interface AssistantState {
  // Navigation & Panels
  isSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  activeRightPanelTab: 'insights' | 'cart';
  isMobileDrawerOpen: boolean;

  // Modals
  activeProductModal: AssistantProduct | null;
  isCheckoutModalOpen: boolean;
  checkoutProduct: AssistantProduct | null;
  checkoutBundle: DynamicBundle | null;
  isSavedModalOpen: boolean;
  isOrdersModalOpen: boolean;
  isSettingsModalOpen: boolean;

  // Conversations
  sessions: ChatSession[];
  activeSessionId: string;
  isGenerating: boolean;
  activeThinkingSteps: string[];
  streamingMessageId: string | null;

  // Commerce Data
  cart: CartItem[];
  savedProducts: AssistantProduct[];
  orders: AssistantOrder[];
  recentSearches: string[];
  settings: AssistantSettings;

  // Active AI Insights for current screen
  currentInsights: ChatApiResponse['insights'] | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (isOpen: boolean) => void;
  setActiveRightPanelTab: (tab: 'insights' | 'cart') => void;
  setMobileDrawerOpen: (isOpen: boolean) => void;

  // Modals Actions
  openProductModal: (product: AssistantProduct) => void;
  closeProductModal: () => void;
  openCheckoutModal: (product?: AssistantProduct, bundle?: DynamicBundle) => void;
  closeCheckoutModal: () => void;
  setSavedModalOpen: (isOpen: boolean) => void;
  setOrdersModalOpen: (isOpen: boolean) => void;
  setSettingsModalOpen: (isOpen: boolean) => void;

  // Chat Actions
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  sendUserMessage: (content: string) => Promise<void>;

  // Cart Actions
  addToCart: (product: AssistantProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  addBundleToCart: (bundle: DynamicBundle) => void;
  clearCart: () => void;

  // Saved / Wishlist Actions
  toggleSaveProduct: (product: AssistantProduct) => void;
  isProductSaved: (productId: string) => boolean;

  // Orders Actions
  addOrder: (order: AssistantOrder) => void;

  // Recent Searches
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Settings
  updateSettings: (newSettings: Partial<AssistantSettings>) => void;
}

export const useAssistantStore = create<AssistantState>()(
  devtools(
    persist(
      (set, get) => {
        const initialSession = createInitialSession();

        return {
          // Layout
          isSidebarOpen: true,
          isRightPanelOpen: true,
          activeRightPanelTab: 'insights',
          isMobileDrawerOpen: false,

          // Modals
          activeProductModal: null,
          isCheckoutModalOpen: false,
          checkoutProduct: null,
          checkoutBundle: null,
          isSavedModalOpen: false,
          isOrdersModalOpen: false,
          isSettingsModalOpen: false,

          // Sessions
          sessions: [initialSession],
          activeSessionId: initialSession.id,
          isGenerating: false,
          activeThinkingSteps: [],
          streamingMessageId: null,

          // Commerce
          cart: [
            { product: ASSISTANT_CATALOG[0], quantity: 1, addedAt: new Date(Date.now() - 120000).toISOString() },
            { 
              product: {
                ...ASSISTANT_CATALOG[3],
                name: 'Logitech G102 Gaming Mouse + Accessories Package',
                price: 9699,
              }, 
              quantity: 1, 
              addedAt: new Date(Date.now() - 60000).toISOString() 
            },
          ],
          savedProducts: [ASSISTANT_CATALOG[0], ASSISTANT_CATALOG[2]],
          orders: [
            {
              id: 'ord-sample-01',
              orderNumber: 'NX-20260830-891',
              items: [{ product: ASSISTANT_CATALOG[1], quantity: 1, addedAt: new Date().toISOString() }],
              subtotal: 2499,
              discount: 0,
              tax: 449.82,
              shipping: 0,
              total: 2948.82,
              currency: 'INR',
              status: 'CONFIRMED',
              paymentStatus: 'COMPLETED',
              paymentMethod: 'UPI',
              razorpayOrderId: 'order_rzp_test_901847',
              razorpayPaymentId: 'pay_rzp_test_8937461',
              customer: {
                name: 'Priya Sharma',
                email: 'priya.sharma@example.com',
                phone: '+91 98765 43210',
                address: '123 MG Road, Bandra West, Mumbai 400050',
              },
              createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
              aiAssisted: true,
              savings: 1500,
            },
          ],
          recentSearches: ['wireless earbuds under 3000', 'smartwatch with amoled', 'desk lamp led'],
          settings: DEFAULT_SETTINGS,
          currentInsights: null,

          // Layout Actions
          toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
          setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
          toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
          setRightPanelOpen: (isRightPanelOpen) => set({ isRightPanelOpen }),
          setActiveRightPanelTab: (activeRightPanelTab) => set({ activeRightPanelTab }),
          setMobileDrawerOpen: (isMobileDrawerOpen) => set({ isMobileDrawerOpen }),

          // Modals Actions
          openProductModal: (activeProductModal) => set({ activeProductModal }),
          closeProductModal: () => set({ activeProductModal: null }),
          openCheckoutModal: (checkoutProduct, checkoutBundle) =>
            set({
              isCheckoutModalOpen: true,
              checkoutProduct: checkoutProduct || null,
              checkoutBundle: checkoutBundle || null,
            }),
          closeCheckoutModal: () =>
            set({
              isCheckoutModalOpen: false,
              checkoutProduct: null,
              checkoutBundle: null,
            }),
          setSavedModalOpen: (isSavedModalOpen) => set({ isSavedModalOpen }),
          setOrdersModalOpen: (isOrdersModalOpen) => set({ isOrdersModalOpen }),
          setSettingsModalOpen: (isSettingsModalOpen) => set({ isSettingsModalOpen }),

          // Chat Actions
          createNewSession: () => {
            const newSession = createInitialSession();
            set((state) => ({
              sessions: [newSession, ...state.sessions],
              activeSessionId: newSession.id,
              currentInsights: null,
              activeThinkingSteps: [],
            }));
          },

          selectSession: (activeSessionId) => set({ activeSessionId }),

          deleteSession: (sessionId) =>
            set((state) => {
              const remaining = state.sessions.filter((s) => s.id !== sessionId);
              if (remaining.length === 0) {
                const fresh = createInitialSession();
                return { sessions: [fresh], activeSessionId: fresh.id };
              }
              const nextActive =
                state.activeSessionId === sessionId ? remaining[0].id : state.activeSessionId;
              return { sessions: remaining, activeSessionId: nextActive };
            }),

          clearAllSessions: () => {
            const fresh = createInitialSession();
            set({ sessions: [fresh], activeSessionId: fresh.id });
          },

          sendUserMessage: async (content: string) => {
            const trimmed = content.trim();
            if (!trimmed) return;

            const state = get();
            const now = new Date().toISOString();
            const userMsgId = `msg-user-${Date.now()}`;
            const userMsg: ChatMessage = {
              id: userMsgId,
              role: 'user',
              content: trimmed,
              timestamp: now,
              status: 'complete',
            };

            const aiMsgId = `msg-ai-${Date.now() + 1}`;
            const pendingAiMsg: ChatMessage = {
              id: aiMsgId,
              role: 'assistant',
              content: '',
              timestamp: new Date().toISOString(),
              status: 'streaming',
              thinkingSteps: [
                'Analyzing shopping query and constraints...',
                'Searching verified product catalog...',
              ],
            };

            // Add query to recent searches
            get().addRecentSearch(trimmed);

            // Update session with user message and pending assistant message
            const currentSession = state.sessions.find((s) => s.id === state.activeSessionId) || state.sessions[0];
            const updatedMessages = [...currentSession.messages, userMsg, pendingAiMsg];
            
            // Auto generate title if it was first message
            const title =
              currentSession.messages.length <= 1
                ? trimmed.slice(0, 28) + (trimmed.length > 28 ? '...' : '')
                : currentSession.title;

            set((s) => ({
              isGenerating: true,
              activeThinkingSteps: pendingAiMsg.thinkingSteps || [],
              streamingMessageId: aiMsgId,
              sessions: s.sessions.map((sess) =>
                sess.id === currentSession.id
                  ? {
                      ...sess,
                      title,
                      updatedAt: new Date().toISOString(),
                      messages: updatedMessages,
                    }
                  : sess
              ),
            }));

            try {
              // Attempt API call with local fallback
              let result: ChatApiResponse;
              try {
                const response = await fetch('/api/assistant/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    message: trimmed,
                    sessionId: currentSession.id,
                    conversationHistory: currentSession.messages.map((m) => ({
                      role: m.role === 'user' ? 'user' : 'assistant',
                      content: m.content,
                    })),
                    settings: state.settings,
                    cartItems: state.cart,
                  }),
                });

                if (response.ok) {
                  result = await response.json();
                } else {
                  result = await processShoppingAssistantMessage(trimmed, [], state.settings, state.cart);
                }
              } catch {
                result = await processShoppingAssistantMessage(trimmed, [], state.settings, state.cart);
              }

              // Update AI message with complete result
              set((s) => ({
                isGenerating: false,
                activeThinkingSteps: [],
                streamingMessageId: null,
                currentInsights: result.insights,
                sessions: s.sessions.map((sess) => {
                  if (sess.id !== currentSession.id) return sess;
                  return {
                    ...sess,
                    updatedAt: new Date().toISOString(),
                    messages: sess.messages.map((msg) => {
                      if (msg.id !== aiMsgId) return msg;
                      return {
                        ...msg,
                        content: result.reply,
                        status: 'complete',
                        thinkingSteps: result.thinkingSteps,
                        recommendations: result.recommendations,
                        followUpSuggestions: result.followUpSuggestions,
                        comparison: result.comparison,
                        bundleOffer: result.bundleOffer,
                      };
                    }),
                  };
                }),
              }));
            } catch (error) {
              set((s) => ({
                isGenerating: false,
                activeThinkingSteps: [],
                streamingMessageId: null,
                sessions: s.sessions.map((sess) => {
                  if (sess.id !== currentSession.id) return sess;
                  return {
                    ...sess,
                    messages: sess.messages.map((msg) => {
                      if (msg.id !== aiMsgId) return msg;
                      return {
                        ...msg,
                        content:
                          'Sorry, I encountered an issue retrieving recommendations. Please try asking again!',
                        status: 'error',
                        errorMessage: error instanceof Error ? error.message : 'Unknown error',
                      };
                    }),
                  };
                }),
              }));
            }
          },

          // Cart Actions
          addToCart: (product, quantity = 1) =>
            set((state) => {
              const existingIndex = state.cart.findIndex((item) => item.product.id === product.id);
              if (existingIndex > -1) {
                const updated = [...state.cart];
                updated[existingIndex].quantity += quantity;
                return { cart: updated };
              }
              return {
                cart: [
                  ...state.cart,
                  {
                    product,
                    quantity,
                    addedAt: new Date().toISOString(),
                  },
                ],
              };
            }),

          removeFromCart: (productId) =>
            set((state) => ({
              cart: state.cart.filter((item) => item.product.id !== productId),
            })),

          updateCartQuantity: (productId, quantity) =>
            set((state) => {
              if (quantity <= 0) {
                return { cart: state.cart.filter((item) => item.product.id !== productId) };
              }
              return {
                cart: state.cart.map((item) =>
                  item.product.id === productId ? { ...item, quantity } : item
                ),
              };
            }),

          addBundleToCart: (bundle) =>
            set((state) => {
              const updatedCart = [...state.cart];
              for (const prod of bundle.products) {
                const existingIndex = updatedCart.findIndex((item) => item.product.id === prod.id);
                if (existingIndex > -1) {
                  updatedCart[existingIndex].quantity += 1;
                } else {
                  updatedCart.push({
                    product: prod,
                    quantity: 1,
                    addedAt: new Date().toISOString(),
                    bundleDiscountApplied: bundle.discountPercentage,
                  });
                }
              }
              return { cart: updatedCart, activeRightPanelTab: 'cart' };
            }),

          clearCart: () => set({ cart: [] }),

          // Saved / Wishlist
          toggleSaveProduct: (product) =>
            set((state) => {
              const exists = state.savedProducts.some((p) => p.id === product.id);
              if (exists) {
                return { savedProducts: state.savedProducts.filter((p) => p.id !== product.id) };
              }
              return { savedProducts: [...state.savedProducts, product] };
            }),

          isProductSaved: (productId) => {
            return get().savedProducts.some((p) => p.id === productId);
          },

          // Orders
          addOrder: (order) =>
            set((state) => ({
              orders: [order, ...state.orders],
            })),

          // Recent Searches
          addRecentSearch: (query) =>
            set((state) => {
              const filtered = state.recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
              return { recentSearches: [query, ...filtered].slice(0, 8) };
            }),

          clearRecentSearches: () => set({ recentSearches: [] }),

          // Settings
          updateSettings: (newSettings) =>
            set((state) => ({
              settings: { ...state.settings, ...newSettings },
            })),
        };
      },
      {
        name: 'ai-shopping-assistant-storage',
        partialize: (state) => ({
          sessions: state.sessions,
          activeSessionId: state.activeSessionId,
          cart: state.cart,
          savedProducts: state.savedProducts,
          orders: state.orders,
          recentSearches: state.recentSearches,
          settings: state.settings,
        }),
      }
    ),
    { name: 'AssistantStore' }
  )
);
