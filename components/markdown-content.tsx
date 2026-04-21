"use client";

import React from "react";

import { useMemo, useRef, useCallback } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github.css";
import { CodeBlock } from "./code-block";
import { MarkdownTabs, TabItem } from "./markdown-tabs";
import {
  InfoIcon,
  LightbulbIcon,
  AlertTriangleIcon,
  MessageCircleWarningIcon,
  OctagonAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface MarkdownContentProps {
  content: string;
  title?: string;
}

// A segment is either normal markdown text or a tab group
type ContentSegment =
  | { type: "markdown"; content: string }
  | { type: "tabs"; tabs: TabItem[] };

// Parse the markdown content into segments
function parseContentWithTabs(content: string): ContentSegment[] {
  const lines = content.split("\n");
  const segments: ContentSegment[] = [];

  let inTabsBlock = false;
  let currentMarkdownBuffer: string[] = [];
  let currentTabLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inTabsBlock && /^\s*\[tabs\]\s*$/.test(line)) {
      if (currentMarkdownBuffer.length > 0) {
        segments.push({
          type: "markdown",
          content: currentMarkdownBuffer.join("\n"),
        });
        currentMarkdownBuffer = [];
      }
      inTabsBlock = true;
      currentTabLines = [];
      continue;
    }

    if (inTabsBlock && /^\s*\[\/tabs\]\s*$/.test(line)) {
      const tabs: TabItem[] = [];
      let currentTabLabel = "";
      let currentTabContentBuffer: string[] = [];
      let currentIndent = 0;

      const finalizeTab = () => {
        if (!currentTabLabel) return;

        let start = 0;
        while (
          start < currentTabContentBuffer.length &&
          currentTabContentBuffer[start].trim() === ""
        ) {
          start++;
        }
        let end = currentTabContentBuffer.length;
        while (end > start && currentTabContentBuffer[end - 1].trim() === "") {
          end--;
        }
        let contentStr = currentTabContentBuffer.slice(start, end).join("\n");

        if (currentIndent > 0) {
          const indentRegex = new RegExp(`^\\s{0,${currentIndent}}`, "gm");
          contentStr = contentStr.replace(indentRegex, "");
        }
        tabs.push({ label: currentTabLabel, content: contentStr });
      };

      for (const tabLine of currentTabLines) {
        const match = tabLine.match(/^(\s*)\*\*(.+)\*\*\s*$/);
        if (match) {
          finalizeTab();
          currentTabLabel = match[2];
          currentIndent = match[1].length;
          currentTabContentBuffer = [];
        } else {
          currentTabContentBuffer.push(tabLine);
        }
      }
      finalizeTab();

      if (tabs.length > 0) {
        segments.push({ type: "tabs", tabs });
      }

      inTabsBlock = false;
      continue;
    }

    if (inTabsBlock) {
      currentTabLines.push(line);
    } else {
      currentMarkdownBuffer.push(line);
    }
  }

  if (inTabsBlock) {
    currentMarkdownBuffer.push("[tabs]");
    currentMarkdownBuffer.push(...currentTabLines);
  }

  if (currentMarkdownBuffer.length > 0) {
    segments.push({
      type: "markdown",
      content: currentMarkdownBuffer.join("\n"),
    });
  }

  return segments;
}

export function MarkdownContent({ content, title }: MarkdownContentProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const themeName = resolvedTheme === "dark" ? "night-owl" : "github";
    const href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/${themeName}.min.css`;

    let link = document.getElementById("hljs-theme-link") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.id = "hljs-theme-link";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    
    // Only update if it changed to avoid unnecessary re-paints
    if (link.href !== href) {
      link.href = href;
    }
  }, [resolvedTheme]);

  const handleScrollToHeading = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();

      const container = scrollAreaRef.current;
      const target = document.getElementById(id);

      if (!container || !target) return;

      const top =
        target.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop;

      container.scrollTo({
        top: top - 96, // offset header
        behavior: "smooth",
      });
    },
    [],
  );

  const headings = useMemo(() => {
    const contentWithoutFencedCode = content.replace(
      /```[\s\S]*?```|~~~[\s\S]*?~~~/g,
      "",
    );
    const regex = /^#{1,3}\s+(.+)$/gm;
    const matches: { level: number; text: string; id: string }[] = [];
    let match;

    while ((match = regex.exec(contentWithoutFencedCode)) !== null) {
      const level = match[0].indexOf(" ");
      const text = match[1];
      const id = text.toLowerCase().replace(/[^\w]+/g, "-");
      matches.push({ level, text, id });
    }

    return matches;
  }, [content]);

  const segments = useMemo(() => parseContentWithTabs(content), [content]);

  React.useEffect(() => {
    const container = scrollAreaRef.current;
    if (!container) return;

    const onScroll = () => {
      const containerTop = container.getBoundingClientRect().top;

      let currentId: string | null = null;

      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;

        const { top } = el.getBoundingClientRect();

        if (top - containerTop <= 120) {
          currentId = h.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);
    };

    container.addEventListener("scroll", onScroll);
    onScroll(); // iniziale

    return () => container.removeEventListener("scroll", onScroll);
  }, [headings]);

  // Shared component overrides for ReactMarkdown
  const markdownComponents: Components = useMemo(
    () => ({
      h1: ({ children }) => {
        const id = String(children)
          .toLowerCase()
          .replace(/[^\w]+/g, "-");
        return (
          <h1 id={id} className="scroll-mt-8 font-sans">
            {children}
          </h1>
        );
      },
      h2: ({ children }) => {
        const id = String(children)
          .toLowerCase()
          .replace(/[^\w]+/g, "-");
        return (
          <h2 id={id} className="scroll-mt-8 font-sans">
            {children}
          </h2>
        );
      },
      h3: ({ children }) => {
        const id = String(children)
          .toLowerCase()
          .replace(/[^\w]+/g, "-");
        return (
          <h3 id={id} className="scroll-mt-8 font-sans">
            {children}
          </h3>
        );
      },
      code: ({ className, children, ...props }) => {
        const isInline = !className;

        if (isInline) {
          return (
            <code
              className="break-all rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <code className={`${className} font-mono text-sm`} {...props}>
            {children}
          </code>
        );
      },

      pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,

      table: ({ children }) => (
        <div className="max-w-full overflow-x-auto rounded-lg border border-border">
          <table className="w-full mt-0! mb-0!">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border-b border-border bg-muted/50 px-4 py-3 text-left font-semibold">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border-b border-border px-4 py-3">{children}</td>
      ),
      blockquote: ({ children }) => {
        // Detect GitHub-style alerts: [!NOTE], [!TIP], [!WARNING], [!IMPORTANT], [!CAUTION]
        const alertTypes: Record<
          string,
          {
            icon: React.ReactNode;
            label: string;
            borderClass: string;
            bgClass: string;
            titleClass: string;
          }
        > = {
          NOTE: {
            icon: <InfoIcon className="h-5 w-5" />,
            label: "Note",
            borderClass: "border-blue-500",
            bgClass: "bg-blue-500/10",
            titleClass: "text-blue-500",
          },
          TIP: {
            icon: <LightbulbIcon className="h-5 w-5" />,
            label: "Tip",
            borderClass: "border-green-500",
            bgClass: "bg-green-500/10",
            titleClass: "text-green-500",
          },
          IMPORTANT: {
            icon: <MessageCircleWarningIcon className="h-5 w-5" />,
            label: "Important",
            borderClass: "border-purple-500",
            bgClass: "bg-purple-500/10",
            titleClass: "text-purple-500",
          },
          WARNING: {
            icon: <AlertTriangleIcon className="h-5 w-5" />,
            label: "Warning",
            borderClass: "border-yellow-500",
            bgClass: "bg-yellow-500/10",
            titleClass: "text-yellow-500",
          },
          CAUTION: {
            icon: <OctagonAlertIcon className="h-5 w-5" />,
            label: "Caution",
            borderClass: "border-red-500",
            bgClass: "bg-red-500/10",
            titleClass: "text-red-500",
          },
        };

        // Extract text from React children recursively
        const extractText = (node: React.ReactNode): string => {
          if (typeof node === "string") return node;
          if (typeof node === "number") return String(node);
          if (!node) return "";
          if (Array.isArray(node)) return node.map(extractText).join("");
          if (React.isValidElement(node) && node.props) {
            return extractText(
              (node.props as { children?: React.ReactNode }).children,
            );
          }
          return "";
        };

        // Check first paragraph for alert marker
        const childArray = React.Children.toArray(children);
        let alertType: string | null = null;

        for (const child of childArray) {
          if (React.isValidElement(child)) {
            const text = extractText(child);
            const match = text.match(
              /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/,
            );
            if (match) {
              alertType = match[1];
              break;
            }
          }
        }

        if (alertType && alertTypes[alertType]) {
          const config = alertTypes[alertType];
          const markerRegex = new RegExp(`^\\[!${alertType}\\]\\s*`);

          // Remove the [!TYPE] marker from children
          const filteredChildren = childArray
            .map((child) => {
              if (!React.isValidElement(child)) return child;
              const text = extractText(child);
              if (markerRegex.test(text)) {
                const remaining = text.replace(markerRegex, "").trim();
                if (!remaining) return null; // The paragraph only contained the marker
                // Clone the element with the marker text removed from children
                return React.cloneElement(
                  child as React.ReactElement<{ children?: React.ReactNode }>,
                  {
                    children: remaining,
                  },
                );
              }
              return child;
            })
            .filter(Boolean);

          return (
            <div
              className={`not-italic border-l-4 ${config.borderClass} ${config.bgClass} rounded-r-lg my-6 px-4 py-3`}
            >
              <div
                className={`flex items-center gap-2 font-semibold ${config.titleClass} mb-2`}
              >
                {config.icon}
                {config.label}
              </div>
              <div className="text-sm [&>p]:mt-2 [&>p:first-child]:mt-0">
                {filteredChildren}
              </div>
            </div>
          );
        }

        return (
          <blockquote className="border-l-4 border-primary/30 bg-muted/30 pl-4 py-1 italic">
            {children}
          </blockquote>
        );
      },
      ul: ({ children }) => (
        <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
      ),
      li: ({ children }) => (
        <li className="wrap-break-word leading-7">{children}</li>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          className="wrap-break-word font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      ),
      p: ({ children }) => (
        <p className="wrap-break-word leading-7 not-first:mt-6">{children}</p>
      ),
      hr: () => <hr className="my-8 border-border" />,
    }),
    [],
  );

  const renderMarkdown = useCallback(
    (md: string) => (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {md}
      </ReactMarkdown>
    ),
    [markdownComponents],
  );

  return (
    <div className="flex h-full min-w-0">
      <div
        ref={scrollAreaRef}
        className="min-w-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <article className="prose min-w-0 max-w-full px-8 pb-8 pt-20 lg:px-8 lg:pb-8 lg:pt-20">
          {segments.map((segment, index) => {
            if (segment.type === "tabs") {
              return (
                <MarkdownTabs
                  key={index}
                  tabs={segment.tabs}
                  renderMarkdown={renderMarkdown}
                />
              );
            }
            return (
              <React.Fragment key={index}>
                {renderMarkdown(segment.content)}
              </React.Fragment>
            );
          })}
        </article>
      </div>

      {headings.length > 1 && (
        <aside className="hidden w-56 shrink-0 border-l border-border p-6 xl:block">
          <h4 className="mb-4 mt-10 text-sm font-semibold text-foreground">
            On this page
          </h4>
          <nav className="space-y-2">
            {headings.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.id}`}
                onClick={(e) => handleScrollToHeading(e, heading.id)}
                className={`block border-l-2 pl-3 text-sm transition-colors ${
                  activeId === heading.id
                    ? "border-primary text-foreground font-medium "
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                style={{ marginLeft: `${(heading.level - 1) * 12}px` }}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}
