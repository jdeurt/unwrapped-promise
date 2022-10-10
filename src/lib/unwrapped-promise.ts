export class UnwrappedPromise<T> extends Promise<T> {
    private unwrappedResolve: (value: T | PromiseLike<T>) => void;
    private unwrappedReject: (reason?: unknown) => void;
    private unwrappedStatus: "pending" | "resolved" | "rejected" = "pending";

    constructor(
        executor?: (
            resolve: (value: T | PromiseLike<T>) => void,
            reject: (reason?: unknown) => void
        ) => void
    ) {
        let _unwrappedResolve: (value: T | PromiseLike<T>) => void;
        let _unwrappedReject: (reason?: unknown) => void;

        super((resolve, reject) => {
            _unwrappedResolve = resolve;
            _unwrappedReject = reject;
        });

        this.unwrappedResolve = _unwrappedResolve!;
        this.unwrappedReject = _unwrappedReject!;

        if (executor !== undefined) {
            executor(this.resolve.bind(this), this.reject.bind(this));
        }
    }

    /**
     * Creates a new unwrapped promise from an existing promise
     */
    static from<T>(promise: Promise<T>): UnwrappedPromise<T> {
        const unwrappedPromise = new UnwrappedPromise<T>();

        promise
            .then((value) => unwrappedPromise.resolve(value))
            .catch((reason) => unwrappedPromise.reject(reason));

        return unwrappedPromise;
    }

    get [Symbol.toStringTag]() {
        return "UnwrappedPromise";
    }

    /**
     * A promise that resolves whenever the unwrapped promise has settled (fulfilled or rejected)
     */
    get settled(): Promise<void> {
        return new Promise((resolve) => {
            super.finally(() => resolve());
        });
    }

    /**
     * The status of the unwrapped promise
     */
    get status(): "pending" | "resolved" | "rejected" {
        return this.unwrappedStatus;
    }

    /**
     * Creates a new resolved unwrapped promise.
     */
    static resolve(): UnwrappedPromise<void>;
    /**
     * Creates a new resolved unwrapped promise for the provided value.
     */
    static resolve<T>(value: T | PromiseLike<T>): UnwrappedPromise<T>;
    static resolve<T>(value?: T | PromiseLike<T>) {
        return arguments.length === 0
            ? new UnwrappedPromise<void>().resolve()
            : new UnwrappedPromise<T>().resolve(value!);
    }

    /**
     * Forces the unwrapped promise to resolve to a provided value
     */
    resolve(value: T | PromiseLike<T>): UnwrappedPromise<T> {
        if (this.unwrappedStatus !== "pending") {
            return this;
        }

        this.unwrappedResolve(value);
        this.unwrappedStatus = "resolved";

        return this;
    }

    /**
     * Creates a new rejected unwrapped promise for the provided reason.
     */
    static reject<T = never>(reason?: unknown): UnwrappedPromise<T> {
        return new UnwrappedPromise<T>().reject(reason);
    }

    /**
     * Forces the unwrapped promise to reject with a provided reason
     */
    reject(reason?: unknown): UnwrappedPromise<T> {
        if (this.unwrappedStatus !== "pending") {
            return this;
        }

        this.unwrappedReject(reason);
        this.unwrappedStatus = "rejected";

        return this;
    }
}
