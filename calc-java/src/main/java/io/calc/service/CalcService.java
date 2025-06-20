package io.calc.service;

import org.springframework.stereotype.Service;

import io.calc.nativex.Calc;

@Service
public class CalcService {
    // This is a no-op class
    public CalcService() {
        calc = new Calc();
    }

    private static Calc calc;
    public int add(int a, int b) {
        System.out.println("Adding " + a + " and " + b);
        return calc.add(a, b);
    }

    public int subtract(int a, int b) {
        System.out.println("Substracting " + b + " from " + a);
        return calc.sub(a, b);
    }

    public int multiply(int a, int b) {
        System.out.println("Multiplying " + a + " and " + b);
        return calc.mul(a, b);
    }

    public float divide(double a, double b) {
        System.out.println("Dividing " + a + " by " + b);
        float result = calc.divx(a, b);
        System.out.println("Result: " + result);
        return result;
    }

    public int sqr(int a) {
        System.out.println("Squaring " + a);
        return calc.sqr(a);
    }
}