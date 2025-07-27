#include "crypto.h"
#include <string>
#include "decryptor.h"
#include "encrypted_functions.h"
#include "password_functions.h"

using namespace std;

Crypto::Crypto()
{
}
// Initialize all dummy data for obfuscation
void initializeAllDummies()
{
    initializePasswordDummies();
    initializeEncryptedDummies();
}
string Crypto::getJniJsonStringifyData(string key)
{
    // Initialize dummy data (obfuscation)
    initializeAllDummies();
    std::string base64Secret = getEncryptedSecureData();
    std::string password = getPasswordSecureData();
    bool binary = false;
    std::string plaintext = decryptor::dec(base64Secret, password, binary);

    string hash;
    string halfString = base64Secret.substr(base64Secret.length() / 2);
    if (key == halfString)
    {
        return plaintext;
    }
    else
    {
        return "";
    }
}
