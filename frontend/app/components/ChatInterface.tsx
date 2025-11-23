"use client";
import { useState, useRef, useEffect } from "react";
import AudioRecorder from "./AudioRecorder";
import { Send, Bot, User, Loader2, Sparkles, MapPin } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

// Import Dashboard Components
import WeatherSection from "./dashboard/WeatherSection";
import FashionSection from "./dashboard/FashionSection";
import PlacesGrid from "./dashboard/PlacesGrid";

// Types
type MessageType = "text" | "dashboard";

interface Message {
  role: "user" | "assistant";
  type: MessageType;
  content?: string;
  data?: any;
  weatherReport?: any[];
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      type: "text",
      content: "こんにちは！AIトラベルアシスタントです。どこへ旅行に行きますか？\n(Hello! I am your AI Travel Assistant. Where would you like to go?)"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string, isHidden: boolean = false) => {
    if (!text.trim()) return;

    const newHistory: Message[] = isHidden
      ? messages
      : [...messages, { role: "user", type: "text", content: text }];

    if (!isHidden) {
        setMessages(newHistory);
        setInput("");
    }
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const result = await res.json();

      if (result.type === "dashboard") {
          setMessages([
              ...newHistory,
              {
                  role: "assistant",
                  type: "dashboard",
                  data: result.data,
                  weatherReport: result.weather_report
              }
          ]);
      } else {
          setMessages([
              ...newHistory,
              { role: "assistant", type: "text", content: result.response }
          ]);
      }

    } catch (error) {
      console.error(error);
      setMessages([
        ...newHistory,
        { role: "assistant", type: "text", content: "Sorry, I encountered an error connecting to the server." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Triggered when clicking a Place Card
  const handlePlaceClick = (placeName: string) => {
      const prompt = `${placeName}について詳しく教えてください。歴史や見どころを含めて。`;
      sendMessage(prompt, false);
  };

  return (
    // MAIN CONTAINER: Full Height, Full Width, No Borders
    <div className="flex flex-col h-full w-full bg-slate-50">

      {/* 1. HEADER: Sticky at top, blurred background */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                <Bot size={24} />
            </div>
            <div>
                <h1 className="font-bold text-slate-800 text-lg tracking-tight leading-tight">Travel & Weather AI</h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    System Online
                </p>
            </div>
        </div>
      </div>

      {/* 2. CHAT AREA: Expands to fill available space */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {/* Content Wrapper: Limits width for readability on large screens */}
        <div className="max-w-5xl mx-auto w-full px-4 py-8 space-y-10">

          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>

              {/* AI Avatar */}
              {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 text-white shadow-md">
                      <Bot size={16} />
                  </div>
              )}

              <div className={`max-w-[90%] md:max-w-[85%] lg:max-w-[80%] ${msg.role === "user" ? "items-end" : "w-full"}`}>

                {/* === TYPE: TEXT MESSAGE === */}
                {msg.type === "text" && (
                  <div className={`p-5 rounded-2xl shadow-sm text-[15px] leading-7 whitespace-pre-wrap ${
                      msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-blue-200"
                      : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                  }`}>
                    {msg.content}
                  </div>
                )}

                {/* === TYPE: DASHBOARD UI === */}
                {msg.type === "dashboard" && msg.data && (
                   <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2">

                      {/* Dashboard Label */}
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">
                          <Sparkles size={14} className="text-yellow-500" />
                          Travel Plan Generated
                      </div>

                      {/* Top Row: Weather & Fashion (Responsive Grid) */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                          <div className="h-full">
                            <WeatherSection data={msg.weatherReport || []} />
                          </div>
                          <div className="h-full">
                             <FashionSection advice={msg.data.fashion_advice} />
                          </div>
                      </div>

                      {/* Bottom Row: Places (White container for contrast) */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                        <PlacesGrid
                            places={msg.data.places}
                            onPlaceClick={handlePlaceClick}
                        />
                      </div>

                   </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={16} className="text-slate-500"/>
                  </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
              <div className="flex items-center gap-3 ml-12 p-3">
                  <Loader2 size={18} className="animate-spin text-blue-500" />
                  <span className="text-sm text-slate-400 font-medium animate-pulse">Thinking...</span>
              </div>
          )}

          {/* Invisible div to handle auto-scrolling */}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* 3. INPUT AREA: Fixed at bottom */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4 pb-6 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-slate-50 p-2 pr-3 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-inner">

              <AudioRecorder onTranscriptionComplete={(txt) => sendMessage(txt)} />

              <input
                className="flex-1 bg-transparent border-0 px-4 py-3 focus:ring-0 text-slate-700 placeholder:text-slate-400 text-base"
                placeholder="Type a city (e.g., Kyoto) or ask for advice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              />

              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transform active:scale-95"
              >
                <Send size={20}/>
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-3">
                travel assistant
            </p>
        </div>
      </div>
    </div>
  );
}