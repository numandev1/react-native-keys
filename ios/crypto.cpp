
   #include "crypto.h"
  #include <string>
  #include "decryptor.cpp"
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringyfyData(string key) {
      std::string base64Secret = "U2FsdGVkX18IH3Ety1jYeC427casDIBviIHEX4a/Wj9n+mC35JmTMbWv8gT8dAtrdSBM8zQWUBnqFWegV1JwQs311+PrBdKydxlIFoTY8OOGVvDKlKkxTuFzMvCOs9OHlrnvlhY9+Z6XbA4P9gLGOfalgZon3XQRwi7B5LlmtZA=";
      std::string password = "asdf@1234";
      bool binary = false;
      std::string plaintext = decryptor::dec(base64Secret, password,binary);

      string hash;
      string halfString=base64Secret.substr(base64Secret.length()/2);
      if(key==halfString)
      {
          return plaintext;
      }
      else
      {
          return "";
      }
  }
  