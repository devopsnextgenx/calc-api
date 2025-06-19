const addon = require('../build/calc-napi');

export interface CalcNapi {
    getVersion(): string;
    getUsage(): any;
    add(a: number, b: number): number;
    sub(a: number, b: number): number;
    mul(a: number, b: number): number;
    divx(a: number, b: number): number;
    sqr(a: number): number;
}

export const CalcNapi: {
    new(namedUser: string): CalcNapi;
} = addon.CalcNapi;
