#include "wrapper.h"
#include "calc.h"
#include <string>
#include <iostream>

std::string Wrapper::calc_add(double a, double b) {
    int a_int = static_cast<int>(a);
    int b_int = static_cast<int>(b);
    char* result = calc::add(a_int, b_int);
    std::string str_result(result);
    calc::free_result(result);
    return str_result;
}

std::string Wrapper::calc_subtract(double a, double b) {
    int a_int = static_cast<int>(a);
    int b_int = static_cast<int>(b);
    char* result = calc::sub(a_int, b_int);
    std::string str_result(result);
    calc::free_result(result);
    return str_result;
}

std::string Wrapper::calc_multiply(double a, double b) {
    int a_int = static_cast<int>(a);
    int b_int = static_cast<int>(b);
    char* result = calc::mul(a_int, b_int);
    std::string str_result(result);
    calc::free_result(result);
    return str_result;
}

std::string Wrapper::calc_divide(double a, double b) {
    int a_int = static_cast<int>(a);
    int b_int = static_cast<int>(b);
    if (b_int == 0) {
        throw std::invalid_argument("Division by zero is not allowed.");
    }
    char* result = calc::divx(a_int, b_int);
    std::string str_result(result);
    calc::free_result(result);
    return str_result;
}

std::string Wrapper::calc_square(double a) {
    int a_int = static_cast<int>(a);
    char* result = calc::sqr(a_int);
    std::string str_result(result);
    calc::free_result(result);
    return str_result;
}