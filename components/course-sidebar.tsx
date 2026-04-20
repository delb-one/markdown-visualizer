"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileText,
  Search,
  Book,
  LibraryBig,
  Library,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Course, Note } from "@/lib/courses";
import { CourseManager } from "@/components/course-manager";
import { LessonManager } from "@/components/lesson-manager";
import { DeleteCourseDialog } from "@/components/delete-course-dialog";
import { DeleteLessonDialog } from "@/components/delete-lesson-dialog";

interface CourseSidebarProps {
  courses: Course[];
  selectedCourse: Course | null;
  selectedNote: Note | null;
  onSelectCourse: (course: Course) => void;
  onSelectNote: (course: Course, note: Note) => void;
  onCoursesChange?: () => void;
  collapsed?: boolean;
}

export function CourseSidebar({
  courses,
  selectedCourse,
  selectedNote,
  onSelectCourse,
  onSelectNote,
  onCoursesChange = () => {},
  collapsed = false,
}: CourseSidebarProps) {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set(selectedCourse ? [selectedCourse.id] : []),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCollapsedCourses, setExpandedCollapsedCourses] = useState<
    Set<string>
  >(new Set());

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
  const collapsedItems = selectedCourse
    ? selectedCourse.notes.map((note, noteIndex) => ({
        course: selectedCourse,
        note,
        chapterNumber: `${noteIndex + 1}`,
      }))
    : [];

  const toggleCollapsedCourse = (courseId: string) => {
    const nextExpanded = new Set(expandedCollapsedCourses);
    if (nextExpanded.has(courseId)) {
      nextExpanded.delete(courseId);
    } else {
      nextExpanded.add(courseId);
    }
    setExpandedCollapsedCourses(nextExpanded);
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar">
      <div
        className={cn(
          "border-b group",
          collapsed
            ? "h-14 border-sidebar-border/70 p-4"
            : "border-sidebar-border p-4",
        )}
      >
        <div
          className={cn(
            "relative flex h-6 items-center",
            collapsed && "justify-center",
          )}
        >
          <Library className="h-5 w-5 shrink-0 text-sidebar-foreground" />
          <h1
            className={cn(
              "ml-2 whitespace-nowrap font-semibold text-sidebar-foreground transition-opacity duration-150",
              collapsed && "pointer-events-none absolute opacity-0",
            )}
          >
            Course Notes
          </h1>
          {!collapsed && (
            <div className="ml-auto flex items-center pr-1  group-hover:opacity-100 transition-opacity">
              <CourseManager onSuccess={onCoursesChange} />
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
            />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 p-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex w-full flex-col items-center"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleCollapsedCourse(course.id)}
                      className={cn(
                        "flex h-10 w-full items-center justify-center gap-1 rounded-md transition-colors ",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        expandedCollapsedCourses.has(course.id)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground",
                      )}
                      aria-label={`Toggle notes for ${course.title}`}
                    >
                      <span className="text-[11px] font-semibold leading-none">
                        {expandedCollapsedCourses.has(course.id) ? (
                          <BookOpen className="h-4 w-4 shrink-0" />
                        ) : (
                          <Book className="h-4 w-4 shrink-0" />
                        )}{" "}
                      </span>
                      {/* {expandedCollapsedCourses.has(course.id) ? (
                        <ChevronDown className="h-3 w-3 shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 shrink-0" />
                      )} */}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <p className="font-medium">{course.title}</p>
                  </TooltipContent>
                </Tooltip>

                {expandedCollapsedCourses.has(course.id) && (
                  <div className="mt-1 flex w-full flex-col items-center gap-2">
                    {course.notes.map((note, noteIndex) => (
                      <Tooltip key={`${course.id}-${note.id}`}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onSelectNote(course, note)}
                            className={cn(
                              "flex size-10 items-center justify-center rounded-md transition-colors",
                              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              selectedNote?.id === note.id
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-muted-foreground",
                            )}
                            aria-label={`${course.title} - ${note.title}`}
                          >
                            <span className="text-[11px] font-semibold leading-none">
                              {/* <FileText className="h-3.5 w-3.5 shrink-0" />{" "} */}
                              {noteIndex + 1}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          <p className="font-medium">{note.title}</p>
                          <p className="text-[11px] opacity-80">
                            {course.title}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {filteredCourses.map((course) => (
              <div key={course.id} className="mb-1 group/course">
                <div
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md pr-1 transition-colors",
                    selectedCourse?.id === course.id && !selectedNote
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
                  )}
                >
                  <button
                    onClick={() => {
                      toggleCourse(course.id);
                    }}
                    className="flex flex-1 items-center gap-2 pl-3 py-2 text-sm font-medium"
                  >
                    {expandedCourses.has(course.id) ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1 text-left">{course.title}</span>
                  </button>
                  <div className="opacity-0 group-hover/course:opacity-100 transition-opacity flex items-center pr-1">
                    <LessonManager course={course} onSuccess={onCoursesChange} />
                    <DeleteCourseDialog course={course} onSuccess={onCoursesChange} />
                  </div>
                </div>

                {expandedCourses.has(course.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {course.notes.map((note) => (
                      <div key={note.id} className="group/lesson flex w-full items-center pr-2">
                        <button
                          onClick={() => onSelectNote(course, note)}
                          className={cn(
                            "flex flex-1 items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            selectedNote?.id === note.id
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{note.title}</span>
                        </button>
                        <div className="opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                          <DeleteLessonDialog course={course} lesson={note} onSuccess={onCoursesChange} />
                        </div>
                      </div>
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
        )}
      </ScrollArea>
    </div>
  );
}
