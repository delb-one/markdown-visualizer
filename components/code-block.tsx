"use client"

import { useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  children: React.ReactNode
}

export function CodeBlock({ children }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!preRef.current) return

    const code = preRef.current.textContent ?? ""

    await navigator.clipboard.writeText(code)
    setCopied(true)

    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="group relative my-6">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="cursor-pointer absolute right-3 top-3 z-10 flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs opacity-0 shadow-sm transition-all group-hover:opacity-100 dark:border-neutral-800"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-500" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>

      {/* Code block */}
      <pre ref={preRef} className="group relative overflow-x-auto rounded-md border bg-[#f6f8fa]  text-sm dark:bg-[#0d1117]">
        {children}
      </pre>
    </div>
  )
}
