module.exports.makeCppFileTemplateAndroid = (data) => {
  return `
  #include "crypto.hpp"
  #include <string>
  Crypto::Crypto() {
  
  }


  std::string Crypto::getJniJsonStringyfyData() {
    std::string jsonStringyfyData= "${data}"; //Any chars will work
    return jsonStringyfyData;
  }
  `;
};

module.exports.makeHppFileTemplateAndroid = () => {
  return `
  #ifndef crypto_hpp
  #define crypto_hpp

  #include <stdio.h>
  #include <string>

  class Crypto {
  public:Crypto();
    std::string getJniJsonStringyfyData();
  };
  #endif
  
  `;
};

module.exports.makeCMakeListsTemplateAndroid = () => {
  return `
  cmake_minimum_required(VERSION 3.4.1)

  add_library(c-lib SHARED
        mediator.cpp
        crypto.cpp)
  `;
};

module.exports.makeMediatorTemplateAndroid = () => {
  return `
  
  #include <jni.h>
  #include <string>
  #include "crypto.hpp"



  extern "C" JNIEXPORT jstring JNICALL
  Java_com_reactnativejnikeys_CLibController_getJniJsonStringyfyData(JNIEnv * env, jobject thiz) {
      auto *crypto = new Crypto();
      return env->NewStringUTF(crypto->getJniJsonStringyfyData().c_str());
  }
  `;
};

module.exports.makeCLibControllerTemplateAndroid = () => {
  return `
  package com.jnidata;

  public class CLibController {

      private static final CLibController ourInstance = new CLibController();

      public static CLibController getInstance() {
          return ourInstance;
      }

      private CLibController() {
      }

      public native String getJniJsonStringyfyData();

      static{
          System.loadLibrary("c-lib");
      }
  }

  `;
};

module.exports.makeCryptographicModuleTemplateAndroid = () => {
  return `
package com.jnidata;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;
import org.json.JSONObject;

public class CryptographicModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    private JSONObject jniData;

    CryptographicModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }


    // the package will be used by this name in javascript
    public String getKey(String key) {

        try {
            if (jniData == null)
                jniData = new JSONObject(CLibController.getInstance().getJniJsonStringyfyData());

            if (jniData.has(key))
                return jniData.getString(key);
        } catch (Exception ignore) {
        }


        return "";
    }

    @ReactMethod
    public void sampleMethod(Promise promise) {
       promise.resolve("I am sample Methods");
    }

    @NonNull
    @Override
    public String getName() {
        return null;
    }
  }
  `;
};

module.exports.makeCryptographicPackageTemplateAndroid = () => {
  return `
  // CustomToastPackage.java

  package com.jnidata;
  
  import com.facebook.react.ReactPackage;
  import com.facebook.react.bridge.NativeModule;
  import com.facebook.react.bridge.ReactApplicationContext;
  import com.facebook.react.uimanager.ViewManager;
  
  import java.util.ArrayList;
  import java.util.Collections;
  import java.util.List;
  
  public class CryptographicPackage implements ReactPackage {
  
      @Override
      public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
          return Collections.emptyList();
      }
  
      @Override
      public List<NativeModule> createNativeModules(
              ReactApplicationContext reactContext) {
          List<NativeModule> modules = new ArrayList<>();
  
          modules.add(new CryptographicModule(reactContext));
  
          return modules;
      }
  
  }
  `;
};
