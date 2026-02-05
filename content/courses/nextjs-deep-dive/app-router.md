
#  Next.js App Router

The App Router is a new paradigm for building applications using React's latest features.

##  File-based Routing

Create routes by adding files to the `app` directory:

```
app/
├── page.tsx        # /
├── about/
│   └── page.tsx    # /about
└── blog/
    ├── page.tsx    # /blog
    └── [slug]/
        └── page.tsx # /blog/:slug
```

##  Layouts

Layouts wrap pages and preserve state across navigations:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Loading UI

Create loading states with `loading.tsx`:

```tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

## Error Handling

Handle errors gracefully with `error.tsx`:

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```
