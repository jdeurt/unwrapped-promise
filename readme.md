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

## Examples

You can check out some more complex usage examples [here](https://github.com/jdeurt/unwrapped-promise/tree/main/examples).

## License

MIT © [Juan de Urtubey](https://jdeurt.xyz)
