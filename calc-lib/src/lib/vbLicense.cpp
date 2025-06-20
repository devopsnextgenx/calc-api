#include "vbLicense.h"
#include <unordered_set>


VbLicense& VbLicense::instance() {
    static VbLicense instance;
    return instance;
}

void VbLicense::init(const std::string& userId, const std::string& productId) {
    std::lock_guard<std::mutex> lock(instance().mtx);
    instance().userProductTokens[userId][productId] = 0;
    instance().userTokenCount[userId] = 0;
}

bool VbLicense::checkoutToken(const std::string& userId, const std::string& productId, int tokenValue) {
    std::lock_guard<std::mutex> lock(instance().mtx);
    instance().userProductTokens[userId][productId] += tokenValue;
    instance().userTokenCount[userId] += tokenValue;
    return true;
}

bool VbLicense::checkInToken(const std::string& userId, const std::string& productId, int tokenValue) {
    std::lock_guard<std::mutex> lock(instance().mtx);
    if (instance().userProductTokens[userId][productId] < tokenValue || instance().userTokenCount[userId] < tokenValue) {
        return false;
    }
    instance().userProductTokens[userId][productId] -= tokenValue;
    instance().userTokenCount[userId] -= tokenValue;
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
