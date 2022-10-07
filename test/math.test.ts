import * as math from "../src";

describe("Math utilities", () => {
    it("Should be able to get the sum of two numbers", () => {
        expect(math.sum(1, 1, 2)).toBe(4);
    });
});
