cmake_minimum_required(VERSION 3.10)

project(CalcLibrary)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories("C:/Program Files/Zulu/zulu-21/include")
include_directories("C:/Program Files/Zulu/zulu-21/include/win32")
include_directories("/usr/lib/jvm/java-21-openjdk-amd64/include")
include_directories("/usr/lib/jvm/java-21-openjdk-amd64/include/linux")

# Define the library
add_library(calc SHARED src/lib/calcImpl.cpp src/lib/java/calc.cpp) # This generate shared (.dll/.so) library as well as static (.lib) to be used during linking

# Specify include directories
target_include_directories(calc PUBLIC include)

# Define the executable
add_executable(calcx src/main.cpp)

# Link the library to the executable
target_link_libraries(calcx PRIVATE calc)

# Platform-specific settings
if(WIN32)
    # Windows-specific settings (if any)
    message(STATUS "Configuring for Windows")
elseif(UNIX)
    # Linux-specific settings (if any)
    message(STATUS "Configuring for Linux")
endif()

add_custom_target(clean-all
    COMMAND ${CMAKE_COMMAND} -E rm -rf ${CMAKE_BINARY_DIR}/*
    COMMENT "Cleaning all build files"
)

# Make sure your main build depends on clean-all
add_custom_target(build-all
    DEPENDS clean-all calc calcx
    COMMENT "Clean and build all targets"
)