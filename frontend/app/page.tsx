"use client";
import ChatInterface from "./components/ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-slate-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-2xl font-bold text-center mb-8 text-slate-800">
          Travel & Weather AI Assistant 🌤️✈️
        </h1>
        <ChatInterface />
      </div>
    </main>
  );
}