package com.reactnativekeysjsi

import android.content.res.Resources
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import org.json.JSONObject
import java.lang.reflect.Field


class KeysModule(reactContext: ReactApplicationContext) :
  NativeKeysSpec(reactContext) {
  private external fun nativeInstall(jsiPtr: Long)

  override fun install(): Boolean {
    try {
      val jsCallInvokerHolder =
        reactApplicationContext.javaScriptContextHolder
      this.nativeInstall(jsCallInvokerHolder!!.get())
      return true
    } catch (_: Exception) {
      return false
    }
  }

  public fun getPublicKeys(): MutableMap<String?, Any?> {
    val constants: MutableMap<String?, Any?> = HashMap<String?, Any?>()
    try {
      val resId: Int = this.reactApplicationContext.resources
        .getIdentifier("build_config_package", "string", this.reactApplicationContext.packageName)

      var className: String?
      try {
        className = this.reactApplicationContext.getString(resId)
      } catch (_: Resources.NotFoundException) {
        className = this.reactApplicationContext.packageName
      }
      val clazz = Class.forName("$className.BuildConfig")

      val fields: Array<Field> = clazz.declaredFields
      for (f in fields) {
        try {
          constants.put(f.name, f.get(null))
        } catch (_: IllegalAccessException) {
          Log.d("ReactNative", "ReactConfig: Could not access BuildConfig field " + f.name)
        }
      }
    } catch (_: ClassNotFoundException) {
      Log.d("ReactNative", "ReactConfig: Could not find BuildConfig class")
    }

    return constants
  }
  companion object {
    init {
      System.loadLibrary("react-native-keys");
    }
    const val NAME = NativeKeysSpec.NAME

    @JvmStatic
    external fun getJniJsonStringifyData(key: String): String

    @JvmStatic
    fun getSecureFor(key: String): String {
      var jniData: JSONObject? = null
      try {
        val privateKey = PrivateKey.privatekey
        val jsonString = getJniJsonStringifyData(privateKey)
        jniData = JSONObject(jsonString)
        if (jniData.has(key)) {
          return jniData.getString(key)
        }
      } catch (ignore: java.lang.Exception) {
        return ""
      }
      return ""
    }
  }
}
