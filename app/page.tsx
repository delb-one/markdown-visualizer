"use client"

import { useState, useEffect } from "react"
import { Download, FileText, PanelLeftClose, PanelLeftOpen, Pencil } from "lucide-react"
import { CourseSidebar } from "@/components/course-sidebar"
import { MarkdownContent } from "@/components/markdown-content"
import { EmptyState } from "@/components/empty-state"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { courses as initialCourses, getNoteContent, type Course, type Note } from "@/lib/courses"
import { LessonEditor } from "@/components/lesson-editor"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const [coursesList, setCoursesList] = useState<Course[]>(initialCourses)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [noteContent, setNoteContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const reloadCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      if (res.ok) {
        setCoursesList(await res.json())
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    async function loadContent() {
      if (selectedCourse && selectedNote) {
        setIsLoading(true)
        const content = await getNoteContent(
          selectedCourse.id,
          selectedNote.fileName
        )
        setNoteContent(content)
        setIsLoading(false)
        setIsEditing(false)
      }
    }
    loadContent()
  }, [selectedCourse, selectedNote])

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course)
    // Reset selected note and auto-select first note of the new course
    if (course.notes.length > 0) {
      setSelectedNote(course.notes[0])
    } else {
      setSelectedNote(null)
    }
  }

  const handleSelectNote = (course: Course, note: Note) => {
    setSelectedCourse(course)
    setSelectedNote(note)
  }

  const handleExportPlaceholder = (format: "pdf" | "docs") => {
    console.log(`Export placeholder: ${format}`)
  }

  const selectedNoteIndex =
    selectedCourse && selectedNote
      ? selectedCourse.notes.findIndex((note) => note.id === selectedNote.id)
      : -1

  const previousNote =
    selectedCourse && selectedNoteIndex > 0
      ? selectedCourse.notes[selectedNoteIndex - 1]
      : null

  const nextNote =
    selectedCourse &&
      selectedNoteIndex >= 0 &&
      selectedNoteIndex < selectedCourse.notes.length - 1
      ? selectedCourse.notes[selectedNoteIndex + 1]
      : null

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 transition-[width] duration-200 lg:block ${sidebarCollapsed ? "w-20" : "w-72"
          }`}
      >
        <CourseSidebar
          courses={coursesList}
          selectedCourse={selectedCourse}
          selectedNote={selectedNote}
          onSelectCourse={handleSelectCourse}
          onSelectNote={handleSelectNote}
          onCoursesChange={reloadCourses}
          collapsed={sidebarCollapsed}
        />
      </aside>

      {/* Main Content */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-border/70 bg-background/60 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <MobileSidebar
              courses={coursesList}
              selectedCourse={selectedCourse}
              selectedNote={selectedNote}
              onSelectCourse={handleSelectCourse}
              onSelectNote={handleSelectNote}
              open={mobileOpen}
              onOpenChange={setMobileOpen}
            />
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            {selectedNote && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {selectedCourse?.title}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium text-foreground">
                  {selectedNote.title}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedNote && !isEditing && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="h-9 w-9"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          aria-label="Export"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export as</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => handleExportPlaceholder("pdf")}>
                      <FileText className="mr-2 w-4 h-4" />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleExportPlaceholder("docs")}>
                      <FileText className="mr-2 w-4 h-4" />
                      .docs
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Content Area */}
        <main className="min-w-0 flex-1 overflow-hidden z-10 relative has-[.w-md-editor-fullscreen]:z-30">
          {selectedNote ? (
            isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
              </div>
            ) : isEditing ? (
              <LessonEditor
                courseId={selectedCourse!.id}
                fileName={selectedNote.fileName}
                initialContent={noteContent}
                onSave={(newContent) => {
                  setNoteContent(newContent)
                  setIsEditing(false)
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <MarkdownContent
                content={noteContent}
                title={selectedNote.title}
                previousNote={
                  selectedCourse && previousNote
                    ? {
                        title: previousNote.title,
                        onClick: () => handleSelectNote(selectedCourse, previousNote),
                      }
                    : undefined
                }
                nextNote={
                  selectedCourse && nextNote
                    ? {
                        title: nextNote.title,
                        onClick: () => handleSelectNote(selectedCourse, nextNote),
                      }
                    : undefined
                }
              />
            )
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  )
}
