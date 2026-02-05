# React Server Components

Server Components allow you to render components on the server, reducing the JavaScript sent to the client.

## Benefits

- **Smaller Bundle Size**: Server-only code stays on the server
- **Direct Backend Access**: Query databases directly
- **Improved Performance**: Reduce client-side JavaScript

## Server vs Client Components

```tsx
// Server Component (default)
async function ServerComponent() {
  const data = await fetchData(); // Direct database access
  return <div>{data}</div>;
}

// Client Component
'use client'
function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## When to Use Each

| Feature | Server | Client |
|---------|--------|--------|
| Fetch data | ✓ | |
| Access backend resources | ✓ | |
| Use hooks | | ✓ |
| Add interactivity | | ✓ |
| Use browser APIs | | ✓ |

## Composition Pattern

```tsx
// Server Component
export default async function Page() {
  const data = await getData();
  
  return (
    <div>
      <h1>{data.title}</h1>
      <InteractiveChart data={data.chartData} />
    </div>
  );
}
```
