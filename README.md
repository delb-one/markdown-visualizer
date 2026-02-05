# 📚 Markdown Courses Platform

This application uses **Markdown files** to manage courses and lessons in a simple, modular, and easily extensible way.

Each course is represented by a dedicated folder containing `.md` lesson files and is registered through a central configuration file.



## 🧠 Key Concepts

- Each **course** is a folder inside `content/courses`
- Each **lesson** is a `.md` file
- Navigation and content loading are driven by `courses.ts`
- Markdown file names **must match** the ones defined in `courses.ts`



## 🗂️ Courses Configuration (`courses.ts`)

The file `content/courses.ts` exports a list of courses with the following structure:

```ts
export const coursesList: Course[] = [
  {
    id: "linux-fundamentals",
    title: "Linux Fundamentals",
    description: "Basics of Linux operating system",
    notes: [
      {
        id: "introduction",
        title: "Introduction",
        fileName: "introduction.md",
      },
      {
        id: "the-shell",
        title: "The Shell",
        fileName: "the-shell.md",
      },
    ],
  },
];
```


## 🔑 Main Fields

### Course

- **id**  
  Must match the **course folder name**

- **title**  
  Displayed course title

- **description**  
  Short course description

- **notes**  
  List of lessons belonging to the course



### Lesson (`notes`)

- **id**  
  Unique lesson identifier

- **title**  
  Displayed lesson title

- **fileName**  
  Markdown file name (**must exist inside the course folder**)



## ➕ Adding a New Course

To add a new course:

1. Create a new folder inside `content/courses`
2. Add one or more `.md` lesson files
3. Register the course inside `courses.ts`

That’s it — no additional configuration required 🎉



## 🚀 Ready to Go

Once the Markdown files are added and `courses.ts` is updated, the course will automatically be available in the app.

Happy writing ✍️
