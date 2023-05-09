
  #include "crypto.h"
  #include <string>
  #include "encrypt.h"

  using namespace std;

    Crypto::Crypto() {

    }


    std::string Crypto::getJniJsonStringyfyData(string key) {
      std::string jsonStringyfyData= "{\"secure1\":\"staging secure1 value 11 1200 11\",\"secure2\":\"staging secure2 value\",\"secure3\":\"staging secure3 value\"}";
        string hash;
        int len=jsonStringyfyData.length();
        char cahrtot[len+1];
        strcpy(cahrtot,jsonStringyfyData.c_str());
        hash=SHA256(cahrtot);
        string halfString=hash.substr(hash.length()/2);
        if(key==halfString)
        {
          return jsonStringyfyData;
        }
        else
        {
            return "";
        }
      
    }
  