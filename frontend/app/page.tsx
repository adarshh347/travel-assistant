"use client";
// Adjust this import path depending on where your components folder is.
// If your structure is flat, it might just be "./components/ChatInterface"
import ChatInterface from "./components/ChatInterface";

export default function Home() {
  return (
    // h-screen = 100% Viewport Height
    // w-full = 100% Width
    // overflow-hidden = Prevents the outer window from scrolling (scrolling happens inside ChatInterface)
    <main className="h-screen w-full bg-slate-50 overflow-hidden">
      <ChatInterface />
    </main>
  );
}