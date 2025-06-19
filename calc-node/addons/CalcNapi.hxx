/**
 * @file SaltNapi.hxx
 * @author Amit Kshirsagar
 * @brief Header file for SaltNapi class, which wraps Node.js native addon functionality.
 */

#pragma once
#include <napi.h>
#include <string>
#include <vector>

namespace CalcNapi {
    class CalcWrapper : public Napi::ObjectWrap<CalcWrapper> {
    public:
        CalcWrapper(const Napi::CallbackInfo&);
        Napi::Value GetVersion(const Napi::CallbackInfo&);
        Napi::Value add(const Napi::CallbackInfo&);
        Napi::Value substract(const Napi::CallbackInfo&);
        Napi::Value multiply(const Napi::CallbackInfo&);
        Napi::Value divide(const Napi::CallbackInfo&);
        Napi::Value square(const Napi::CallbackInfo&);
        Napi::Value GetUsage(const Napi::CallbackInfo&);

        static Napi::Function GetClass(Napi::Env env);

    private:
        std::string _calcNapiVersion;
        std::string _calcNamedUser;
        std::size_t _calcAdd = 0;
        std::size_t _calcSubstract = 0;
        std::size_t _calcMultiply = 0;
        std::size_t _calcDivide = 0;
        std::size_t _calcSquare = 0;
    };
}

Napi::Object InitCalcNapi(Napi::Env env, Napi::Object exports);