"use client"

import { useState, useEffect } from "react"
import { CourseSidebar } from "@/components/course-sidebar"
import { MarkdownContent } from "@/components/markdown-content"
import { EmptyState } from "@/components/empty-state"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { courses, getNoteContent, type Course, type Note } from "@/lib/courses"

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [noteContent, setNoteContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
      <aside className="hidden w-72 shrink-0 lg:block">
        <CourseSidebar
          courses={courses}
          selectedCourse={selectedCourse}
          selectedNote={selectedNote}
          onSelectCourse={handleSelectCourse}
          onSelectNote={handleSelectNote}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-border px-4">
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
        <main className="flex-1 overflow-hidden">
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
