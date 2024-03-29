import { PromiseExecutor } from "../types/promise-executor";
import { PromiseRejector } from "../types/promise-rejector";
import { PromiseResolver } from "../types/promise-resolver";
import { PromiseStatus } from "../types/promise-status";

export class UnwrappedPromise<T> extends Promise<T> {
    private unwrappedResolve: PromiseResolver<T>;
    private unwrappedReject: PromiseRejector;
    private unwrappedStatus: PromiseStatus = "pending";

    constructor(executor?: PromiseExecutor<T>) {
        let _unwrappedResolve: PromiseResolver<T>;
        let _unwrappedReject: PromiseRejector;

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

    /**
     * Creates a new unwrapped promise that automatically rejects after the provided amount of time
     */
    static withTimeout<T>(
        ms: number,
        executor?: PromiseExecutor<T>
    ): UnwrappedPromise<T>;
    /**
     * Creates a new unwrapped promise from an existing promise that automatically rejects after the provided amount of time
     */
    static withTimeout<T>(ms: number, promise: Promise<T>): UnwrappedPromise<T>;
    static withTimeout<T>(
        ms: number,
        promiseOrExecutor?: Promise<T> | PromiseExecutor<T>
    ): UnwrappedPromise<T> {
        const promise =
            promiseOrExecutor instanceof Promise
                ? UnwrappedPromise.from(promiseOrExecutor)
                : new UnwrappedPromise<T>(promiseOrExecutor);

        setTimeout(promise.reject, ms);

        return promise;
    }

    /**
     * Creates a new unwrapped promise that resolves after the provided amount of time
     */
    static timer(ms: number): UnwrappedPromise<void> {
        return new UnwrappedPromise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Creates a new unwrapped promise that automatically resolves/rejects based the argument the `calbackHandler` is assigned to in the `wrapper` parameter
     *
     * The default behavior of the callbackHandler can be modified by passing a custom `callbackArgumentsTransformer`
     */
    static fromCallback<
        T,
        F extends Function = (error: unknown, result: T) => void
    >(
        wrapper: (callbackHandler: F) => void,
        callbackArgumentsTransformer?: (...args: any[]) => {
            error: unknown;
            result: T;
        }
    ): UnwrappedPromise<T> {
        const promise = new UnwrappedPromise<T>();

        const callbackHandler = (...args: any[]) => {
            const { error, result } = callbackArgumentsTransformer?.(
                ...args
            ) ?? { error: args[0], result: args[1] as T };

            if (error) {
                promise.reject(error);

                return;
            }

            promise.resolve(result);
        };

        wrapper(callbackHandler as unknown as F);

        return promise;
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

    /**
     * Returns a normal promise representation of the unwrapped promise
     */
    rewrap(): Promise<T> {
        return this.then();
    }
}
