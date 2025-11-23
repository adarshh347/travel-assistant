"use client";
import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

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

      // ✅ FIX: Explicitly define the mimeType for better compatibility
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        // ✅ FIX: Use the same mimeType for the Blob
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await handleUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
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
    // Filename explicit extension helps the backend identify format
    formData.append("file", audioBlob, "recording.webm");

    try {
      const res = await fetch(`${API_BASE_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // ✅ Logic to handle object vs string response safely
      let textResult = data.transcription;

      if (typeof textResult === 'object' && textResult !== null) {
          textResult = textResult.text || JSON.stringify(textResult);
      }

      // Only update if we have valid text
      if (textResult && typeof textResult === 'string' && textResult.trim().length > 0) {
        onTranscriptionComplete(textResult);
      } else {
        console.warn("Empty transcription received");
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
      className={`p-3 rounded-full transition-all shadow-md ${
        isRecording
          ? "bg-red-500 hover:bg-red-600 animate-pulse text-white"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
      }`}
    >
      {isProcessing ? (
        <Loader2 className="animate-spin" size={20} />
      ) : isRecording ? (
        <Square size={20} fill="currentColor" />
      ) : (
        <Mic size={20} />
      )}
    </button>
  );
}