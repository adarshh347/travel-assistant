"use client";
import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface Props {
  onTranscriptionComplete: (text: string) => void;
}

export default function AudioRecorder({ onTranscriptionComplete }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await handleUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Stop mic
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUpload = async (audioBlob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    try {
      // ✅ Updated to Port 9004
      const res = await fetch("http://localhost:9004/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.transcription) {
        onTranscriptionComplete(data.transcription);
      }
    } catch (error) {
      console.error("Transcription failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`p-2 rounded-lg transition-all ${
        isRecording
          ? "bg-red-100 text-red-600 hover:bg-red-200 animate-pulse"
          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
      }`}
      title={isRecording ? "Stop Recording" : "Start Recording"}
    >
      {isProcessing ? (
        <Loader2 className="animate-spin" size={20} />
      ) : isRecording ? (
        <Square size={20} />
      ) : (
        <Mic size={20} />
      )}
    </button>
  );
}