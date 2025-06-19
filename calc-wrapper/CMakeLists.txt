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
add_library(calc-wrapper-lib SHARED src/wrapper.cpp)

# Build the executable
add_executable(calc-wrapper ${SOURCES})

# Specify include directories
target_include_directories(calc-wrapper PUBLIC include)

# Link libcalc.lib to both targets
target_link_libraries(calc-wrapper-lib PRIVATE ${CMAKE_SOURCE_DIR}/libs/libcalc.lib)
target_link_libraries(calc-wrapper PRIVATE ${CMAKE_SOURCE_DIR}/libs/libcalc.lib)