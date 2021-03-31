
  #include "crypto.hpp"
  #include <string>
  #include "encrypt.h"

  using namespace std;

    Crypto::Crypto() {

    }


    std::string Crypto::getJniJsonStringyfyData(string key) {
      std::string jsonStringyfyData= "{\"abc\":\"12345678\",\"cde\":\"5678\",\"younas\":\"younas\",\"nomi\":\"123456\",\"iqbal\":\"nomi nomi\"}";
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
  