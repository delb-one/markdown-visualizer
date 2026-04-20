import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const coursesJsonPath = path.join(process.cwd(), "content", "courses.json");
const coursesDirPath = path.join(process.cwd(), "content", "courses");

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const body = await request.json();
    const { id, title, description } = body;

    const data = fs.readFileSync(coursesJsonPath, "utf8");
    const courses = JSON.parse(data);

    const courseIndex = courses.findIndex((c: any) => c.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Update fields
    if (title) courses[courseIndex].title = title;
    if (description) courses[courseIndex].description = description;

    // Handle ID change (folder rename)
    if (id && id !== courseId) {
      if (courses.some((c: any) => c.id === id)) {
         return NextResponse.json({ error: "New Course ID already exists" }, { status: 400 });
      }
      
      const oldDirPath = path.join(coursesDirPath, courseId);
      const newDirPath = path.join(coursesDirPath, id);
      
      if (fs.existsSync(oldDirPath)) {
        fs.renameSync(oldDirPath, newDirPath);
      } else {
        fs.mkdirSync(newDirPath, { recursive: true });
      }

      courses[courseIndex].id = id;
    }

    fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2), "utf8");

    return NextResponse.json(courses[courseIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    const data = fs.readFileSync(coursesJsonPath, "utf8");
    let courses = JSON.parse(data);

    const courseExists = courses.some((c: any) => c.id === courseId);
    if (!courseExists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Remove from array
    courses = courses.filter((c: any) => c.id !== courseId);
    fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2), "utf8");

    // Delete directory
    const dirPath = path.join(coursesDirPath, courseId);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
