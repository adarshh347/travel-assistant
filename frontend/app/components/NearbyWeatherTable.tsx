"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, CloudSun } from "lucide-react";

// Define the shape of data coming from Python
interface WeatherRow {
  city: string;
  temp: string;
  condition: string;
  error?: boolean;
}

interface Props {
  data: WeatherRow[];
}

export default function NearbyWeatherTable({ data }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safety check: if data is empty or null, don't render anything
  if (!data || data.length === 0) return null;

  // The first item is always the "Main City" asked by the user
  const mainCity = data[0];
  // The rest are the "Nearby Cities"
  const nearbyCities = data.slice(1);

  return (
    <div className="mt-3 max-w-sm w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">

      {/* Header: Main City (Always Visible) */}
      <div
        onClick={() => nearbyCities.length > 0 && setIsExpanded(!isExpanded)}
        className={`p-4 flex items-center justify-between transition-colors ${nearbyCities.length > 0 ? 'cursor-pointer hover:bg-slate-50' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{mainCity.city}</h3>
            <p className="text-sm text-slate-500">{mainCity.temp} • {mainCity.condition}</p>
          </div>
        </div>

        {/* Toggle Icon (Only shows if there are nearby cities) */}
        {nearbyCities.length > 0 && (
          <div className="text-slate-400">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        )}
      </div>

      {/* Expandable Section: Nearby Cities */}
      {isExpanded && nearbyCities.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nearby Areas</p>
            <div className="space-y-2 pb-3">
              {nearbyCities.map((city, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm p-2 bg-white rounded-md border border-slate-100 shadow-sm">
                  <span className="font-medium text-slate-700">{city.city}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-mono">{city.temp}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      city.condition.includes("Rain") ? "bg-blue-100 text-blue-700" :
                      city.condition.includes("Clear") ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {city.condition}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}