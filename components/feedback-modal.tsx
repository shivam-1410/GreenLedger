'use client';

import React, { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { Button } from './ui/button';
import { FeedbackCategory } from '@/types';
import { MessageSquareHeart, Star, X, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { publicKey } = useWalletStore();
  const { addFeedback } = useAppStore();

  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('UI/UX');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [npsScore, setNpsScore] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter your feedback comments before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Direct API call
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey || '',
          userName: userName || 'Anonymous Builder',
          rating,
          category,
          comment,
          npsScore,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addFeedback(data.feedback);
        toast.success('Thank you! Your feedback has been recorded for Level 4 verification.');
        setIsOpen(false);
        setComment('');
      } else {
        toast.error(data.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      toast.error('Network error submitting feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Widget */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all group"
      >
        <MessageSquareHeart className="h-5 w-5 stroke-[2.5]" />
        <span className="text-xs tracking-wide uppercase font-extrabold hidden sm:inline">User Feedback</span>
        <span className="flex h-2 w-2 rounded-full bg-slate-950 animate-ping" />
      </button>

      {/* Feedback Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-slate-900/95 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <MessageSquareHeart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Product Feedback & Validation</h3>
                  <p className="text-xs text-slate-400">Share your real experience with GreenLedger Protocol</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Name / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova (ESG Director)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="UI/UX">UI / UX Design</option>
                    <option value="Transaction Speed">Transaction Speed</option>
                    <option value="Wallet Connection">Wallet Connection</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="General">General Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Satisfaction Rating</label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  How likely are you to recommend GreenLedger? (NPS 0 - 10)
                </label>
                <div className="flex items-center justify-between gap-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNpsScore(num)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                        npsScore === num
                          ? 'bg-emerald-500 text-slate-950 scale-110'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Detailed Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Describe what you liked, transaction speeds, wallet integration performance, or features you would like to see..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {publicKey && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Wallet Verified: {publicKey.substring(0, 10)}...{publicKey.substring(publicKey.length - 6)}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="glow"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
