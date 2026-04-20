import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const coursesJsonPath = path.join(process.cwd(), "content", "courses.json");
const coursesDirPath = path.join(process.cwd(), "content", "courses");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string; fileName: string }> }
) {
  try {
    const { courseId, fileName } = await params;
    
    const filePath = path.join(coursesDirPath, courseId, fileName);
    
    console.log("[v0] Attempting to read file:", filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log("[v0] File not found:", filePath);
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    const content = fs.readFileSync(filePath, "utf-8");
    console.log("[v0] Successfully read file, length:", content.length);
    
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("[v0] Error reading note:", error);
    return NextResponse.json(
      { error: "Failed to read note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string; fileName: string }> }
) {
  try {
    const { courseId, fileName } = await params;
    const { content, title, id } = await request.json();
    
    const filePath = path.join(coursesDirPath, courseId, fileName);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    
    // Update content
    if (content !== undefined) {
      fs.writeFileSync(filePath, content, "utf-8");
    }

    // Optional JSON metadata update
    if (title || id) {
      const data = fs.readFileSync(coursesJsonPath, "utf8");
      const courses = JSON.parse(data);
      const courseIndex = courses.findIndex((c: any) => c.id === courseId);
      if (courseIndex !== -1) {
        const noteIndex = courses[courseIndex].notes.findIndex((n: any) => n.fileName === fileName);
        if (noteIndex !== -1) {
          if (title) courses[courseIndex].notes[noteIndex].title = title;
          if (id) courses[courseIndex].notes[noteIndex].id = id;
          fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2), "utf8");
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: string; fileName: string }> }
) {
  try {
    const { courseId, fileName } = await params;
    
    const filePath = path.join(coursesDirPath, courseId, fileName);
    
    // Remove from courses.json
    const data = fs.readFileSync(coursesJsonPath, "utf8");
    const courses = JSON.parse(data);
    
    const courseIndex = courses.findIndex((c: any) => c.id === courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].notes = courses[courseIndex].notes.filter((n: any) => n.fileName !== fileName);
      fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2), "utf8");
    }

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
