import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string; fileName: string }> }
) {
  try {
    const { courseId, fileName } = await params
    
    const filePath = path.join(
      process.cwd(),
      "content",
      "courses",
      courseId,
      fileName
    )
    
    console.log("[v0] Attempting to read file:", filePath)
    
    if (!fs.existsSync(filePath)) {
      console.log("[v0] File not found:", filePath)
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      )
    }
    
    const content = fs.readFileSync(filePath, "utf-8")
    console.log("[v0] Successfully read file, length:", content.length)
    
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("[v0] Error reading note:", error)
    return NextResponse.json(
      { error: "Failed to read note" },
      { status: 500 }
    )
  }
}
