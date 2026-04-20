import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const coursesJsonPath = path.join(process.cwd(), "content", "courses.json");
const coursesDirPath = path.join(process.cwd(), "content", "courses");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, id, title, fileName } = body;

    if (!courseId || !id || !title || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = fs.readFileSync(coursesJsonPath, "utf8");
    const courses = JSON.parse(data);

    const courseIndex = courses.findIndex((c: any) => c.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (courses[courseIndex].notes.some((n: any) => n.id === id || n.fileName === fileName)) {
      return NextResponse.json({ error: "Lesson ID or fileName already exists in this course" }, { status: 400 });
    }

    const newLesson = { id, title, fileName };
    courses[courseIndex].notes.push(newLesson);

    fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2), "utf8");

    // Create empty md file
    const mdPath = path.join(coursesDirPath, courseId, fileName);
    if (!fs.existsSync(path.dirname(mdPath))) {
      fs.mkdirSync(path.dirname(mdPath), { recursive: true });
    }
    fs.writeFileSync(mdPath, `# ${title}\n`, "utf8");

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const { courseId, fileName } = await request.json();

    if (!courseId || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = fs.readFileSync(coursesJsonPath, "utf8");
    const courses = JSON.parse(data);

    const courseIndex = courses.findIndex((c: any) => c.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const lessonIndex = courses[courseIndex].notes.findIndex((n: any) => n.fileName === fileName);
    if (lessonIndex === -1) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    courses[courseIndex].notes.splice(lessonIndex, 1);
    fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2), "utf8");

    // Delete md file
    const mdPath = path.join(coursesDirPath, courseId, fileName);
    if (fs.existsSync(mdPath)) {
      fs.unlinkSync(mdPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}