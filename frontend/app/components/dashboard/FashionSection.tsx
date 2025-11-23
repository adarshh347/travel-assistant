"use client";
import { useState } from "react";
import { Shirt, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export default function FashionSection({ advice }: { advice: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-purple-100 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header / Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-purple-50 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-colors"
      >
        <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-200 text-purple-700 rounded-lg">
                <Shirt size={20} />
            </div>
            <div>
                <h3 className="font-bold text-purple-900 text-sm">Fashion Recommendation</h3>
                <p className="text-xs text-purple-600">Click to view outfit advice</p>
            </div>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-purple-400"/> : <ChevronDown size={20} className="text-purple-400"/>}
      </div>

      {/* Content Area */}
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="p-5 text-sm text-slate-700 leading-relaxed border-t border-purple-100 bg-white">
            <div className="flex items-start gap-2">
                <Sparkles size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
                <span>{advice}</span>
            </div>
         </div>
      </div>

      {/* Preview (Shown when closed) */}
      {!isOpen && (
          <div className="p-4 text-xs text-slate-400 italic">
              Based on current temperature and wind...
          </div>
      )}
    </div>
  );
}