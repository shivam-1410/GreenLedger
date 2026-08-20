'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CarbonCredit } from '@/types';
import { CreditCard } from './credit-card';
import { Search, Trees, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { Input } from './ui/input';

interface MarketplaceCarouselProps {
  projects: CarbonCredit[];
  userInventory: { creditId: string; amount: number }[];
  onBuy: (credit: CarbonCredit) => void;
  onRetire: (credit: CarbonCredit) => void;
  onSwipeOffsetChange?: (offset: number) => void;
}

const CATEGORIES = ['All', 'Reforestation', 'Solar Energy', 'Blue Carbon', 'Direct Air Capture'];

export function MarketplaceCarousel({
  projects,
  userInventory,
  onBuy,
  onRetire,
  onSwipeOffsetChange,
}: MarketplaceCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.creditType === activeCategory;
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creditType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getOwnedAmount = (creditId: string) => {
    const inv = userInventory.find((i) => i.creditId === creditId);
    return inv ? inv.amount : 0;
  };

  // Stagger Container Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Horizontally Swipeable Filter Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
        {/* Category Filter Pills (Drag-Scrollable) */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -100, right: 0 }}
          className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none cursor-grab active:cursor-grabbing"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl -z-10 shadow-lg shadow-emerald-500/20"
                  />
                )}
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search project name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-950/60 border-slate-800 text-slate-200"
          />
        </div>
      </div>

      {/* Projects Display: Mobile Peeking Swipe Carousel vs Desktop Responsive Grid */}
      {filteredProjects.length > 0 ? (
        <>
          {/* Mobile Swipeable Carousel (Peeking card layout) */}
          <div className="md:hidden overflow-hidden py-2 -mx-4 px-4">
            <motion.div
              ref={carouselRef}
              drag={shouldReduceMotion ? false : 'x'}
              dragConstraints={{
                left: -(filteredProjects.length - 1) * 290,
                right: 0,
              }}
              dragElastic={0.12}
              onDrag={(e, info) => {
                if (onSwipeOffsetChange) {
                  onSwipeOffsetChange(info.offset.x);
                }
              }}
              onDragEnd={(e, info) => {
                if (onSwipeOffsetChange) {
                  onSwipeOffsetChange(0);
                }
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold && activeCardIndex < filteredProjects.length - 1) {
                  setActiveCardIndex((prev) => prev + 1);
                } else if (info.offset.x > swipeThreshold && activeCardIndex > 0) {
                  setActiveCardIndex((prev) => prev - 1);
                }
              }}
              className="flex gap-4 cursor-grab active:cursor-grabbing touch-pan-y"
            >
              {filteredProjects.map((credit, idx) => (
                <motion.div
                  key={credit.id}
                  className="w-[280px] shrink-0 first:pl-0 last:pr-4"
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard
                    credit={credit}
                    userOwnedAmount={getOwnedAmount(credit.id)}
                    onBuy={onBuy}
                    onRetire={onRetire}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Swipe Indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {filteredProjects.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeCardIndex ? 'w-5 bg-emerald-400' : 'w-1.5 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid Layout (Staggered Mount Animations) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((credit) => (
              <motion.div key={credit.id} variants={cardVariants}>
                <CreditCard
                  credit={credit}
                  userOwnedAmount={getOwnedAmount(credit.id)}
                  onBuy={onBuy}
                  onRetire={onRetire}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        /* Empty Search Results State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3"
        >
          <Trees className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No Carbon Credit Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active project listings matched your search criteria. Try adjusting filters or search queries.
          </p>
        </motion.div>
      )}
    </div>
  );
}
