# unwrapped-promise

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

An unwrapped promise is a wrapper around native promises (yes, I know). Unwrapped promises expose some methods and properties that are usually unaccessible after creating a new promise.

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
const flatPromise = new UnwrappedPromise();

flatPromise.then(() => console.log("Resolved!"));

flatPromise.resolve();

await flatPromise; // "Resolved!"
```

### Waiting for settlement

```js
const promise = new UnwrappedPromise((resolve) => setTimeout(resolve, 1000));

await promise.settled; // Resolves in 1 second
```

## License

MIT © [Juan de Urtubey](https://jdeurt.xyz)
