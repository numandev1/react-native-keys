
   #include "crypto.h"
  #include <string>
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringifyData(string key) {
      std::string base64Secret1 = "U2FsdGVkX18WCoAQlB0qyhBdFJQMwtn2lUeiF3GD1uT1sY6M4m+qzDRxl45EOrUexbEcuYdO";
      std::string base64Secret2 = "v3eNgZZ/kDEPMJNDLu8OAu1dzNo/gLSZWkzl8sQrHyxSbdJCiVhdrAPceBR0ekPaQfmz8gXu";
      std::string base64Secret3 = "UbJ7cEdqxmiunIb6Va/Nr8Jj8XCdTMZfrr/+iTNVr6/BqWOIdwsMHbpdQgUMMsWtkOM9qg==";
      std::string base64Secret = base64Secret1 + base64Secret2 + base64Secret3;
       std::string password = "nH4QVBty9DRr";
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
  