"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CourseSidebar } from "./course-sidebar"
import type { Course, Note } from "@/lib/courses"

interface MobileSidebarProps {
  courses: Course[]
  selectedCourse: Course | null
  selectedNote: Note | null
  onSelectCourse: (course: Course) => void
  onSelectNote: (course: Course, note: Note) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({
  courses,
  selectedCourse,
  selectedNote,
  onSelectCourse,
  onSelectNote,
  open,
  onOpenChange,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <CourseSidebar
          courses={courses}
          selectedCourse={selectedCourse}
          selectedNote={selectedNote}
          onSelectCourse={(course) => {
            onSelectCourse(course)
          }}
          onSelectNote={(course, note) => {
            onSelectNote(course, note)
            onOpenChange(false)
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
