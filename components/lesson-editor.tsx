"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Spinner } from "./ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { resolvedTheme } = useTheme();

  const isDirty = value !== initialContent;

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

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmModal(true);
    } else {
      onCancel();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full pt-14 has-[.w-md-editor-fullscreen]:relative has-[.w-md-editor-fullscreen]:z-[99999]">
        <div className="flex items-center justify-end gap-2 p-2 px-4 border-b border-border/70 bg-background/60 backdrop-blur-md">
          <Button variant="ghost" onClick={handleCancel} disabled={loading}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="relative"
          >
            {loading ? <><Spinner /> <span className="pl-2">Saving...</span></> : "Save Changes"}
            {isDirty && !loading && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-chart-1"></span>
              </span>
            )}
          </Button>
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

      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in this document. Are you sure you want to cancel? All your modifications will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
