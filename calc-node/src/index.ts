import { CalcNapi } from './bindings';

const test = async () => {
    const calc = new CalcNapi('trzxs9');
    console.log("CalcNapi version: ", calc.getVersion());
    console.log("CalcNapi.add(1, 2): ", calc.add(1, 2));
    console.log("CalcNapi.substract(5, 3): ", calc.sub(5, 3));
    console.log("CalcNapi.multiply(4, 6): ", calc.mul(4, 6));
    console.log("CalcNapi.multiply(2, 9): ", calc.mul(2, 9));
    console.log("CalcNapi.multiply(3, 4): ", calc.mul(3, 4));
    console.log("CalcNapi.divide(8, 2): ", calc.divx(8, 2));
    console.log("CalcNapi.square(3): ", calc.sqr(3));
    console.log("CalcNapi.square(5): ", calc.sqr(5));
    console.log("CalcNapi usage: ", calc.getUsage());
}

test();