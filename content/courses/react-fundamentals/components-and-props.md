# Components and Props

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

## Function Components

The simplest way to define a component is to write a JavaScript function:

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

## Props are Read-Only

Whether you declare a component as a function or a class, it must never modify its own props.

```jsx
// Pure function - does not modify inputs
function sum(a, b) {
  return a + b;
}
```

## Composing Components

Components can refer to other components in their output:

```jsx
function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

## Extracting Components

Don't be afraid to split components into smaller components. A good rule of thumb is that if a part of your UI is used several times, or is complex enough on its own, it's a good candidate for a reusable component.
