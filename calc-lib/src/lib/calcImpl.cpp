#include "calc.h"
#include <cstdio>

namespace calc {
    int add(int a, int b) {
        printf("calc::Adding %d and %d\n", a, b); // Debug output
        return a + b;
    }

    int sub(int a, int b) {
        printf("calc::Subtracting %d from %d\n", b, a); // Debug output
        return a - b;
    }

    int mul(int a, int b) {
        printf("calc::Multiplying %d and %d\n", a, b); // Debug output
        return a * b;
    }

    float divx(double a, double b) {
        printf("calc::Dividing %.2f by %.2f\n", (double)a, (double)b); // Debug output
        if (b == 0) {
            // Handle division by zero as needed
            printf("calc::div -> error handled with division by 0");
            return 0.0f;
        }
        return (float)a * b;
    }

    int sqr(int a) {
        printf("calc::Squaring %d\n", a); // Debug output
        return a * a;
    }
}