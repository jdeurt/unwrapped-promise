export function sum(...nums: number[]): number {
    let index = 0,
        total = 0;
    for (; index < nums.length; index++) total += nums[index];
    return total;
}
