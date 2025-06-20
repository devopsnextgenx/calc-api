#include <jni.h>
#include <java/calc.h>
#include "calc.h"

JNIEXPORT jint JNICALL Java_io_calc_nativex_Calc_add(JNIEnv *env, jobject obj, jint a, jint b) {
    return calc::add(a, b);
}

JNIEXPORT jint JNICALL Java_io_calc_nativex_Calc_sub(JNIEnv *env, jobject obj, jint a, jint b) {
    return calc::sub(a, b);
}

JNIEXPORT jint JNICALL Java_io_calc_nativex_Calc_mul(JNIEnv *env, jobject obj, jint a, jint b) {
    return calc::mul(a, b);
}

JNIEXPORT jfloat JNICALL Java_io_calc_nativex_Calc_divx(JNIEnv *env, jobject obj, jdouble a, jdouble b) {
    return calc::divx(a, b);
}

JNIEXPORT jint JNICALL Java_io_calc_nativex_Calc_sqr(JNIEnv *env, jobject obj, jint a) {
    return calc::sqr(a);
}