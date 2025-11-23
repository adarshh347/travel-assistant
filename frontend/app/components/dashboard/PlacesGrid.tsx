"use client";
import { Map, ArrowRight } from "lucide-react";

interface Place {
  name: string;
  description: string;
  type: string;
}

interface Props {
  places: Place[];
  onPlaceClick: (name: string) => void;
}

export default function PlacesGrid({ places, onPlaceClick }: Props) {
  // Safety check to prevent crashing if backend sends null
  if (!places || places.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Map size={18} className="text-slate-400" />
        <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Recommended Spots</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {places.map((place, i) => (
          <div
            key={i}
            onClick={() => onPlaceClick(place.name)}
            className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all relative overflow-hidden"
          >
            {/* Tag */}
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                 {place.type}
            </span>

            <h4 className="font-bold text-slate-800 text-lg mt-4 mb-2 group-hover:text-blue-600 transition-colors">
                {place.name}
            </h4>

            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {place.description}
            </p>

            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                View Details <ArrowRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}