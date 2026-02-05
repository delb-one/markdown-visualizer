# State and Lifecycle

State allows React components to change their output over time in response to user actions, network responses, and anything else.

## Using the useState Hook

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## Using the useEffect Hook

The `useEffect` Hook lets you perform side effects in function components:

```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Click me
    </button>
  );
}
```

## Rules of Hooks

1. Only call Hooks at the top level
2. Only call Hooks from React functions
