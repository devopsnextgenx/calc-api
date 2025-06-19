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
    int result = add(5, 3); // Assuming add is a function declared in mylib.h
    std::cout << "The result of adding 5 and 3 is: " << result << std::endl;

    return 0;
}