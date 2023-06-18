// factorial means !n in maths
// e.g. (!3 = 3 * 2 * 1) (!4 = 4 * 3 * 2 * 1)
export function factorial(num: number | null): number {
    if (num == 0 || num == 1) {
      return 1;
    } else if (num as number < 0) {
      throw new Error ('Negative factorial does not exist.');
    } else if (num == null) {
      throw new Error ('Null input is not accepted.');
    } 
    return factorial(num - 1) * num;
  }
  
  // Basically will output
  //    num: 1  2  3  4  5  6  7   8    9
  // Output: 1, 1, 2, 3, 5, 8, 13, 21, 34
  // Check "fibonacci sequence" for more info
export function fibonacci(num: number | null ): number {
    if (num  == 1 || num == 2) {
      return 1;
    } else if (num as number < 0) {
      throw new Error ('Negative number is not accpeted.');
    } else if (num == null) {
      throw new Error ('Null input is not accpeted.')
    }
  
    return fibonacci(num as number - 1) + fibonacci(num as number- 2);
  }