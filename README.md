# 📚 Markdown Courses Platform

This application uses **Markdown files** to manage courses and lessons in a simple, modular, and easily extensible way.

Each course is represented by a dedicated folder containing `.md` lesson files and is registered through a central configuration file.



## 🧠 Key Concepts

- Each **course** is a folder inside `content/courses`
- Each **lesson** is a `.md` file
- Navigation and content loading are driven by `courses.json`
- Markdown file names **must match** the ones defined in `courses.json`



## 🗂️ Courses Configuration (`courses.json`)

The file `content/courses.json` contains a list of courses with the following structure:

```json
[
  {
    "id": "linux-fundamentals",
    "title": "Linux Fundamentals",
    "description": "Basics of Linux operating system",
    "notes": [
      {
        "id": "introduction",
        "title": "Introduction",
        "fileName": "introduction.md"
      },
      {
        "id": "the-shell",
        "title": "The Shell",
        "fileName": "the-shell.md"
      }
    ]
  }
]
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

## 📝 Markdown Features

### Tab Groups

You can create interactive tab groups inside your markdown lessons using the `[tabs]` and `[/tabs]` markers. 
Each internal tab must start with the title wrapped in bold (`**Tab Name**`) on its own line:

```markdown
[tabs]
**React**
React component code here...

**Vue**
Vue component code here...
[/tabs]
```

### Alert / Callout Blocks

You can use GitHub-style alerts in your markdown to highlight important information. The following types are supported and will render with appropriate colors and icons:

```markdown
> [!NOTE]
> Information that the user should take note of.

> [!TIP]
> Helpful advice for doing things better.

> [!IMPORTANT]
> Key information that users need to know.

> [!WARNING]
> Urgent info that needs immediate user attention.

> [!CAUTION]
> Advises about risks or negative consequences of certain actions.
```
