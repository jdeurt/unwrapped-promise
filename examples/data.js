import { readFile, writeFileSync } from "fs";
import { UnwrappedPromise } from "../dist/index.mjs";

class Data {
    /**
     * @type {UnwrappedPromise}
     */
    #ready;

    /**
     * @type {Record<string, unknown> | undefined}
     */
    #data;

    #path;

    constructor(path) {
        this.#ready = new UnwrappedPromise();
        this.#data = undefined;
        this.#path = path;

        readFile(path, "utf8", (err, data) => {
            if (err) {
                this.#ready.reject(err);

                return;
            }

            this.#ready.resolve();
            this.#data = JSON.parse(data);
        });
    }

    get data() {
        return this.#data;
    }

    set data(newData) {
        writeFileSync(this.#path, JSON.stringify(newData), "utf8");
    }

    get ready() {
        return this.#ready.rewrap();
    }
}

const d1 = new Data("./examples/vendor/data.json");

await d1.ready;

console.log(d1.data);

const d2 = new Data("./examples/vendor/non-existent.json");

try {
    await d2;
} catch (err) {
    console.warn(err);
}
