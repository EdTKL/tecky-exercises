import { factorial, fibonacci } from "./factorial_fibonacci";

//Valid test
describe("factorial", () => {
    it('should return 1 for 0 factorial', ()=>{
        expect(factorial(0)).toBe(1);
        expect(factorial(1)).toBe(1);
    });

    it('should return 120 for 5 factorial', ()=>{
        expect(factorial(5)).toBe(120);
    });

    it('should return 3628800 with input 10', () => {
        expect(factorial(10)).toEqual(3628800);
    });
});

//Invalid test
test('should throw an error msg for -4 factorial', ()=>{
    expect(() => factorial(-4)).toThrow('Negative factorial does not exist.');
})

// Unexpected test
test('should throw an error msg for null input', () =>{
    expect(() => factorial(null)).toThrow('Null input is not accepted.');
})

//Valid test
describe('fibonacci', () => {
    it('should return 1 for fibonacci 1 or 2', () =>{
        expect(fibonacci(1)).toBe(1);
        expect(fibonacci(2)).toBe(1);
    });

    it('should return 2 for fibonacci 3', () =>{
        expect(fibonacci(3)).toBe(2);
    });

    it('should return 21 for fibonacci 8', () =>{
        expect(fibonacci(8)).toBe(21);
    });

    it('should return 14 for fibonacci 12', () =>{
        expect(fibonacci(12)).toBe(144);
    });

})

//Invalid test
test('should throw an error msg for -ve fibonacci', ()=>{
    expect(() => fibonacci(-1)).toThrow('Negative number is not accpeted.');
})

// Unexpected test
test('should throw an error msg for null fibonacci', ()=>{
    expect(() => fibonacci(null)).toThrow('Null input is not accpeted.');
})
