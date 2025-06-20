/**
 * @file CalcNapi.cxx
 * @author Amit Kshirsagar
 * @brief Implementation file for CalcNapi class, which wraps Node.js native addon functionality.
 */

#include <napi.h>
#include "CalcNapi.hxx"
#include "calc.h"
#include <string>

using namespace Napi;

namespace CalcNapi {
    CalcWrapper::CalcWrapper(const Napi::CallbackInfo& info) : Napi::ObjectWrap<CalcWrapper>(info) {
        _calcNapiVersion = "0.0.0a"; // Example version, replace with actual logic if needed
        _calcAdd = 0;
        _calcSubstract = 0;
        _calcMultiply = 0;
        _calcDivide = 0;
        _calcSquare = 0;
        Napi::Env env = info.Env();

        if (info.Length() < 1) {
            Napi::TypeError::New(env, "Expected a string argument").ThrowAsJavaScriptException();
            return;
        }

        if(!info[0].IsString()) {
            Napi::TypeError::New(env, "Expected a string for named user").ThrowAsJavaScriptException();
            return;
        }
        this->_calcNamedUser = info[0].As<Napi::String>().Utf8Value();
    }

    Napi::Value CalcWrapper::GetVersion(const Napi::CallbackInfo& info) {
        printf("CalcNapi::CalcWrapper::GetVersion called\n");
        Napi::Env env = info.Env();
        return Napi::String::New(env, _calcNapiVersion);
    }

    Napi::Value CalcWrapper::GetUsage(const Napi::CallbackInfo& info) {
        printf("CalcNapi::CalcWrapper::GetUsage called\n");
        Napi::Env env = info.Env();
        Napi::Object result = Napi::Object::New(env);
        result.Set("add", this->_calcAdd);
        result.Set("substract", this->_calcSubstract);
        result.Set("multiply", this->_calcMultiply);
        result.Set("divide", this->_calcDivide);
        result.Set("square", this->_calcSquare);
        result.Set("namedUser", this->_calcNamedUser);
        result.Set("version", this->_calcNapiVersion);
        return result;
    }

    // Arithmetic method implementations
    Napi::Value CalcWrapper::add(const Napi::CallbackInfo& info) {
        printf("CalcNapi::CalcWrapper::add called\n");
        Napi::Env env = info.Env();
        if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
            Napi::TypeError::New(env, "Expected two number arguments").ThrowAsJavaScriptException();
            return env.Null();
        }
        double a = info[0].As<Napi::Number>().DoubleValue();
        double b = info[1].As<Napi::Number>().DoubleValue();
        _calcAdd++;
        return Napi::String::New(env, calc::add(static_cast<int>(a), static_cast<int>(b)));
    }

    Napi::Value CalcWrapper::substract(const Napi::CallbackInfo& info) {
        printf("CalcNapi::CalcWrapper::substract called\n");
        Napi::Env env = info.Env();
        if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
            Napi::TypeError::New(env, "Expected two number arguments").ThrowAsJavaScriptException();
            return env.Null();
        }
        double a = info[0].As<Napi::Number>().DoubleValue();
        double b = info[1].As<Napi::Number>().DoubleValue();
        _calcSubstract++;
        return Napi::String::New(env, calc::sub(static_cast<int>(a), static_cast<int>(b)));
    }

    Napi::Value CalcWrapper::multiply(const Napi::CallbackInfo& info) {
        printf("CalcNapi::CalcWrapper::multiply called\n");
        Napi::Env env = info.Env();
        if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
            Napi::TypeError::New(env, "Expected two number arguments").ThrowAsJavaScriptException();
            return env.Null();
        }
        double a = info[0].As<Napi::Number>().DoubleValue();
        double b = info[1].As<Napi::Number>().DoubleValue();
        _calcMultiply++;
        return Napi::String::New(env, calc::mul(static_cast<int>(a), static_cast<int>(b)));
    }

    Napi::Value CalcWrapper::divide(const Napi::CallbackInfo& info) {
        printf("CalcNapi::CalcWrapper::divide called\n");
        Napi::Env env = info.Env();
        if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
            Napi::TypeError::New(env, "Expected two number arguments").ThrowAsJavaScriptException();
            return env.Null();
        }
        double a = info[0].As<Napi::Number>().DoubleValue();
        double b = info[1].As<Napi::Number>().DoubleValue();
        if (b == 0) {
            Napi::Error::New(env, "Division by zero").ThrowAsJavaScriptException();
            return env.Null();
        }
        _calcDivide++;
        return Napi::String::New(env, calc::divx(a, b));
    }

    Napi::Value CalcWrapper::square(const Napi::CallbackInfo& info) {
        printf("CalcNapi::CalcWrapper::square called\n");
        Napi::Env env = info.Env();
        if (info.Length() < 1 || !info[0].IsNumber()) {
            Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
            return env.Null();
        }
        double a = info[0].As<Napi::Number>().DoubleValue();
        _calcSquare++;
        return Napi::String::New(env, calc::sqr(static_cast<int>(a)));
    }
    
    Napi::Function CalcWrapper::GetClass(Napi::Env env) {
        Napi::Function func = DefineClass(env, "CalcNapi", {
            InstanceMethod("getVersion", &CalcWrapper::GetVersion),
            InstanceMethod("getUsage", &CalcWrapper::GetUsage),
            InstanceMethod("add", &CalcWrapper::add),
            InstanceMethod("sub", &CalcWrapper::substract),
            InstanceMethod("mul", &CalcWrapper::multiply),
            InstanceMethod("divx", &CalcWrapper::divide),
            InstanceMethod("sqr", &CalcWrapper::square),
        });

        return func;
    }

}


Napi::Object InitCalcNapi(Napi::Env env, Napi::Object exports) {
    Napi::String name = Napi::String::New(env, "CalcNapi");
    exports.Set(name, CalcNapi::CalcWrapper::GetClass(env));
    return exports;
}

// NODE_API_MODULE(addon, InitAll)