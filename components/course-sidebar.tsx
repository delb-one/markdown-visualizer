"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileText,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Course, Note } from "@/lib/courses";

interface CourseSidebarProps {
  courses: Course[];
  selectedCourse: Course | null;
  selectedNote: Note | null;
  onSelectCourse: (course: Course) => void;
  onSelectNote: (course: Course, note: Note) => void;
}

export function CourseSidebar({
  courses,
  selectedCourse,
  selectedNote,
  onSelectCourse,
  onSelectNote,
}: CourseSidebarProps) {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set(selectedCourse ? [selectedCourse.id] : []),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCourse = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const filteredCourses = courses
    .map((course) => ({
      ...course,
      notes: course.notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.notes.length > 0,
    );

  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-sidebar-foreground" />
          <h1 className="font-semibold text-sidebar-foreground">
            Course Notes
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCourses.map((course) => (
            <div key={course.id} className="mb-1">
              <button
                onClick={() => {
                  toggleCourse(course.id);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  selectedCourse?.id === course.id && !selectedNote
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground",
                )}
              >
                {expandedCourses.has(course.id) ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
                <BookOpen className="h-4 w-4 shrink-0" />
                <span className="truncate">{course.title}</span>
              </button>

              {expandedCourses.has(course.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {course.notes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => onSelectNote(course, note)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        selectedNote?.id === note.id
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{note.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No notes found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
