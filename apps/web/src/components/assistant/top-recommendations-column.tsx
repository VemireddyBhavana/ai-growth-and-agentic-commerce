'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';
import { useAssistantStore } from '@/stores/use-assistant-store';
import { ASSISTANT_CATALOG } from '@/lib/assistant/catalog-data';
import type { AssistantProduct } from '@ai-sales-assistant/types';

export const TopRecommendationsColumn: React.FC = () => {
  const { openProductModal } = useAssistantStore();

  // The 3 featured recommendation products from the screenshot
  const recommendations: AssistantProduct[] = [
    ASSISTANT_CATALOG[0], // HP Victus Gaming Laptop
    ASSISTANT_CATALOG[3], // Logitech G102 Gaming Mouse
    ASSISTANT_CATALOG[4], // Laptop Backpack
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/80 p-4 select-none overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="font-heading font-bold text-sm text-zinc-900 dark:text-zinc-100">
            Top Recommendations
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Based on your preference
          </p>
        </div>

        {/* Product Cards List */}
        <div className="space-y-3">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-400 dark:hover:border-violet-600/60 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-200 shadow-2xs group flex flex-col gap-2.5"
            >
              <div className="flex items-start gap-3">
                {/* Product Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 relative border border-zinc-200/80 dark:border-zinc-700/50">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
                    {product.name}
                  </h4>
                  {product.category === 'Accessories' && product.description && (
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                      {product.description.split(',')[0]}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-heading font-bold text-xs text-violet-700 dark:text-violet-400">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
                      {product.rating}
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline" />
                    </span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <button
                type="button"
                onClick={() => openProductModal(product)}
                className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-900/60 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors cursor-pointer text-center"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: View All Products */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
        <button
          type="button"
          onClick={() => openProductModal(recommendations[0])}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-center cursor-pointer shadow-2xs"
        >
          View All Products
        </button>
      </div>
    </div>
  );
};
