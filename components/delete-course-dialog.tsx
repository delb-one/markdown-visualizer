"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Course } from "@/lib/courses";

export function DeleteCourseDialog({ course, onSuccess, children }: { course: Course, onSuccess: () => void, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOpen(false);
        onSuccess();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to delete course");
      }
    } catch(err) {
      alert("Error deleting course");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={e => e.stopPropagation()}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md text-sidebar-foreground/50 transition-colors" aria-label="Delete Course">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Delete Course</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the course <strong>{course.title}</strong>? This action will permanently remove all lessons and the course folder. This cannot be undone.
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
