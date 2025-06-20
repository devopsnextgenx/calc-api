#pragma once
#include <string>

class Wrapper {
public:
    std::string calc_add(double a, double b);
    std::string calc_subtract(double a, double b);
    std::string calc_multiply(double a, double b);
    std::string calc_divide(double a, double b);
    std::string calc_square(double a);
};