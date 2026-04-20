"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus } from "lucide-react";
import { Course } from "@/lib/courses";

export function LessonManager({ course, onSuccess }: { course: Course, onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, id, title, fileName })
      });
      if (res.ok) {
        setOpen(false);
        setId("");
        setTitle("");
        setFileName("");
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md text-sidebar-foreground/50 transition-colors" aria-label="Add Lesson">
                <FilePlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Add Lesson</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Lesson to {course.title}</DialogTitle>
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
