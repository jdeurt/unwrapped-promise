import { UnwrappedPromise } from "../dist/index.mjs";

function getRandomInt(ceil) {
    return Math.floor(Math.random() * ceil);
}

/**
 * @type {UnwrappedPromise[]}
 */
const promises = [];

for (let i = 0; i < 100; i++) {
    promises.push([
        new UnwrappedPromise((resolve) => {
            setTimeout(resolve, getRandomInt(500) + 10);
        }),
        new UnwrappedPromise((resolve) => {
            setTimeout(resolve, getRandomInt(500) + 100);
        }),
    ]);
}

function tick() {
    setTimeout(() => {
        if (
            promises.every(
                (p) => p[0].status === "resolved" && p[1].status === "resolved"
            )
        ) {
            return;
        }

        console.log(
            promises
                .map((p) =>
                    p[1].status === "resolved"
                        ? "▓"
                        : p[0].status === "resolved"
                        ? "▒"
                        : "░"
                )
                .join("")
        );

        tick();
    }, 10);
}

tick();
