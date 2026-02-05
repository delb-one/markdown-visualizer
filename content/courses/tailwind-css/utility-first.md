# Utility-First Fundamentals

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes.

## Traditional vs Utility-First

**Traditional CSS:**
```css
.card {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

**Utility-First:**
```html
<div class="p-4 rounded-lg shadow-md">
  Content
</div>
```

## Core Concepts

### Spacing
```html
<div class="p-4 m-2 px-6 py-3 mt-8">
  <!-- p = padding, m = margin -->
  <!-- x = horizontal, y = vertical -->
  <!-- t/r/b/l = top/right/bottom/left -->
</div>
```

### Colors
```html
<div class="bg-blue-500 text-white border-gray-200">
  Colored content
</div>
```

### Flexbox & Grid
```html
<div class="flex items-center justify-between gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div class="grid grid-cols-3 gap-6">
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</div>
```
