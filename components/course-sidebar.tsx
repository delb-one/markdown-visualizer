"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  FileText,
  Search,
  Book,
  Library,
  MoreVertical,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuGroup,
} from "@/components/ui/context-menu";
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
  collapsed = true,
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
          {collapsed ? (
            <CourseManager onSuccess={onCoursesChange}>
              <button 
                className="flex size-10 items-center justify-center rounded-md hover:bg-sidebar-accent p-1 transition-colors"
                aria-label="Add Course"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Library className="h-5 w-5 shrink-0 text-sidebar-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <p className="font-medium">Add Course</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </CourseManager>
          ) : (
            <Library className="h-5 w-5 shrink-0 text-sidebar-foreground" />
          )}
          <h1
            className={cn(
              "ml-2 whitespace-nowrap font-semibold text-sidebar-foreground transition-opacity duration-150",
              collapsed && "pointer-events-none absolute opacity-0",
            )}
          >
            My Notes
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
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => toggleCollapsedCourse(course.id)}
                            className={cn(
                              "flex size-10 h-10 items-center justify-center gap-1 rounded-md transition-colors ",
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
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          <p className="font-medium">{course.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuGroup>
                      <LessonManager course={course} onSuccess={onCoursesChange}>
                        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Add Lesson</span>
                        </ContextMenuItem>
                      </LessonManager>
                      <CourseManager course={course} onSuccess={onCoursesChange}>
                        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit Course</span>
                        </ContextMenuItem>
                      </CourseManager>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <DeleteCourseDialog course={course} onSuccess={onCoursesChange}>
                      <ContextMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Course</span>
                      </ContextMenuItem>
                    </DeleteCourseDialog>
                  </ContextMenuContent>
                </ContextMenu>

                {expandedCollapsedCourses.has(course.id) && (
                  <div className="mt-1 flex w-full flex-col items-center gap-2">
                    {course.notes.map((note, noteIndex) => (
                      <ContextMenu key={`${course.id}-${note.id}`}>
                        <ContextMenuTrigger asChild>
                          <div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => onSelectNote(course, note)}
                                  className={cn(
                                    "flex size-7 items-center justify-center rounded-md transition-colors",
                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    selectedNote?.id === note.id
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                      : "text-muted-foreground",
                                  )}
                                  aria-label={`${course.title} - ${note.title}`}
                                >
                                  <span className="text-[11px] font-semibold leading-none">
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
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent  className="w-48">
                          <LessonManager course={course} lesson={note} onSuccess={onCoursesChange}>
                            <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit Lesson</span>
                            </ContextMenuItem>
                          </LessonManager>
                          <ContextMenuSeparator />
                          <DeleteLessonDialog course={course} lesson={note} onSuccess={onCoursesChange}>
                            <ContextMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Lesson</span>
                            </ContextMenuItem>
                          </DeleteLessonDialog>
                        </ContextMenuContent>
                      </ContextMenu>
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
                <ContextMenu>
                  <ContextMenuTrigger asChild>
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
                      <div className="opacity-0 group-hover/course:opacity-100 transition-opacity flex items-center pr-1 text-muted-foreground/50">
                        <MoreVertical className="h-4 w-4" />
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuGroup>
                      <LessonManager course={course} onSuccess={onCoursesChange}>
                        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Add Lesson</span>
                        </ContextMenuItem>
                      </LessonManager>
                      <CourseManager course={course} onSuccess={onCoursesChange}>
                        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit Course</span>
                        </ContextMenuItem>
                      </CourseManager>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <DeleteCourseDialog course={course} onSuccess={onCoursesChange}>
                      <ContextMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Course</span>
                      </ContextMenuItem>
                    </DeleteCourseDialog>
                  </ContextMenuContent>
                </ContextMenu>

                {expandedCourses.has(course.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {course.notes.map((note) => (
                      <ContextMenu key={note.id}>
                        <ContextMenuTrigger asChild>
                          <div className="group/lesson flex w-full items-center pr-2">
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
                            <div className="opacity-0 group-hover/lesson:opacity-100 transition-opacity text-muted-foreground/50">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-48">
                          <LessonManager course={course} lesson={note} onSuccess={onCoursesChange}>
                            <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit Lesson</span>
                            </ContextMenuItem>
                          </LessonManager>
                          <ContextMenuSeparator />
                          <DeleteLessonDialog course={course} lesson={note} onSuccess={onCoursesChange}>
                            <ContextMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Lesson</span>
                            </ContextMenuItem>
                          </DeleteLessonDialog>
                        </ContextMenuContent>
                      </ContextMenu>
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
