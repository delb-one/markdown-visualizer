# Advanced Types

TypeScript provides several advanced type features for complex scenarios.

## Union Types

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
```

## Generics

Generics allow you to create reusable components:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
```

## Utility Types

TypeScript provides several utility types:

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// Partial - makes all properties optional
type PartialTodo = Partial<Todo>;

// Pick - select specific properties
type TodoPreview = Pick<Todo, "title" | "completed">;

// Omit - exclude specific properties
type TodoInfo = Omit<Todo, "completed">;
```

## Type Guards

```typescript
function isString(test: any): test is string {
  return typeof test === "string";
}
```
