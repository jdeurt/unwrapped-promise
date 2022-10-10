import { UnwrappedPromise } from "../dist/index.mjs";

function getRandomInt(ceil) {
    return Math.floor(Math.random() * ceil);
}

/**
 * @type {UnwrappedPromise[]}
 */
const promises = [];

for (let i = 0; i < 100; i++) {
    promises.push(
        new UnwrappedPromise((resolve) => {
            setTimeout(resolve, getRandomInt(5000) + 100);
        })
    );
}

function tick() {
    setTimeout(() => {
        if (promises.every((p) => p.status === "resolved")) {
            return;
        }

        console.log(
            `[${promises
                .map((p) => (p.status === "resolved" ? "=" : "-"))
                .join("")}]`
        );

        tick();
    }, 100);
}

tick();
