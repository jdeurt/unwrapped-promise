# unwrapped-promise

[![Version](https://img.shields.io/npm/v/unwrapped-promise.svg)](https://www.npmjs.com/package/unwrapped-promise)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D16-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> An extension of Javascript's native Promise class that gives you more control over its lifecycle

## Table of contents

-   [Intstallation](#installation)
-   [Usage](#usage)
    -   [Reading promise status](#reading-promise-status)
    -   [Forcing rejection (aborting promises)](#forcing-rejection-aborting-promises)
    -   [Flat promise behavior](#flat-promise-behavior)
    -   [Waiting for settlement](#waiting-for-settlement)
    -   [Creating an `UnwrappedPromise` from a regular `Promise`](#creating-an-unwrappedpromise-from-a-regular-promise)
    -   ["Re-wrapping" a promise](#re-wrapping-a-promise)
    -   [Resolving from a callback](#resolving-from-a-callback)
    -   [Timer utilities](#timer-utilities)
-   [Examples](#examples)
-   [License](#license)

## Installation

### NPM

```bash
npm i unwrapped-promise
```

### Yarn

```bash
yarn i unwrapped-promise
```

## Usage

```js
import { UnwrappedPromise } from "unwrapped-promise";

const promise = new UnwrappedPromise((resolve, reject) => {
    // ...
});
```

An unwrapped promise is an extension of native promises. Unwrapped promises expose some methods and properties that give you more control the promise's lifecycle. They also come with some nifty utility functions that make common promise patterns easier to work with.

### Reading promise status

```js
import { UnwrappedPromise } from "unwrapped-promise";

const promise = new UnwrappedPromise((resolve) => setTimeout(resolve, 0));

console.log(promise.status); // "pending"

await promise;

console.log(promise.status); // "resolved"
```

### Forcing rejection (aborting promises)

```js
import { UnwrappedPromise } from "unwrapped-promise";

const promise = new UnwrappedPromise((resolve, reject) => {
    // ...
});

externalSource.on("someEvent", () => {
    promise.reject();

    console.log(promise.status); // "rejected"
});
```

### Flat promise behavior

```js
import { UnwrappedPromise } from "unwrapped-promise";

const flatPromise = new UnwrappedPromise();

flatPromise.then(() => console.log("Resolved!"));

flatPromise.resolve();

await flatPromise; // "Resolved!"
```

### Waiting for settlement

```js
import { UnwrappedPromise } from "unwrapped-promise";

const promise = new UnwrappedPromise((resolve) => setTimeout(resolve, 1000));

await promise.settled; // Resolves in 1 second
```

### Creating an `UnwrappedPromise` from a regular `Promise`

```js
import { UnwrappedPromise } from "unwrapped-promise";

const fetchResultPromise = UnwrappedPromise.from(fetch("/some/endpoint"));

console.log(fetchResultPromise.status); // "pending"

const result = await fetchResultPromise;

console.log(fetchResultPromise.status); // "resolved"
```

Keep in mind the static `UnwrappedPromise.from` method creates a _copy_ of the promise provided as the argument. Forecefully rejecting or resolving the unwrapped promise has no effect on the status of the original promise.

### "Re-wrapping" a promise

You can get the normal promise representation of an unwrapped promise by calling `.rewrap()`.

```js
import { UnwrappedPromise } from "unwrapped-promise";

const fetchResultUnwrappedPromise = UnwrappedPromise.from(
    fetch("/some/endpoint")
);

console.log(fetchResultUnwrappedPromise.status); // "pending"

const fetchResultPromise = fetchResultUnwrappedPromise.rewrap();

console.log(fetchResultPromise.status); // undefined

const result = await fetchResultPromise; // works as normal :)
```

### Resolving from a callback

```js
import { readFile } from "node:fs";
import { UnwrappedPromise } from "unwrapped-promise";

const data = await UnwrappedPromise.fromCallback((handle) => {
    readFile("/path/to/file.txt", "utf8", handle);
});
```

### Timer utilities

Creating a promise that will automatically time out after 5 seconds:

```js
import { UnwrappedPromise } from "unwrapped-promise";

const promise = new Promise((resolve) => setTimeout(resolve, 10000));

const unwrappedPromise = UnwrappedPromise.withTimeout(5000, promise);

// Logs "Timed out!" after 5 seconds
await unwrappedPromise.catch((err) => console.log("Timed out!"));
```

Alternative approach with `UnwrappedPromise.timer`:

```js
import { UnwrappedPromise } from "unwrapped-promise";

const unwrappedPromise = UnwrappedPromise.timer(10000);
setTimeout(unwrappedPromise.reject, 5000);

// Logs "Timed out!" after 5 seconds
await unwrappedPromise.catch((err) => console.log("Timed out!"));
```

## Examples

You can check out some more complex usage examples [here](https://github.com/jdeurt/unwrapped-promise/tree/main/examples).

## License

MIT © [Juan de Urtubey](https://jdeurt.xyz)
