
   #include "crypto.h"
  #include <string>
  #include "decryptor.cpp"
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringyfyData(string key) {
      std::string base64Secret = "U2FsdGVkX1/UMOtZDFe4MXICpo6PG1owJ05gsZlsm9+nw24Oiop5GfL4wxtjRIcQGioS4vu2ciGryMhLed9bi8zluac10wWaEMkf8PbcIZ8Erbtu3prN6H3AwpgyBTLN/Bawg8TxjhiOCFPb6PswGR5BjPYD8YF1O2tcgYECofE=";
       std::string password = "QWLqiT85EaY2";
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
  