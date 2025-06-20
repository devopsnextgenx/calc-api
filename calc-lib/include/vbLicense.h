#ifndef VB_LICENSE_H
#define VB_LICENSE_H

#include <string>
#include <unordered_map>
#include <mutex>

class VbLicense {
public:
    // Singleton instance accessor
    static VbLicense& instance();

    // All functions are now static and operate on the singleton instance
    static void init(const std::string& userId, const std::string& productId);
    static bool checkoutToken(const std::string& userId, const std::string& productId, int tokenValue);
    static bool checkInToken(const std::string& userId, const std::string& productId, int tokenValue);
    static void reset(const std::string& userId, const std::string& productId);
    static int getTokenCount(const std::string& userId);

private:
    VbLicense() = default;
    VbLicense(const VbLicense&) = delete;
    VbLicense& operator=(const VbLicense&) = delete;

    // Map: userId -> productId -> cumulative token count for that product
    std::unordered_map<std::string, std::unordered_map<std::string, int>> userProductTokens;
    // Map: userId -> total token count
    std::unordered_map<std::string, int> userTokenCount;
    std::mutex mtx;
};

#endif // VB_LICENSE_H
