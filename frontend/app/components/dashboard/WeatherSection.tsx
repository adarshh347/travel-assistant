"use client";
import { CloudSun, MapPin, Droplets, Wind, Umbrella, ChevronRight } from "lucide-react";

interface WeatherData {
  city: string;
  temp: string;
  condition: string;
  humidity?: string;
  wind?: string;
  rain_chance?: string;
  error?: boolean;
}

export default function WeatherSection({ data }: { data: WeatherData[] }) {
  if (!data || data.length === 0) return null;

  const main = data[0]; // Main City
  const nearby = data.slice(1); // Revived Nearby Cities

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Top: Main Weather */}
      <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="flex justify-between items-start">
          <div>
             <div className="flex items-center gap-1 opacity-80 mb-1">
                <MapPin size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Current</span>
             </div>
             <h2 className="text-3xl font-bold">{main.city}</h2>
             <p className="text-blue-100 font-medium">{main.condition}</p>
          </div>
          <div className="text-5xl font-extrabold tracking-tighter">{main.temp}</div>
        </div>

        {/* New Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/20">
            <div className="text-center">
                <div className="flex items-center justify-center gap-1 opacity-70 mb-1">
                    <Droplets size={12} /> <span className="text-[10px]">HUMIDITY</span>
                </div>
                <p className="font-bold">{main.humidity || "N/A"}</p>
            </div>
            <div className="text-center border-l border-white/20">
                <div className="flex items-center justify-center gap-1 opacity-70 mb-1">
                    <Wind size={12} /> <span className="text-[10px]">WIND</span>
                </div>
                <p className="font-bold">{main.wind || "N/A"}</p>
            </div>
            <div className="text-center border-l border-white/20">
                <div className="flex items-center justify-center gap-1 opacity-70 mb-1">
                    <Umbrella size={12} /> <span className="text-[10px]">RAIN</span>
                </div>
                <p className="font-bold">{main.rain_chance || "0%"}</p>
            </div>
        </div>
      </div>

      {/* Bottom: Revived Nearby Cities Table */}
      {nearby.length > 0 && (
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex-1">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Nearby Locations</p>
            <div className="space-y-2">
                {nearby.map((city, i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                        <span className="font-medium text-slate-700">{city.city}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">{city.condition}</span>
                            <span className="font-bold text-slate-800">{city.temp}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}