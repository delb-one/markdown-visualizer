"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Course, Note } from "@/lib/courses";

export function DeleteLessonDialog({ course, lesson, onSuccess }: { course: Course, lesson: Note, onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, fileName: lesson.fileName })
      });
      if (res.ok) {
        setOpen(false);
        onSuccess();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to delete lesson");
      }
    } catch(err) {
      alert("Error deleting lesson");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={e => e.stopPropagation()}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md text-sidebar-foreground/50 transition-colors" aria-label="Delete Lesson">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Delete Lesson</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Delete Lesson</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the lesson <strong>{lesson.title}</strong>? This action will permanently remove the markdown file. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? "Deleting..." : "Delete"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
