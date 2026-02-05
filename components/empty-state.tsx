import { BookOpen } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Select a note to get started
      </h2>
      <p className="max-w-md text-muted-foreground">
        Choose a course from the sidebar and select a note to view its content.
        Use the search bar to quickly find specific topics.
      </p>
    </div>
  )
}
