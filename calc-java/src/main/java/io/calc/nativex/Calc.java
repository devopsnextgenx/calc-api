package io.calc.nativex;

public class Calc {

  static {
    System.loadLibrary("calc"); // linux -> libcalc.so, windows -> calc.dll
  }

  public native String add(int a, int b);
  public native String sub(int a, int b);
  public native String mul(int a, int b);
  public native String divx(double a, double b);
  public native String sqr(int a);
  public native Object getUsage(int a);
  public native Object getVersion(int a);
}
