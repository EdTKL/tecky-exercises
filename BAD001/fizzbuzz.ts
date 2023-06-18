export function fizzbuzz(num: number) {
    if(isNaN(num)){
      throw new Error("Not a number")
    };

    const result = [];

    for (let i = 1; i <= num; i++) {
      if (i % 3 === 0 && i % 5 === 0) {
        result.push("Fizz Buzz");
      } else if (i % 5 === 0) {
        result.push("Buzz");
      } else if (i % 3 === 0) {
        result.push("Fizz");
      } else {
        result.push((i));
      }
    };
    return result.join(', ');
}
