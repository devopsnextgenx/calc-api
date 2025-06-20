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
    public String add(int a, int b) {
        System.out.println("Adding " + a + " and " + b);
        return calc.add(a, b);
    }

    public String subtract(int a, int b) {
        System.out.println("Substracting " + b + " from " + a);
        return calc.sub(a, b);
    }

    public String multiply(int a, int b) {
        System.out.println("Multiplying " + a + " and " + b);
        return calc.mul(a, b);
    }

    public String divide(double a, double b) {
        System.out.println("Dividing " + a + " by " + b);
        String result = calc.divx(a, b);
        System.out.println("Result: " + result);
        return result;
    }

    public String sqr(int a) {
        System.out.println("Squaring " + a);
        return calc.sqr(a);
    }
}