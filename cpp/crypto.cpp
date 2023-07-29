
   #include "crypto.h"
  #include <string>
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringifyData(string key) {
      std::string base64Secret1 = "U2FsdGVkX19lgRN4srwXt2D2LYi+baTRYsKl2mygm7ASNIWFynY+bxsDrbKAr2MZnI0flTXS";
      std::string base64Secret2 = "DPWi+ilmqhX7RviqMInOjQ/dRUApNhJW3/Sqk0bymYdpGsZVFHIEEZVtzWgvGs0R6xxSgFN7";
      std::string base64Secret3 = "wxkm/50HMLQZFQt55CR4VItVw6nrLfXATPXRxSiLHSDXvsvUupzfYPAodZsxx9VxlWBZ7g==";
      std::string base64Secret = base64Secret1 + base64Secret2 + base64Secret3;
       std::string password = "u4IxXxapI6zg";
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
  