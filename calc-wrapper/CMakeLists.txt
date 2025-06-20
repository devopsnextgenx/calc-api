project(calc-wrapper)
cmake_minimum_required(VERSION 3.10)

# Set output names
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR}/bin)
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR}/bin)

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)

# Add source files
set(SOURCES
    src/main.cpp
    src/wrapper.cpp
)

# Add the static library directory
link_directories(${CMAKE_SOURCE_DIR}/libs)

# Build the DLL
add_library(calc-wrapper SHARED src/wrapper.cpp)

# Build the executable
add_executable(calc-wrapperx ${SOURCES})

# Specify include directories
target_include_directories(calc-wrapperx PUBLIC include)

# Detect platform and set library name
if(WIN32)
    set(CALC_LIB "${CMAKE_SOURCE_DIR}/libs/calc.lib")
else()
    set(CALC_LIB "${CMAKE_SOURCE_DIR}/libs/libcalc.so")
endif()

# Link the correct library to both targets
target_link_libraries(calc-wrapper PRIVATE ${CALC_LIB})
target_link_libraries(calc-wrapperx PRIVATE ${CALC_LIB})