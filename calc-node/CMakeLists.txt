cmake_minimum_required(VERSION 3.15)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

# Ensure cmake-js variables are set
if(NOT DEFINED CMAKE_JS_INC OR NOT DEFINED CMAKE_JS_LIB)
    message(FATAL_ERROR "This project must be built with cmake-js. Run: cmake-js build")
endif()

project(calc-napi VERSION 0.1.0 LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 17)

add_definitions(-DNAPI_VERSION=9)
include_directories(${CMAKE_JS_INC} "addons" "include")
file(GLOB SOURCE_FILES "addons/*")

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
set_target_properties(calc-napi PROPERTIES
    INSTALL_RPATH "$ORIGIN"
)

# Detect platform and set library name
if(WIN32)
    set(CALC_LIB "${CMAKE_SOURCE_DIR}/libs/libcalc.lib")
else()
    set(CALC_LIB "${CMAKE_SOURCE_DIR}/libs/libcalc.so")
endif()

# Link only to the correct node.lib for MSVC, otherwise use CMAKE_JS_LIB
if(MSVC)
    target_link_libraries(${PROJECT_NAME} PRIVATE ${CMAKE_SOURCE_DIR}/libs/node.lib ${CALC_LIB})
else()
    target_link_libraries(${PROJECT_NAME} PRIVATE ${CMAKE_JS_LIB})
endif()


# Windows-specific linking
if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
    execute_process(
        COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_JS_LIB}
    )
endif()

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
    $<TARGET_FILE:${PROJECT_NAME}>
    ${CMAKE_SOURCE_DIR}/build/${PROJECT_NAME}.node
)