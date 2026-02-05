# Introduction to React

React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of developers.

## Why React?

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Design simple views for each state in your application
- **Learn Once, Write Anywhere**: Develop new features without rewriting existing code

## Getting Started

To create a new React application, you can use Create React App or Next.js:

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## Your First Component

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return <Welcome name="Developer" />;
}
```

React components are the building blocks of any React application. They let you split the UI into independent, reusable pieces.
