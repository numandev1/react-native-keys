
   #include "crypto.h"
  #include <string>
  #include "decryptor.h"

  using namespace std;

  Crypto::Crypto() {

  }

  string Crypto::getJniJsonStringifyData(string key) {
      std::string base64Secret1 = "U2FsdGVkX199+I364h5jWqyctRTxfs71VpO171cahBoWf4m/sExs57WYLzGBfHT7YviRpyAt";
      std::string base64Secret2 = "s/Dk7rj1VsY7MvElsDbaLj4jhHT/y0EpT/wCSJw6NgZ3SIlM6eJKqvwDjRCZfMrBoPMwO3Aw";
      std::string base64Secret3 = "pj8YZTX+0gzzQ4OhdLiZpOUa8iPTyjSbUwelLLqD2nWAXT+dWzbsAeN8inNXNaJKbFMSpg==";
      std::string base64Secret = base64Secret1 + base64Secret2 + base64Secret3;
       std::string password = "3seCzMfVxah8";
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
  