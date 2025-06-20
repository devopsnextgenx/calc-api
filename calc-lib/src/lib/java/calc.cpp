#include <jni.h>
#include <java/calc.h>
#include "calc.h"

jstring JNICALL Java_io_calc_nativex_Calc_add(JNIEnv *env, jobject obj, jint a, jint b) {
    char* result = calc::add(a, b);
    jstring jresult = env->NewStringUTF(result);
    calc::free_result(result);
    return jresult;
}

jstring JNICALL Java_io_calc_nativex_Calc_sub(JNIEnv *env, jobject obj, jint a, jint b) {
    char* result = calc::sub(a, b);
    jstring jresult = env->NewStringUTF(result);
    calc::free_result(result);
    return jresult;
}

jstring JNICALL Java_io_calc_nativex_Calc_mul(JNIEnv *env, jobject obj, jint a, jint b) {
    char* result = calc::mul(a, b);
    jstring jresult = env->NewStringUTF(result);
    calc::free_result(result);
    return jresult;
}

jstring JNICALL Java_io_calc_nativex_Calc_divx(JNIEnv *env, jobject obj, jdouble a, jdouble b) {
    char* result = calc::divx(a, b);
    jstring jresult = env->NewStringUTF(result);
    calc::free_result(result);
    return jresult;
}

jstring JNICALL Java_io_calc_nativex_Calc_sqr(JNIEnv *env, jobject obj, jint a) {
    char* result = calc::sqr(a);
    jstring jresult = env->NewStringUTF(result);
    calc::free_result(result);
    return jresult;
}