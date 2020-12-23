
  #include "crypto.hpp"
  #include <string>
  Crypto::Crypto() {
  
  }


  std::string Crypto::getJniJsonStringyfyData() {
    std::string jsonStringyfyData= "{\"abc\":\"12345678\",\"cde\":\"5678\",\"younas\":\"younas\",\"nomi\":\"123456\"}"; //Any chars will work
    return jsonStringyfyData;
  }

  