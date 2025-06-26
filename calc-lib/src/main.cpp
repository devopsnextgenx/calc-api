#include <iostream>
#include "calc.h"

using namespace calc;
int main() {
    std::cout << "Welcome to My C++ Library!" << std::endl;

    // Take user input
    int a, b;
    std::cout << "Enter two integers to add: ";
    std::cout << "Enter a: ";
    std::cin >> a;
    std::cout << "Enter b: ";
    std::cin >> b;
    // Example usage of the library function
    std::string result = add(a, b); // Assuming add is a function declared in mylib.h
    std::cout << "The result of adding " << a << " and " << b << " is: " << result << std::endl;

    return 0;
}