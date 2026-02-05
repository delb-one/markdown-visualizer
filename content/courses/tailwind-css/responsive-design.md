# Responsive Design with Tailwind

Tailwind makes responsive design straightforward with mobile-first breakpoint prefixes.

## Breakpoints

| Prefix | Min Width | CSS |
|--------|-----------|-----|
| sm | 640px | @media (min-width: 640px) |
| md | 768px | @media (min-width: 768px) |
| lg | 1024px | @media (min-width: 1024px) |
| xl | 1280px | @media (min-width: 1280px) |
| 2xl | 1536px | @media (min-width: 1536px) |

## Mobile-First Approach

```html
<!-- Default: 1 column, md: 2 columns, lg: 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

## Responsive Typography

```html
<h1 class="text-2xl md:text-4xl lg:text-6xl font-bold">
  Responsive Heading
</h1>
```

## Hiding Elements

```html
<!-- Hidden on mobile, visible on md and up -->
<div class="hidden md:block">Desktop only</div>

<!-- Visible on mobile, hidden on md and up -->
<div class="md:hidden">Mobile only</div>
```
