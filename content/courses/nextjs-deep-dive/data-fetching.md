# Data Fetching in Next.js

Next.js extends the native fetch API to provide powerful data fetching capabilities.

## Fetching on the Server

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // Default - caches the request
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* render data */}</main>;
}
```

## Caching Options

```tsx
// Cached (default)
fetch('https://...', { cache: 'force-cache' });

// Not cached
fetch('https://...', { cache: 'no-store' });

// Revalidate after 1 hour
fetch('https://...', { next: { revalidate: 3600 } });
```

## Parallel Data Fetching

```tsx
async function Page() {
  // Initiate both requests in parallel
  const artistData = getArtist(username);
  const albumsData = getArtistAlbums(username);
  
  // Wait for both to resolve
  const [artist, albums] = await Promise.all([
    artistData,
    albumsData,
  ]);
  
  return <>{/* render */}</>;
}
```
