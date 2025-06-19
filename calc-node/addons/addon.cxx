#include <napi.h>
#include "CalcNapi.hxx"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    InitCalcNapi(env, exports);
    return exports;
}

NODE_API_MODULE(addon, InitAll)
