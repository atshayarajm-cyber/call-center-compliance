"use client";

import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { useRef } from "react";

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  selectedFileName?: string;
}

export function UploadBox({ onFileSelect, selectedFileName }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      type="button"
      onClick={() => inputRef.current?.click()}
      className="glass glow-border flex w-full flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-cyan-300/30 px-6 py-12 text-center"
    >
      <UploadCloud className="text-cyan-300" size={34} />
      <div>
        <div className="text-lg font-medium text-white">Drag, drop, or browse call recordings</div>
        <div className="mt-2 text-sm text-slate-300">Supports long-form audio, Hindi/Hinglish, Tamil/Tanglish, and batch URLs.</div>
      </div>
      <div className="rounded-full bg-cyan-400/10 px-4 py-2 text-xs text-cyan-200">
        {selectedFileName ?? "No local file selected"}
      </div>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="audio/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </motion.button>
  );
}
