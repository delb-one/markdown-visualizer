"use client"

import { useState, useEffect } from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { CourseSidebar } from "@/components/course-sidebar"
import { MarkdownContent } from "@/components/markdown-content"
import { EmptyState } from "@/components/empty-state"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { courses, getNoteContent, type Course, type Note } from "@/lib/courses"

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [noteContent, setNoteContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 transition-[width] duration-200 lg:block ${
          sidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        <CourseSidebar
          courses={courses}
          selectedCourse={selectedCourse}
          selectedNote={selectedNote}
          onSelectCourse={handleSelectCourse}
          onSelectNote={handleSelectNote}
          collapsed={sidebarCollapsed}
        />
      </aside>

      {/* Main Content */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-border/70 bg-background/60 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <MobileSidebar
              courses={courses}
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
          <ThemeToggle />
        </header>

        {/* Content Area */}
        <main className="min-w-0 flex-1 overflow-hidden">
          {selectedNote ? (
            isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
              </div>
            ) : (
              <MarkdownContent
                content={noteContent}
                title={selectedNote.title}
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
