#include "calc.h"
#include <cstdio>
#include <string>
#include <functional>
#include <stdexcept>
#include "vbLicense.h"
#include <cstring> // Add this include at the top for strdup

namespace calc {
    // Result struct for JSON-like return
    struct CalcResult {
        double result = 0;
        std::string errorMessage;
        std::string status; // "success" or "error"

        // Add this constructor:
        CalcResult(double r, const std::string& err, const std::string& stat)
            : result(r), errorMessage(err), status(stat) {}

        std::string to_json_string() const {
            return std::string("{\"result\":") + std::to_string(result) +
                   ",\"errorMessage\":\"" + errorMessage +
                   "\",\"status\":\"" + status + "\"}";
        }
    };

    // License check wrapper
    template<typename Func, typename... Args>
    std::string with_license_check(Func func, int tokens, const char* productId, Args... args) {
        // For singleton, use a fixed userId, e.g., "defaultUser"
        const std::string userId = "defaultUser";
        if (!VbLicense::checkoutToken(userId, productId, tokens)) {
            return CalcResult{0, "Insufficient credit tokens", "error"}.to_json_string();
        }
        try {
            double res = func(args...);
            return CalcResult{res, "", "success"}.to_json_string();
        } catch (const std::exception& e) {
            return CalcResult{0, e.what(), "error"}.to_json_string();
        }
    }

    // Actual operations
    int add_impl(int a, int b) {
        printf("calc::add called with %d and %d\n", a, b);
        return a + b;
    }
    int sub_impl(int a, int b) {
        printf("calc::sub called with %d and %d\n", a, b);
        return a - b;
    }
    int mul_impl(int a, int b) {
        printf("calc::mul called with %d and %d\n", a, b);
        return a * b;
    }
    float divx_impl(double a, double b) {
        printf("calc::divx called with %f and %f\n", a, b);
        if (b == 0) throw std::runtime_error("Division by zero");
        return static_cast<float>(a / b);
    }
    int sqr_impl(int a) {
        printf("calc::sqr called with %d\n", a);
        return a * a;
    }

    // Helper for portable strdup
    inline char* portable_strdup(const char* s) {
#ifdef _WIN32
        return _strdup(s);
#else
        return strdup(s);
#endif
    }

    // Exposed API with license check
    char* add(int a, int b) {
        std::string result = with_license_check(
            [](int x, int y) { return static_cast<double>(add_impl(x, y)); },
            5, "sum", a, b
        );
        printf("calc::add result: %s\n", result.c_str());
        return portable_strdup(result.c_str());
    }
    char* sub(int a, int b) {
        std::string result = with_license_check(
            [](int x, int y) { return static_cast<double>(sub_impl(x, y)); },
            5, "sum", a, b
        );
        printf("calc::sub result: %s\n", result.c_str());
        return portable_strdup(result.c_str());
    }
    char* mul(int a, int b) {
        std::string result = with_license_check(
            [](int x, int y) { return static_cast<double>(mul_impl(x, y)); },
            10, "advance", a, b
        );
        printf("calc::mul result: %s\n", result.c_str());
        return portable_strdup(result.c_str());
    }
    char* divx(double a, double b) {
        std::string result = with_license_check(divx_impl, 10, "advance", a, b);
        printf("calc::divx result: %s\n", result.c_str());
        return portable_strdup(result.c_str());
    }
    char* sqr(int a) {
        std::string result = with_license_check(
            [](int x) { return static_cast<double>(sqr_impl(x)); },
            15, "pwr", a
        );
        printf("calc::sqr result: %s\n", result.c_str());
        return portable_strdup(result.c_str());
    }
    void free_result(char* s) {
        free(s);
    }
}