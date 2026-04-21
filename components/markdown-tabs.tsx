"use client";

import React, { useState } from "react";

export interface TabItem {
  label: string;
  content: string;
}

interface MarkdownTabsProps {
  tabs: TabItem[];
  renderMarkdown: (content: string) => React.ReactNode;
}

export function MarkdownTabs({ tabs, renderMarkdown }: MarkdownTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 rounded-lg border border-border overflow-hidden">
      {/* Tab headers */}
      <div className="flex border-b border-border bg-muted/30 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer
              ${
                activeIndex === index
                  ? "text-primary bg-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
          >
            {tab.label}
            {activeIndex === index && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="p-2">
        {renderMarkdown(tabs[activeIndex].content)}
      </div>
    </div>
  );
}
