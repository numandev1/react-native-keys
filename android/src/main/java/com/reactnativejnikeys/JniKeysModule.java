
  package com.reactnativejnikeys;
  import android.util.Log;
  
  import androidx.annotation.NonNull;
  
  import com.facebook.react.bridge.Promise;
  import com.facebook.react.bridge.ReactApplicationContext;
  import com.facebook.react.bridge.ReactContextBaseJavaModule;
  import com.facebook.react.bridge.ReactMethod;
  
  import org.json.JSONException;
  import org.json.JSONObject;
  
  public class JniKeysModule extends ReactContextBaseJavaModule {
      public static final String REACT_CLASS = "JniKeys";
      public static final String PRIVATE_KEY = "c8913b62407357b669fa6c0c27a1292d";
      private static ReactApplicationContext reactContext;
  
      static private JSONObject jniData;
  
      JniKeysModule(ReactApplicationContext context) {
          super(context);
          reactContext = context;
      }
  
  
      @ReactMethod
      static public void getKey(String key,Promise promise) {
          String value=getKeySync(key);
          promise.resolve(value);
      }
  
  
      static public String getKeySync(String key) {
  
          try {
              if (jniData == null)
                  jniData = new JSONObject(CLibController.getInstance().getJniJsonStringyfyData(PRIVATE_KEY));
  
              if (jniData.has(key)) {
                  return jniData.getString(key);
              }
          } catch (Exception ignore) {
              return "";
          }
          return "";
      }
  
      @ReactMethod
      public void sampleMethod(Promise promise) {
         promise.resolve("I am sample Methods");
      }
  
      @Override
      public String getName() {
          return REACT_CLASS;
      }
    }  
  