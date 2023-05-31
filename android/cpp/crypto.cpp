
   #include "crypto.h"
  #include <string>
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringyfyData(string key) {
      std::string base64Secret = "U2FsdGVkX1+uvOTVCval0JYJjna6el2v8OeJ5vxwRgB7YF3NnYJkIRK5NvygXy1y7LDt08z9Ub5oX/TmMr36VsWRjbaXf6cpgGNQq1eZ2Yq2yZAo/IQUWu0yCkDIri0hAesHSWaYALnma8qqbDeRfJlyoVXO73M37HdRsr85vo4=";
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
  