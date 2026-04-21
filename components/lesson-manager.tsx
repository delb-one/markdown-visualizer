"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus, Pencil } from "lucide-react";
import { Course, Note } from "@/lib/courses";
import { cn } from "@/lib/utils";

export function LessonManager({ course, lesson, onSuccess, children }: { course: Course, lesson?: Note, onSuccess: () => void, children?: React.ReactNode }) {
  const isEdit = !!lesson;
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(lesson?.id || "");
  const [title, setTitle] = useState(lesson?.title || "");
  const [fileName, setFileName] = useState(lesson?.fileName || "");
  const [loading, setLoading] = useState(false);

  // Auto-fill file name based on ID
  const handleIdChange = (val: string) => {
    setId(val);
    if (!fileName || fileName === `${id}.md`) {
       setFileName(`${val}.md`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/lessons", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          courseId: course.id, 
          oldId: isEdit ? lesson.id : undefined,
          id, 
          title, 
          fileName 
        })
      });
      if (res.ok) {
        setOpen(false);
        if (!isEdit) {
          setId("");
          setTitle("");
          setFileName("");
        }
        onSuccess();
      } else {
        const d = await res.json();
        alert(d.error || "Failed");
      }
    } catch(err) {
      alert("Error saving");
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
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                  "h-6 w-6 ml-auto hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors",
                  isEdit ? "text-muted-foreground/50 h-8 w-8" : "text-sidebar-foreground/50"
                )} aria-label={isEdit ? "Edit Lesson" : "Add Lesson"}>
                  {isEdit ? <Pencil className="h-3.5 w-3.5" /> : <FilePlus className="h-4 w-4" />}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isEdit ? "Edit Lesson" : "Add Lesson"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit Lesson in ${course.title}` : `Add Lesson to ${course.title}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Lesson ID</Label>
            <Input value={id} onChange={e => handleIdChange(e.target.value)} required placeholder="intro" />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Introduction" />
          </div>
          <div className="space-y-2">
            <Label>File Name</Label>
            <Input value={fileName} onChange={e => setFileName(e.target.value)} required placeholder="intro.md" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
