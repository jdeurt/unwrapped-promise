export type PromiseResolver<T> = (value: T | PromiseLike<T>) => void;
