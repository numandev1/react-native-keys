
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
    private static ReactApplicationContext reactContext;

    private JSONObject jniData;

    JniKeysModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }


    @ReactMethod
    public String getKey(String key,Promise promise) {

        try {
            if (jniData == null)
                jniData = new JSONObject(CLibController.getInstance().getJniJsonStringyfyData());

            if (jniData.has(key)) {
                promise.resolve(jniData.getString(key));
            }
        } catch (Exception ignore) {
            promise.resolve("");
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
  