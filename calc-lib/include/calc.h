#ifndef CALCLIB_H
#define CALCLIB_H

#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT
#endif

#ifdef __cplusplus
extern "C" {
#endif

namespace calc {
    EXPORT int add(int a, int b);
    EXPORT int sub(int a, int b);
    EXPORT int mul(int a, int b);
    EXPORT float divx(double a, double b);
    EXPORT int sqr(int a);
}

#ifdef __cplusplus
}
#endif

#endif // CALCLIB_H