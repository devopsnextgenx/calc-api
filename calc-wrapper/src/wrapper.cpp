#include "wrapper.h"
#include "calc.h"
#include <string>
#include <iostream>

double Wrapper::calc_add(double a, double b) {
    int a_int = static_cast<int>(a);
    int b_int = static_cast<int>(b);
    return (double)calc::add(a_int, b_int); // Assuming add is a function in libcalc
}

double Wrapper::calc_subtract(double a, double b) {
    int a_int = static_cast<int>(a);
    int b_int = static_cast<int>(b);
    return (double)calc::sub(a_int, b_int); // Assuming subtract is a function in libcalc
}

double Wrapper::calc_multiply(double a, double b) {
    int a_int = static_cast<int>(a);
    int b_int = static_cast<int>(b);
    return (double)calc::mul(a_int, b_int); // Assuming multiply is a function in libcalc
}

double Wrapper::calc_divide(double a, double b) {
    int a_int = static_cast<int>(a);
    int b_int = static_cast<int>(b);
    if (b_int == 0) {
        throw std::invalid_argument("Division by zero is not allowed.");
    }
    return (double)calc::divx(a_int, b_int); // Use the quotient part of div_t
}

double Wrapper::calc_square(double a) {
    int a_int = static_cast<int>(a);
    return (double)calc::sqr(a);
}