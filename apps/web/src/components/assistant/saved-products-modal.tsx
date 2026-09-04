'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Trash2, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAssistantStore } from '@/stores/use-assistant-store';

export const SavedProductsModal: React.FC = () => {
  const {
    isSavedModalOpen,
    setSavedModalOpen,
    savedProducts,
    toggleSaveProduct,
    addToCart,
    openCheckoutModal,
    openProductModal,
  } = useAssistantStore();

  if (!isSavedModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSavedModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950/95 text-zinc-100 shadow-2xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 px-6 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-current" />
              <h3 className="font-heading font-bold text-base text-white">
                Saved Products & Wishlist ({savedProducts.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setSavedModalOpen(false)}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="p-6 space-y-3 flex-1 overflow-y-auto">
            {savedProducts.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <Heart className="w-10 h-10 mx-auto text-zinc-400" />
                <p className="text-sm">Your wishlist is currently empty.</p>
                <p className="text-xs text-zinc-400">
                  Tap the heart icon on any product card to save items for later.
                </p>
              </div>
            ) : (
              savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl flex items-center gap-4 group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onClick={() => {
                      setSavedModalOpen(false);
                      openProductModal(product);
                    }}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 cursor-pointer shrink-0"
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-400">
                        {product.brand} · {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h4
                      onClick={() => {
                        setSavedModalOpen(false);
                        openProductModal(product);
                      }}
                      className="font-heading font-semibold text-sm text-zinc-100 hover:text-violet-300 transition-colors cursor-pointer truncate"
                    >
                      {product.name}
                    </h4>

                    <div className="text-sm font-bold font-mono text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, 1);
                        toast.success(`Added ${product.name} to cart!`);
                      }}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSavedModalOpen(false);
                        openCheckoutModal(product);
                      }}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                      Buy Now
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSaveProduct(product)}
                      className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-rose-400"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
