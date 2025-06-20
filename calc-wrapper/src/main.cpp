#include <iostream>
#include <string>
#include "wrapper.h"

// Define Wrapper class if not already defined in wrapper.h

int main(int argc, char* argv[]) {
    // Initialize the wrapper
    Wrapper calcWrapper;

    // Check for command-line arguments
    if (argc < 2) {
        std::cerr << "Usage: calc-wrapper <operation> <operands...>" << std::endl;
        return 1;
    }

    std::string operation = argv[1];

    // Handle different operations
    if (operation == "add") {
        if (argc != 4) {
            std::cerr << "Usage: calc-wrapper add <num1> <num2>" << std::endl;
            return 1;
        }
        std::string result = calcWrapper.calc_add(std::stod(argv[2]), std::stod(argv[3]));
        std::cout << "Result: " << result << std::endl;
    } else if (operation == "substract") {
        if (argc != 4) {
            std::cerr << "Usage: calc-wrapper substract <num1> <num2>" << std::endl;
            return 1;
        }
        std::string result = calcWrapper.calc_subtract(std::stod(argv[2]), std::stod(argv[3]));
        std::cout << "Result: " << result << std::endl;
    } else if (operation == "divide") {
        if (argc != 4) {
            std::cerr << "Usage: calc-wrapper devide <num1> <num2>" << std::endl;
            return 1;
        }
        std::string result = calcWrapper.calc_divide(std::stod(argv[2]), std::stod(argv[3]));
        std::cout << "Result: " << result << std::endl;
    } else if (operation == "square") {
        if (argc != 3) {
            std::cerr << "Usage: calc-wrapper square <num1>" << std::endl;
            return 1;
        }
        std::string result = calcWrapper.calc_square(std::stod(argv[2]));
        std::cout << "Result: " << result << std::endl;
    } else {
        std::cerr << "Unknown operation: " << operation << std::endl;
        return 1;
    }

    return 0;
}