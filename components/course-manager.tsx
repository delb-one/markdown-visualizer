"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus, Pencil } from "lucide-react";
import { Course } from "@/lib/courses";

export function CourseManager({ course, onSuccess, children }: { course?: Course; onSuccess: () => void; children?: React.ReactNode }) {
  const isEdit = !!course;
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(course?.id || "");
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/courses/${course.id}` : "/api/courses", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, description })
      });
      if (res.ok) {
        setOpen(false);
        if (!isEdit) {
          setId("");
          setTitle("");
          setDescription("");
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
                <Button variant="ghost" size="icon" aria-label={isEdit ? "Edit Course" : "Add Course"} className={isEdit ? "h-8 w-8 text-muted-foreground hover:text-foreground" : ""}>
                  {isEdit ? <Pencil className="w-4 h-4" /> : <FolderPlus className="w-5 h-5" />}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side={isEdit ? "top" : "right"}>
              <p>{isEdit ? "Edit Course" : "Add Course"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Course" : "Add Course"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Course ID (Folder name)</Label>
            <Input value={id} onChange={e => setId(e.target.value)} required placeholder="e.g. advanced-react" />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Advanced React" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Saving..." : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
