"use client";

import { useState, useRef, useEffect } from "react";
import AudioRecorder from "./AudioRecorder";
import NearbyWeatherTable from "./NearbyWeatherTable";
import { Send, Bot, User } from "lucide-react";

// ★ ADDED THIS IMPORT
import { API_BASE_URL } from "../../config/api";

// Updated type definition to include the structured data
type Message = {
  role: "user" | "assistant";
  content: string;
  weatherData?: any[]; // Array of weather objects
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "こんにちは！今日はどちらへお出かけですか？天気に合わせてプランを提案します。",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add User Message
    const newMessages = [...messages, { role: "user", content: text } as Message];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // ★ UPDATED THIS LINE
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      // Add Assistant Message + Weather Data
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.response,
          weatherData: data.weather_data,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong with the server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscription = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-[70vh] max-h-[800px] bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Bot size={20} className="text-white" />
        </div>

        <div>
          <h2 className="font-bold text-slate-800">Travel Assistant</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar for Assistant */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-blue-600" />
              </div>
            )}

            <div
              className={`flex flex-col max-w-[85%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Text Bubble */}
              <div
                className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>

              {/* Weather Table */}
              {msg.weatherData && <NearbyWeatherTable data={msg.weatherData} />}
            </div>

            {/* Avatar for User */}
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-slate-500" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-11">
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
          <AudioRecorder onTranscriptionComplete={handleTranscription} />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type or speak (Japanese)..."
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400"
          />

          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
