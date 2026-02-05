# TypeScript Basics

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

## Why TypeScript?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Self-Documenting Code**: Types serve as documentation

## Basic Types

```typescript
// Primitive types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";

// Arrays
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// Tuple
let x: [string, number] = ["hello", 10];
```

## Interfaces

```typescript
interface User {
  name: string;
  age: number;
  email?: string; // Optional property
}

function greet(user: User) {
  return `Hello, ${user.name}!`;
}
```

## Type Aliases

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = number | string;
```
