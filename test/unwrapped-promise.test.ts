import { UnwrappedPromise } from "../src";

describe("Unwrapped promise", () => {
    it("Should behave like a regular promise", async () => {
        const now = Date.now();

        await UnwrappedPromise.timer(100);

        const later = Date.now();

        expect(later - now).toBeGreaterThanOrEqual(100);
    });

    it("Should be able to be used interchangeably with other promises", async () => {
        const uP1 = new UnwrappedPromise<number>((resolve) =>
            setTimeout(() => resolve(1), 1000)
        );
        const uP2 = new UnwrappedPromise<number>((resolve) =>
            setTimeout(() => resolve(2), 700)
        );
        const p3 = new Promise<number>((resolve) =>
            setTimeout(() => resolve(3), 1200)
        );

        const fastest = await Promise.race([uP1, uP2, p3]);

        expect(fastest).toEqual(2);
    });

    it("Should be able to be externally resolved and rejected", async () => {
        const uP1 = new UnwrappedPromise();
        const uP2 = new UnwrappedPromise();
        const uP2C = uP2.catch((err) => err);

        uP1.resolve(1);
        uP2.reject(2);

        expect(await uP1).toEqual(1);
        expect(await uP2C).toEqual(2);
    });

    it("Should expose the promise status correctly", async () => {
        const uP = new UnwrappedPromise((resolve) => setTimeout(resolve, 300));

        const status1 = uP.status;
        const status2 = await new Promise((resolve) =>
            setTimeout(() => resolve(uP.status), 400)
        );

        expect(status1).toEqual("pending");
        expect(status2).toEqual("resolved");
    });

    it("Should allow for chaining", async () => {
        const result = new UnwrappedPromise<number>((resolve) =>
            setTimeout(() => resolve(0), 0)
        )
            .then((value) => value + 2)
            .then((value) => value * 3);

        // expect(result instanceof UnwrappedPromise).toEqual(true);
        expect(await result).toEqual(6);
    });

    it("Should allow for chaining with the static .from method", async () => {
        const result = UnwrappedPromise.from(
            UnwrappedPromise.from(
                new UnwrappedPromise<number>((resolve) =>
                    setTimeout(() => resolve(0), 0)
                ).then((value) => value + 2)
            ).then((value) => value * 3)
        );

        expect(result instanceof UnwrappedPromise).toEqual(true);
        expect(await result).toEqual(6);
    });
});
