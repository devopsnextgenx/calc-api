#pragma once
#include <jni.h>

#ifdef __cplusplus
extern "C" {
#endif

JNIEXPORT jint JNICALL Java_io_calc_nativex_Calc_add(JNIEnv *, jobject, jint, jint);
JNIEXPORT jint JNICALL Java_io_calc_nativex_Calc_sub(JNIEnv *, jobject, jint, jint);
JNIEXPORT jint JNICALL Java_io_calc_nativex_Calc_mul(JNIEnv *, jobject, jint, jint);
JNIEXPORT jdouble JNICALL Java_io_calc_nativex_Calc_divx(JNIEnv *, jobject, jdouble, jdouble);
JNIEXPORT jint JNICALL Java_io_calc_nativex_Calc_sqr(JNIEnv *, jobject, jint);

#ifdef __cplusplus
}
#endif