# My C++ Library

This project is a C++ library that can be compiled into a shared library (DLL) or an executable. It is designed to work on both Windows and Linux environments.

## Project Structure

```
calc-lib
├── CMakeLists.txt       # CMake configuration file
├── README.md            # Project documentation
├── src                  # Source files
│   ├── lib              # Library implementation
│   │   ├── java         # Java Implementation
│   │   │   ├── calc.cpp
│   │   └── calcImpl.cpp    # Implementation of library functions
│   └── main.cpp         # Entry point for the application
├── include              # Header files
│   ├── java         # Java Implementation
|   │   ├── calc.cpp
│   └── calc.h         # Declarations of library functions
```

## Building the Project

To build the project, you need to have CMake installed. Follow these steps:

1. Clone the repository or download the project files.
2. Open a terminal and navigate to the project directory.
3. Create a build directory:
   ```
   mkdir build
   ```
4. Run CMake to configure the project:
   ```
   cmake -S . -B build
   ```
5. Compile the project:
   ```
   cmake --build build
   ```

## Usage

After building the project, you can use the generated library or executable in your applications. The `main.cpp` file serves as an example of how to use the functions provided by the library.

## Compatibility

This project is compatible with both Windows and Linux environments. The CMake configuration automatically handles the differences in building shared libraries and executables based on the platform.