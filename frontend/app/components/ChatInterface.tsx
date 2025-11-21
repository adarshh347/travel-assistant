"use client";
import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: str;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "こんにちは！今日はどちらへお出かけですか？天気に合わせてプランを提案します。" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: str) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages as Message[]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:9004/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      setMessages([...newMessages, { role: "assistant", content: data.response }] as Message[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscription = (text: str) => {
    // Automatically send message after transcription
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-slate-400 text-sm animate-pulse">AI is thinking...</div>}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
        <AudioRecorder onTranscriptionComplete={handleTranscription} />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="メッセージを入力..."
          className="flex-1 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />

        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}