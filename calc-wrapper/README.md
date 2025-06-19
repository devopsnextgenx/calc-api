# calc-wrapper Project

This project provides a wrapper around the `libcalc` library, allowing for easier access to its functionalities through a user-friendly interface. The wrapper is implemented in C++ and can be built using CMake.

## Project Structure

```
calc-wrapper
├── src
│   ├── main.cpp        # Entry point of the application
│   ├── wrapper.cpp     # Implementation of the wrapper functions
│   └── wrapper.h       # Header file for the wrapper functions
├── include
│   └── calc.h         # Header file for the libcalc library
├── lib
│   └── libcalc.lib    # Static library for libcalc
├── CMakeLists.txt     # CMake configuration file
└── README.md          # Project documentation
```

## Building the Project

To build the project, follow these steps:

1. Ensure you have CMake installed on your system.
2. Open a terminal and navigate to the `calc-wrapper` directory.
3. Create a build directory:
   ```
   mkdir build
   cd build
   ```
4. Run CMake to configure the project:
   ```
   cmake ..
   ```
5. Build the project:
   ```
   cmake --build .
   ```

This will generate the executable `calc-wrapper.exe` and the corresponding DLL.

## Running the Wrapper

After building the project, you can run the wrapper executable:

```
./calc-wrapper.exe [options]
```

Replace `[options]` with any command-line arguments you wish to pass to the application.

## Dependencies

- CMake (version 3.10 or higher)
- A C++ compiler that supports C++11 or higher

## License

This project is licensed under the MIT License. See the LICENSE file for more details.