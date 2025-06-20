#include "vbLicense.h"
#include <unordered_set>


VbLicense& VbLicense::instance() {
    static VbLicense instance;
    if (!instance.initialized) {
        // Initialize the singleton instance if not already done
        instance.initialized = true;
        init("defaultUser", "defaultProduct"); // Default initialization
    }
    return instance;
}

void VbLicense::init(const std::string& userId, const std::string& productId) {
    std::lock_guard<std::mutex> lock(instance().mtx);
    instance().userProductTokens[userId][productId] = 50;
    instance().userTokenCount[userId] = 50;
}

bool VbLicense::checkoutToken(const std::string& userId, const std::string& productId, int tokenValue) {
    std::lock_guard<std::mutex> lock(instance().mtx);
    if ((instance().userTokenCount[userId] - tokenValue) < 0 ) {
        return false;
    }
    instance().userTokenCount[userId] -= tokenValue;
    return true;
}

bool VbLicense::checkInToken(const std::string& userId, const std::string& productId, int tokenValue) {
    std::lock_guard<std::mutex> lock(instance().mtx);
    instance().userTokenCount[userId] += tokenValue;
    return true;
}

void VbLicense::reset(const std::string& userId, const std::string& productId) {
    std::lock_guard<std::mutex> lock(instance().mtx);
    instance().userTokenCount[userId] = 0;
    instance().userProductTokens[userId][productId] = 0;
}

int VbLicense::getTokenCount(const std::string& userId) {
    std::lock_guard<std::mutex> lock(instance().mtx);
    auto it = instance().userTokenCount.find(userId);
    if (it != instance().userTokenCount.end()) {
        return it->second;
    }
    return 0;
}
