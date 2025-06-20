const addon = require('../build/calc-napi');

export interface CalcNapi {
    getVersion(): string;
    getUsage(): any;
    add(a: number, b: number): string;
    sub(a: number, b: number): string;
    mul(a: number, b: number): string;
    divx(a: number, b: number): string;
    sqr(a: number): string;
}

export const CalcNapi: {
    new(namedUser: string): CalcNapi;
} = addon.CalcNapi;
