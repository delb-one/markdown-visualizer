import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const coursesJsonPath = path.join(process.cwd(), "content", "courses.json");
const coursesDirPath = path.join(process.cwd(), "content", "courses");

export async function GET() {
  try {
    const data = fs.readFileSync(coursesJsonPath, "utf8");
    const courses = JSON.parse(data);
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description } = body;

    if (!id || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update courses.json
    const data = fs.readFileSync(coursesJsonPath, "utf8");
    const courses = JSON.parse(data);

    if (courses.some((c: any) => c.id === id)) {
      return NextResponse.json({ error: "Course ID already exists" }, { status: 400 });
    }

    const newCourse = { id, title, description, notes: [] };
    courses.push(newCourse);

    fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2), "utf8");

    // Create course directory
    const newDirPath = path.join(coursesDirPath, id);
    if (!fs.existsSync(newDirPath)) {
      fs.mkdirSync(newDirPath, { recursive: true });
    }

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
