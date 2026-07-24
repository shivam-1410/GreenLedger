import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
}

export function Dialog({ isOpen, onClose, children, title, description }: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-slate-900/95 p-6 shadow-2xl shadow-emerald-950/50 animate-in zoom-in-95 duration-200 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {title && (
          <h2 className="text-xl font-bold tracking-tight text-white mb-1">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-slate-400 mb-5">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  )
}
