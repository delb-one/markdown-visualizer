"use client";

import React from "react";

import { useMemo, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { CodeBlock } from "./code-block";
// import "highlight.js/styles/github-dark.css";

interface MarkdownContentProps {
  content: string;
  title?: string;
}

export function MarkdownContent({ content, title }: MarkdownContentProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);

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

  return (
    <div className="flex h-full min-w-0">
      <div
        ref={scrollAreaRef}
        className="min-w-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
          <article className="prose min-w-0 max-w-full px-8 pb-8 pt-20 lg:px-8 lg:pb-8 lg:pt-20">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
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
                    <code
                      className={`${className} font-mono text-sm`}
                      {...props}
                    >
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
                  <td className="border-b border-border px-4 py-3">
                    {children}
                  </td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/30 bg-muted/30 pl-4 py-1 italic">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-4 ml-6 list-decimal space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="wrap-break-word leading-7">{children}</li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="wrap-break-word font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {children}
                  </a>
                ),
                p: ({ children }) => (
                  <p className="wrap-break-word leading-7 not-first:mt-6">{children}</p>
                ),
                hr: () => <hr className="my-8 border-border" />,
              }}
            >
              {content}
            </ReactMarkdown>
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
