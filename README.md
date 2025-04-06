# Rechainify

**Rechainify** is a lightweight, dependency-free utility library for composing and executing chained data transformations. It allows you to define reusable validation and transformation steps, organize them into flexible pipelines, and apply them conditionally based on your use case.

## Table of Contents

- [Quick Start](#quick-start)
- [Handler](#handler)
- [Steps](#steps)
  - [Plain](#plain)
  - [Factory](#factory)
- [Methods](#methods)
  - [every(steps, predicate)](#everysteps-predicate)
  - [map(steps)](#mapsteps)
  - [some(steps, predicate)](#somesteps-predicate)
- [Roadmap](#roadmap)
- [License](#license)

## Quick Start 

Install Rechainify in your project:

```bash
npm i rechainify
```

Create an instance of the builder and apply transformations to input values:

```js
import Rechainify from 'rechainify'

const chain = Rechainify.map({
  category: (category) => (input) => ({ ...input, category }),
  required: (input) => ({ ...input, required: true }),
})

chain.required({ value: 5 }) // { required: true, value: 5 }
chain.required.category('author', { name: 'Lucy' })  // { category: 'author', name: 'Lucy', required: true }
```

>[!NOTE]
> You don’t need to import the barrel file (i.e., the main entry file that re-exports everything) — all methods can be accessed directly, e.g., `rechainify/map` or `rechainify/some`.

>[!WARNING]
> If you're using **TypeScript** and define `steps` as entries of type `[string, Function][]`, it's important to make it `readonly` (e.g., using `as const`); otherwise, you'll lose helpful code intelligence features.

## Handler

A **handler** is the core component that exposes a static method for each configured step, enabling the chaining of steps in different _scenarios_.

Internally, the handler records the order in which steps are applied. When executed, it passes the input value through each step in sequence. Executing the handler clears the recorded step sequence, allowing a new scenario to be built from scratch.

It’s important to note that the handler is invoked during chaining when:
- a plain step is executed, or
- a factory step is executed with two arguments (the configuration and the input).

```js
import Rechainify from 'rechainify'

const chain = Rechainify.some({
  category: (category) => (input) => ({ ...input, category }),
  required: (input) => ({ ...input, required: true }),
})

chain.required(5) // the first argument is passed to the handler
chain.category('author', { name: 'Elfo' }) // the second argument is passed to the handler
chain.category('author')({ name: 'Elfo' }) // the same as above
chain.required.category('author', { name: 'Elfo' }) // applies the required, then the category steps
chain.required().category('author', { name: 'Elfo' }) // ReferenceError
```

>[!WARNING]
> The handler should be invoked only at the end of the scenario; otherwise, you will get a `ReferenceError`.

## Steps

A **step** is a unit of work added to the chain sequence during chaining. When the final handler is executed, the input value flows through each step in the chained order — each step receives the output of the previous step.

Each step consists of a name (i.e., `string`) and a function that implements the step behavior.

There are two types of step functions:
- A plain function `(input: any) => any`.
- A factory function `(options: any) => (input: any) => any`.

>[!NOTE]
> Each function is executed once during step definition to determine the step type.  
> If the function returns another function, it is treated as a **factory** step; otherwise, it's a **plain** step.
> If the function throws an exception during this check, it is also treated as a **plain** step.

You can configure a list of steps in two ways:
- As an array of tuples `Array<[string, Function]>`.
- As an object `Record<string, Function>`.

### Plain

A _plain step_ is the simplest type of method in the chain. It accepts an input, processes and/or validates it, and returns a new value (or the original one, depending on the design):

```js
import Rechainify from 'rechainify'

const chain = Rechainify.every({
  number: (input) => typeof input === 'number' ? input : null,
  required: (input) => input !== undefined ? input : null,
}) 

chain.required(undefined)   // null
chain.required(5)           // 5
chain.required.number(5)    // 5
chain.required().number(5)  // ReferenceError
```

>[!WARNING]
> A plain method returns the final handler. This means that if you execute a step in the middle of the chain, you’ll get a `ReferenceError` because the chain has already been closed by calling the handler.

### Factory

A _factory step_ works the same way as a plain step, with one key difference: it can be configured during chaining.

```js
import Rechainify from 'rechainify'

const chain = Rechainify.every({
  max: (boundary) => (input) => input < boundary ? input : null,
  min: (boundary) => (input) => input > boundary ? input : null,
})

chain.min(5, 6)             // 6
chain.min(5, 4)             // null
chain.min(5).max(10, 7)     // 7
chain.max(10).min(5, 7)     // 7
chain.max(10, 7).min(5, 7)  // ReferenceError
```

>[!WARNING]
> At the moment, factory steps support only one configuration argument. The second argument is passed directly to the final chain handler and may cause a `ReferenceError` if the step is invoked in the middle of the chain.

## Methods

### every(steps, predicate)

The `every` method creates a [handler](#handler) that helps build a scenario — a sequence of [steps](#steps) — and applies it to an input. Each step is executed in order, and the output of one step is passed as the input to the next. If any step fails the predicate, the handler returns `null` immediately; otherwise, it returns the result of the final step.

```js
import Rechainify, { RechainifyPredicate } from 'rechainify'

const chain = Rechainify.every(
  {
    number: (input) => {
      const possiblyNumber = typeof input === 'number' ? input : parseInt(input, 10)
      return Number.isNaN(possiblyNumber) ? null : possiblyNumber
    },
    min: (left) => (input) => input > left ? input : null,
  },
  RechainifyPredicate.isNonNull
)

chain.number(5)           // 5
chain.number('5')         // 5
chain.number.min(5, 7)    // 7
chain.number.min(5, 3)    // null
chain.min(5).number(6)    // 6
chain.min(5).number('6')  // null
```

>[!NOTE]
> The `predicate` argument is optional and defaults to `RechainifyPredicate.isNonNull`.

>[!NOTE]
> If you need complex validation and transformation, it makes sense to look at [zod](https://zod.dev/).

### map(steps)

The `map` method creates a [handler](#handler) that helps build a scenario — a sequence of transformation [steps](#steps) — and applies it to an input. Each step is executed in order, with the output of one step passed as the input to the next, until the final step returns the result.

```js
import Rechainify from 'rechainify'

const chain = Rechainify.map({
  double: (input) => input * 2,
  divideBy: (divider) => (input) => input / divider,
})

chain.double.divideBy(3, 6) // 4 
chain.divideBy(3).double(9) // 6
```

### some(steps, predicate)

The `some` method creates a [handler](#handler) that allows you to build a scenario — a sequence of [steps](#steps) — and apply it to an input. Each step is executed in order with the input value, until a result satisfies the given predicate. The handler returns `null` if no step produces a satisfying result.

```js
import Rechainify, { RechainifyPredicate } from 'rechainify'

const chain = Rechainify.some(
  {
    px: (input) => input.endsWith('px') ? parseInt(input, 10) : null,
    em: (input) => input.endsWith('em') ? parseInt(input, 10) : null,
  },
  RechainifyPredicate.isNonNull
)

chain.px.em('10px') // 10
chain.px.em('10em') // 10
chain.em.px('10px') // 10
chain.em.px('10em') // 10
```

>[!NOTE]
> The `predicate` argument is optional and defaults to `RechainifyPredicate.isNonNull`.

## Roadmap

- [x] Avoid using the type property in step configuration. Instead, accept steps as a `Record<name, function>`.
- [x] Migrate to Typescript 🙃
- [ ] Add support for an arbitrary number of arguments in factory steps.

## License

Licensed under [MIT](./LICENSE.md)