
  #include <jni.h>
  #include <string>
  #include "crypto.hpp"



  extern "C" JNIEXPORT jstring JNICALL
  Java_com_entertainer_CLibController_getJniJsonStringyfyData(JNIEnv * env, jobject thiz) {
      auto *crypto = new Crypto();
      return env->NewStringUTF(crypto->getJniJsonStringyfyData().c_str());
  }
  