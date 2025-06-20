package io.calc.nativex;

public class Calc {

  static {
    System.loadLibrary("calc"); // linux -> libcalc.so, windows -> calc.dll
  }

  public native int add(int a, int b);
  public native int sub(int a, int b);
  public native int mul(int a, int b);
  public native float divx(double a, double b);
  public native int sqr(int a);
  public native Object getUsage(int a);
  public native Object getVersion(int a);
}
