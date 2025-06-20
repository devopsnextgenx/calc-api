#ifndef CALCLIB_H
#define CALCLIB_H

#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT
#endif

#include <string>

namespace calc {
    EXPORT char* add(int a, int b);
    EXPORT char* sub(int a, int b);
    EXPORT char* mul(int a, int b);
    EXPORT char* divx(double a, double b);
    EXPORT char* sqr(int a);
    EXPORT void free_result(char* s);
}

#endif // CALCLIB_H
