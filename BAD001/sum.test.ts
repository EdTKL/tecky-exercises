import sum from './sum'

test('add 1 + 2 equals to 3', ()=>{
    //expectation matcher

    //expect sum of 1 and 2 to be 3
    expect(sum(1, 2)).toBe(3);
})