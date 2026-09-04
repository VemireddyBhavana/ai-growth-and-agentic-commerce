'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Zap, Truck, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import type { RecommendationCardData } from '@ai-sales-assistant/types';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { ExplainableAiCard } from './explainable-ai-card';

interface RecommendationCardProps {
  data: RecommendationCardData;
  layout?: 'grid' | 'list';
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  data,
  layout: _layout = 'grid',
}) => {
  const { product, explainability, isTopPick, isUpsell } = data;
  const {
    addToCart,
    openProductModal,
    openCheckoutModal,
    toggleSaveProduct,
    isProductSaved,
  } = useAssistantStore();

  const isSaved = isProductSaved(product.id);
  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart!`, {
      description: `₹${product.price.toLocaleString('en-IN')} · Ready for checkout`,
      action: {
        label: 'View Cart',
        onClick: () => useAssistantStore.getState().setActiveRightPanelTab('cart'),
      },
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    openCheckoutModal(product);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveProduct(product);
    if (!isSaved) {
      toast.info(`Saved to Wishlist: ${product.name}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className={`group relative rounded-2xl border ${
        isTopPick
          ? 'border-violet-500/50 bg-gradient-to-b from-violet-950/20 via-zinc-900/80 to-zinc-950/90 shadow-lg shadow-violet-500/10'
          : 'border-white/10 bg-zinc-900/70 hover:border-white/20'
      } backdrop-blur-xl overflow-hidden transition-all duration-300 flex flex-col`}
    >
      {/* Top Highlight Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 items-center pointer-events-none">
        {isTopPick && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current text-amber-300" />
            Top AI Pick
          </span>
        )}
        {isUpsell && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
            Pro Upgrade
          </span>
        )}
        {product.badge && !isTopPick && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-zinc-200 border border-white/15 backdrop-blur-md">
            {product.badge}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleToggleSave}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isSaved
            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
            : 'bg-black/50 text-zinc-300 hover:text-white hover:bg-black/70'
        }`}
        aria-label={isSaved ? 'Remove from saved' : 'Save to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image Area */}
      <div
        onClick={() => openProductModal(product)}
        className="relative w-full h-48 sm:h-52 bg-zinc-950/60 overflow-hidden cursor-pointer"
      >
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">
            Product Visual
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-white/90 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 shadow-xl">
            <Eye className="w-3.5 h-3.5" />
            Quick View Specs
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono text-zinc-400 uppercase tracking-wider text-[10px]">
              {product.brand} · {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-zinc-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => openProductModal(product)}
            className="font-heading text-base font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Pricing & Discount */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg sm:text-xl font-bold font-heading text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-xs text-zinc-400 line-through">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
                {discountPercent && (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {discountPercent}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          {/* Stock & Delivery Tag */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1 text-zinc-400">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              {product.deliveryEstimate}
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              In Stock ({product.stock})
            </span>
          </div>
        </div>

        {/* Explainable AI Section */}
        <div className="pt-2">
          <ExplainableAiCard explainability={explainability} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 group/btn"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
            Buy Now
            <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
