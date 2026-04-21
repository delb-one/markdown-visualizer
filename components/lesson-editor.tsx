"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface LessonEditorProps {
  courseId: string;
  fileName: string;
  initialContent: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

export function LessonEditor({ courseId, fileName, initialContent, onSave, onCancel }: LessonEditorProps) {
  const [value, setValue] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${courseId}/${fileName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value })
      });
      if (res.ok) {
        onSave(value || "");
      } else {
        alert("Failed to save");
      }
    } catch {
      alert("Error saving");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full pt-14 has-[.w-md-editor-fullscreen]:relative has-[.w-md-editor-fullscreen]:z-[99999]">
      <div className="flex items-center justify-end gap-2 p-2 px-4 border-b border-border/70 bg-background/60 backdrop-blur-md">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
      </div>
      <div className="flex-1 overflow-hidden" data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}>
          <MDEditor
            value={value}
            onChange={(val) => setValue(val || "")}
            height="100%"
            preview="live"
            className="[&.w-md-editor-fullscreen]:!z-[99999]"
            style={{ borderRadius: 0, border: 'none', height: '100%' }}
          />
      </div>
    </div>
  );
}
