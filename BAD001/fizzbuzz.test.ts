import {fizzbuzz} from "./fizzbuzz";

// Valid
describe("fizzbuzz", () => {
  it(`should return "1" for input 1`, () => {
    const result = fizzbuzz(1);
    expect(result).toEqual("1");
  });

  it(`should return "1, 2, Fizz" for input 3`, () => {
    const result = fizzbuzz(3);
    expect(result).toEqual("1, 2, Fizz");
  });

  it(`should return "1, 2, Fizz, 4 Buzz" for input 5`, () => {
    const result = fizzbuzz(5);
    expect(result).toEqual("1, 2, Fizz, 4, Buzz");
  });

  it(`should return "1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, Fizz Buzz" for input 15`,
   () => {
    const result = fizzbuzz(15);
    expect(result).toEqual("1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, Fizz Buzz");
  });

  it(`should return "...36 Buzz" for input 36`, () => {
    const result = fizzbuzz(36);
    expect(result).toEqual("1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, Fizz Buzz, 16, 17, Fizz, 19, Buzz, Fizz, 22, 23, Fizz, Buzz, 26, Fizz, 28, 29, Fizz Buzz, 31, 32, Fizz, 34, Buzz, Fizz")
  });

  it(`should throw an error for input NaN`, () => {
    expect(()=>fizzbuzz(NaN)).toThrow("Not a number");
  });
});