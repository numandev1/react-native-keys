//
// Created by Numan on 31/05/2023.
//

#ifndef EXAMPLE_DECRYPTOR_H
#define EXAMPLE_DECRYPTOR_H
#include <string>
#include <vector>

class decryptor {
public:
    static std::string dec(const std::string& input, const std::string& password, bool binary);
    static std::vector<uint8_t> base64_decode(const std::string& input);
    struct OpenSSLKeyResult {
        std::vector<uint8_t> key;
        std::vector<uint8_t> iv;
    };
    static OpenSSLKeyResult openSSLKey(const std::vector<uint8_t>& password, const std::vector<uint8_t>& salt);
    static std::vector<uint8_t> rawDecrypt(const std::vector<uint8_t>& input, const std::vector<uint8_t>& key, const std::vector<uint8_t>& iv);
private:


};


#endif //EXAMPLE_DECRYPTOR_H
