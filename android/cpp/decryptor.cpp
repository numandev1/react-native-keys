//
// Created by Numan on 31/05/2023.
//

#include "decryptor.h"

#include <stdexcept>
#include <algorithm>
#include <iterator>
#include <openssl/evp.h>
#include <openssl/aes.h>
#include <openssl/bio.h>
#include <openssl/buffer.h>
#include <openssl/err.h>
#include <openssl/md5.h>
#include <openssl/rand.h>

    std::vector<uint8_t> decryptor::base64_decode(const std::string& input) {
        BIO* b64 = BIO_new(BIO_f_base64());
        BIO* bmem = BIO_new_mem_buf(input.c_str(), input.length());
        bmem = BIO_push(b64, bmem);

        BIO_set_flags(bmem, BIO_FLAGS_BASE64_NO_NL);
        std::vector<uint8_t> output(input.length());

        int decoded_length = BIO_read(bmem, output.data(), output.size());
        BIO_free_all(bmem);

        if (decoded_length < 0) {
            throw std::runtime_error("Base64 decoding error.");
        }

        output.resize(decoded_length);
        return output;
    }

    struct OpenSSLKeyResult {
        std::vector<uint8_t> key;
        std::vector<uint8_t> iv;
    };

    decryptor::OpenSSLKeyResult decryptor::openSSLKey(const std::vector<uint8_t>& password, const std::vector<uint8_t>& salt) {
        OpenSSLKeyResult result;

        const EVP_CIPHER* cipher = EVP_get_cipherbyname("aes-256-cbc");
        std::vector<uint8_t> key(EVP_CIPHER_key_length(cipher));
        std::vector<uint8_t> iv(EVP_CIPHER_iv_length(cipher));

        EVP_BytesToKey(
                cipher,
                EVP_md5(),
                salt.data(),
                password.data(),
                password.size(),
                1,
                key.data(),
                iv.data()
        );

        result.key = key;
        result.iv = iv;

        return result;
    }

    std::vector<uint8_t> decryptor::rawDecrypt(const std::vector<uint8_t>& input, const std::vector<uint8_t>& key, const std::vector<uint8_t>& iv) {
        std::vector<uint8_t> output(input.size() + EVP_MAX_BLOCK_LENGTH);
        int output_length = 0;

        EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
        EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), nullptr, key.data(), iv.data());

        EVP_DecryptUpdate(ctx, output.data(), &output_length, input.data(), input.size());

        int final_length = 0;
        EVP_DecryptFinal_ex(ctx, output.data() + output_length, &final_length);

        EVP_CIPHER_CTX_free(ctx);

        output.resize(output_length + final_length);
        return output;
    }

    std::string decryptor::dec(const std::string& input, const std::string& password, bool binary) {
        std::vector<uint8_t> cryptArr = base64_decode(input);
        std::vector<uint8_t> salt(cryptArr.begin() + 8, cryptArr.begin() + 16);

        OpenSSLKeyResult pbe = openSSLKey(std::vector<uint8_t>(password.begin(), password.end()), salt);
        std::vector<uint8_t>& key = pbe.key;
        std::vector<uint8_t>& iv = pbe.iv;

        cryptArr = std::vector<uint8_t>(cryptArr.begin() + 16, cryptArr.end());
        std::vector<uint8_t> decrypted = rawDecrypt(cryptArr, key, iv);

        std::string result(decrypted.begin(), decrypted.end());
        return result;
    }
