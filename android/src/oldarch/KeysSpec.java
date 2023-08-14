package com.reactnativekeysjsi;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;

abstract class KeysSpec extends ReactContextBaseJavaModule {
  KeysSpec(ReactApplicationContext context) {
    super(context);
  }
  public abstract boolean install();

}
