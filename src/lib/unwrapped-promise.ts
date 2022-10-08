export class UnwrappedPromise<T> extends Promise<T> {
    private unwrappedProperties: {
        resolve: (value: T | PromiseLike<T>) => void;
        reject: (reason?: unknown) => void;
        status: "pending" | "resolved" | "rejected";
    };

    constructor(
        executor?: (
            resolve: (value: T | PromiseLike<T>) => void,
            reject: (reason?: unknown) => void
        ) => void
    ) {
        let unwrappedResolve: (value: T | PromiseLike<T>) => void;
        let unwrappedReject: (reason?: unknown) => void;

        super((resolve, reject) => {
            unwrappedResolve = resolve;
            unwrappedReject = reject;
        });

        this.unwrappedProperties = {
            resolve: unwrappedResolve!,
            reject: unwrappedReject!,
            status: "pending",
        };

        if (executor !== undefined) {
            executor(this.resolve.bind(this), this.reject.bind(this));
        }
    }

    /**
     * Creates a new unwrapped promise from an existing promise
     */
    static from<T>(promise: Promise<T>) {
        const unwrappedPromise = new UnwrappedPromise<T>();

        promise
            .then((value) => unwrappedPromise.resolve(value))
            .catch((reason) => unwrappedPromise.reject(reason));

        return unwrappedPromise;
    }

    /**
     * A promise that resolves whenever the unwrapped promise has settled (fulfilled or rejected)
     */
    get settled() {
        return new Promise<void>((resolve) => {
            super
                .then((value) => resolve(void value))
                .catch((err) => resolve(void err));
        });
    }

    /**
     * The status of the unwrapped promise
     */
    get status() {
        return this.unwrappedProperties.status;
    }

    /**
     * Forces the unwrapped promise to resolve to a specified value
     */
    resolve(value: T | PromiseLike<T>): void {
        this.unwrappedProperties.resolve(value);
        this.unwrappedProperties.status = "resolved";
    }

    /**
     * Forces the unwrapped promise to reject with a specified reason
     */
    reject(reason?: unknown): void {
        this.unwrappedProperties.reject(reason);
        this.unwrappedProperties.status = "rejected";
    }

    // TODO

    // then<TResult1 = T, TResult2 = never>(
    //     onfulfilled?:
    //         | ((value: T) => TResult1 | PromiseLike<TResult1>)
    //         | null
    //         | undefined,
    //     onrejected?:
    //         | ((reason: any) => TResult2 | PromiseLike<TResult2>)
    //         | null
    //         | undefined
    // ): UnwrappedPromise<TResult1 | TResult2> {
    //     return UnwrappedPromise.from(super.then(onfulfilled, onrejected));
    // }

    // catch<TResult = never>(
    //     onrejected?:
    //         | ((reason: any) => TResult | PromiseLike<TResult>)
    //         | null
    //         | undefined
    // ): UnwrappedPromise<T | TResult> {
    //     return UnwrappedPromise.from(super.catch(onrejected));
    // }

    // finally(onfinally?: (() => void) | null | undefined): UnwrappedPromise<T> {
    //     return UnwrappedPromise.from(super.finally(onfinally));
    // }
}
