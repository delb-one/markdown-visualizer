import { coursesList } from "@/content/courses";
export interface Note {
  id: string;
  title: string;
  fileName: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  notes: Note[];
}

export const courses: Course[] = coursesList;

export async function getNoteContent(
  courseId: string,
  fileName: string,
): Promise<string> {
  try {
    const response = await fetch(`/api/notes/${courseId}/${fileName}`);
    if (!response.ok) {
      throw new Error("Failed to fetch note content");
    }
    return await response.text();
  } catch (error) {
    console.error("Error loading note:", error);
    return "# Error\n\nFailed to load note content.";
  }
}
