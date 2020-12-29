
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
    private static ReactApplicationContext reactContext;

    private JSONObject jniData;

    JniKeysModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        Log.e("JNI log", "JniKeysModule: "+getKey("nomi"));
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
        return "JniKeys";
    }
  }
  