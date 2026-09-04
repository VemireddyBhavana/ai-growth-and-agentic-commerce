'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Zap, Truck, ShieldCheck, CheckCircle2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAssistantStore } from '@/stores/use-assistant-store';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    closeProductModal,
    addToCart,
    openCheckoutModal,
    toggleSaveProduct,
    isProductSaved,
  } = useAssistantStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isSaved = isProductSaved(product.id);
  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
    closeProductModal();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    closeProductModal();
    openCheckoutModal(product);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProductModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950/95 text-zinc-100 shadow-2xl z-10 flex flex-col"
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 px-6 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{product.brand}</span>
              <span>/</span>
              <span className="text-zinc-200">{product.category}</span>
              <span>/</span>
              <span className="text-violet-400">{product.sku}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaveProduct(product)}
                className={`p-2 rounded-xl border border-white/10 transition-colors ${
                  isSaved ? 'bg-rose-500 text-white' : 'hover:bg-white/5 text-zinc-400'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={closeProductModal}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Gallery */}
            <div className="space-y-4">
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-black/60 border border-white/10">
                <img
                  src={product.images[selectedImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-600/90 text-white shadow-lg backdrop-blur-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIdx === idx
                          ? 'border-violet-500 scale-105 shadow-md shadow-violet-500/20'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-zinc-400 font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Genuine Warranty</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>Free 2-Day Delivery</span>
                </div>
              </div>
            </div>

            {/* Right: Product Info & Actions */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Title & Ratings */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-current text-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{product.rating}</span>
                    <span className="text-zinc-400 font-normal">
                      ({product.reviewsCount} verified ratings)
                    </span>
                  </div>

                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    {product.name}
                  </h2>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <>
                        <span className="text-sm text-zinc-400 line-through">
                          ₹{product.comparePrice.toLocaleString('en-IN')}
                        </span>
                        {discountPercent && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-mono">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Long Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {product.longDescription || product.description}
                </p>

                {/* Key Features */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono text-zinc-400">Key Features:</span>
                    <ul className="space-y-1.5 text-xs text-zinc-200">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specifications Table */}
                {product.specs && product.specs.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono text-zinc-400">Technical Specifications:</span>
                    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden text-xs">
                      {product.specs.map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between p-2.5 border-b border-white/5 last:border-none"
                        >
                          <span className="text-zinc-400">{spec.name}</span>
                          <span className="text-zinc-200 font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-sm text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold font-heading bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current text-amber-300" />
                  Instant Razorpay Test Checkout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
