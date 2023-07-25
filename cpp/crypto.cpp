
   #include "crypto.h"
  #include <string>
  // #include "decryptor.cpp"
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringyfyData(string key) {
      std::string base64Secret1 = "U2FsdGVkX19YWrzXkbERDFR2kWtYzJPkq3LnVFpcSnbv1CEwjwWMGCIKWa";
      std::string base64Secret2 = "BGS3nmYHhHF9IdAb50fTAawjCPpsYDXdS+SRZx3BHLN79sQz0qUY394HTL";
      std::string base64Secret3 = "3gc/bMtxhJtl5EcEXRxrczqhHjCidBEH7vmT6inTKoxr92glFl9yU+0=";
      std::string base64Secret = base64Secret1 + base64Secret2 + base64Secret3;
       std::string password = "LFsqCW2QRPlu";
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
  