#include <jni.h>
#include <sys/types.h>
#include "pthread.h"
#include <jsi/jsi.h>
#include <map>
#include <android/log.h>
#include <string>

#include <sstream>
#include <iomanip>

#include "androidcpp/json.hpp"
using json = nlohmann::json;

using namespace facebook::jsi;
using namespace std;

JavaVM *java_vm;
jclass java_class;
jobject java_object;

std::string jstringToString(JNIEnv *env, jstring jstr)
{
    const char *cstr = env->GetStringUTFChars(jstr, nullptr);
    std::string str(cstr);
    env->ReleaseStringUTFChars(jstr, cstr);
    return str;
}

// Convert Java map object to JSON string
std::string jmapToJsonString(JNIEnv *env, jobject jmap)
{
    jclass jmapClass = env->GetObjectClass(jmap);
    jmethodID jmapEntrySetMethod = env->GetMethodID(jmapClass, "entrySet", "()Ljava/util/Set;");

    jclass jsetClass = env->FindClass("java/util/Set");
    jmethodID jsetIteratorMethod = env->GetMethodID(jsetClass, "iterator", "()Ljava/util/Iterator;");

    jclass jiteratorClass = env->FindClass("java/util/Iterator");
    jmethodID jiteratorHasNextMethod = env->GetMethodID(jiteratorClass, "hasNext", "()Z");
    jmethodID jiteratorNextMethod = env->GetMethodID(jiteratorClass, "next", "()Ljava/lang/Object;");

    jclass jmapEntryClass = env->FindClass("java/util/Map$Entry");
    jmethodID jmapEntryGetMethod = env->GetMethodID(jmapEntryClass, "getValue", "()Ljava/lang/Object;");

    jmethodID jtoStringMethod = env->GetMethodID(env->FindClass("java/lang/Object"), "toString", "()Ljava/lang/String;");

    // Create an empty JSON object
    nlohmann::json jsonObj = nlohmann::json::object();

    // Get the entry set of the Java map object
    jobject jentrySet = env->CallObjectMethod(jmap, jmapEntrySetMethod);
    jobject jiterator = env->CallObjectMethod(jentrySet, jsetIteratorMethod);
    jmethodID jmapEntryGetKeyMethod = env->GetMethodID(jmapEntryClass, "getKey", "()Ljava/lang/Object;");

    // Iterate over the map entries and add them to the JSON object
    while (env->CallBooleanMethod(jiterator, jiteratorHasNextMethod))
    {
        jobject jentry = env->CallObjectMethod(jiterator, jiteratorNextMethod);

        // Get the key object and convert it to a string
        jobject jkey = env->CallObjectMethod(jentry, jmapEntryGetKeyMethod);
        jstring jstrKey = (jstring)env->CallObjectMethod(jkey, jtoStringMethod);
        std::string strKey = jstringToString(env, jstrKey);

        // Get the value object and convert it to a string
        jobject jvalue = env->CallObjectMethod(jentry, jmapEntryGetMethod);
        jstring jstrValue = (jstring)env->CallObjectMethod(jvalue, jtoStringMethod);
        std::string strValue = jstringToString(env, jstrValue);

        // Add the key-value pair to the JSON object
        jsonObj[strKey] = strValue;

        // Release local references
        env->DeleteLocalRef(jentry);
        env->DeleteLocalRef(jkey);
        env->DeleteLocalRef(jvalue);
        env->DeleteLocalRef(jstrKey);
        env->DeleteLocalRef(jstrValue);
    }

    // Release local references
    env->DeleteLocalRef(jentrySet);
    env->DeleteLocalRef(jiterator);

    // Return the JSON object as a string
    return jsonObj.dump();
}
/**
 * A simple callback function that allows us to detach current JNI Environment
 * when the thread
 * See https://stackoverflow.com/a/30026231 for detailed explanation
 */

void DeferThreadDetach(JNIEnv *env)
{
    static pthread_key_t thread_key;

    // Set up a Thread Specific Data key, and a callback that
    // will be executed when a thread is destroyed.
    // This is only done once, across all threads, and the value
    // associated with the key for any given thread will initially
    // be NULL.
    static auto run_once = []
    {
        const auto err = pthread_key_create(&thread_key, [](void *ts_env)
                                            {
            if (ts_env) {
                java_vm->DetachCurrentThread();
            } });
        if (err)
        {
            // Failed to create TSD key. Throw an exception if you want to.
        }
        return 0;
    }();

    // For the callback to actually be executed when a thread exits
    // we need to associate a non-NULL value with the key on that thread.
    // We can use the JNIEnv* as that value.
    const auto ts_env = pthread_getspecific(thread_key);
    if (!ts_env)
    {
        if (pthread_setspecific(thread_key, env))
        {
            // Failed to set thread-specific value for key. Throw an exception if you want to.
        }
    }
}

/**
 * Get a JNIEnv* valid for this thread, regardless of whether
 * we're on a native thread or a Java thread.
 * If the calling thread is not currently attached to the JVM
 * it will be attached, and then automatically detached when the
 * thread is destroyed.
 *
 * See https://stackoverflow.com/a/30026231 for detailed explanation
 */
JNIEnv *GetJniEnv()
{
    JNIEnv *env = nullptr;
    // We still call GetEnv first to detect if the thread already
    // is attached. This is done to avoid setting up a DetachCurrentThread
    // call on a Java thread.

    // g_vm is a global.
    auto get_env_result = java_vm->GetEnv((void **)&env, JNI_VERSION_1_6);
    if (get_env_result == JNI_EDETACHED)
    {
        if (java_vm->AttachCurrentThread(&env, NULL) == JNI_OK)
        {
            DeferThreadDetach(env);
        }
        else
        {
            // Failed to attach thread. Throw an exception if you want to.
        }
    }
    else if (get_env_result == JNI_EVERSION)
    {
        // Unsupported JNI version. Throw an exception if you want to.
    }
    return env;
}

static jstring string2jstring(JNIEnv *env, const string &str)
{
    return (*env).NewStringUTF(str.c_str());
}

void install(facebook::jsi::Runtime &jsiRuntime)
{
    auto secureFor = Function::createFromHostFunction(jsiRuntime,
                                                      PropNameID::forAscii(jsiRuntime,
                                                                           "secureFor"),
                                                      1,
                                                      [](Runtime &runtime,
                                                         const Value &thisValue,
                                                         const Value *arguments,
                                                         size_t count) -> Value
                                                      {
                                                          string key = arguments[0].getString(
                                                                                       runtime)
                                                                           .utf8(
                                                                               runtime);

                                                          JNIEnv *jniEnv = GetJniEnv();

                                                          java_class = jniEnv->GetObjectClass(
                                                              java_object);
                                                          jmethodID jniMethod = jniEnv->GetStaticMethodID(java_class, "getSecureFor", "(Ljava/lang/String;)Ljava/lang/String;");

                                                          jstring jstr1 = string2jstring(jniEnv, key);
                                                          jobject result = jniEnv->CallStaticObjectMethod(java_class, jniMethod, jstr1);
                                                          const char* str = jniEnv->GetStringUTFChars((jstring)result, NULL);

                                                          return Value(runtime,
                                                                       String::createFromUtf8(
                                                                           runtime, str));
                                                      });

    jsiRuntime.global().setProperty(jsiRuntime, "secureFor", move(secureFor));

    auto publicKeys = Function::createFromHostFunction(jsiRuntime,
                                                       PropNameID::forAscii(jsiRuntime,
                                                                            "publicKeys"),
                                                       0,
                                                       [](Runtime &runtime,
                                                          const Value &thisValue,
                                                          const Value *arguments,
                                                          size_t count) -> Value
                                                       {
                                                           JNIEnv *jniEnv = GetJniEnv();

                                                           java_class = jniEnv->GetObjectClass(
                                                               java_object);
                                                           jmethodID get = jniEnv->GetMethodID(
                                                               java_class, "getPublicKeys",
                                                               "()Ljava/util/Map;");

                                                           jobject map_obj = jniEnv->CallObjectMethod(java_object, get);

                                                           std::string jsonString = jmapToJsonString(jniEnv, map_obj);

                                                           return Value(runtime,
                                                                        String::createFromUtf8(
                                                                            runtime, jsonString));
                                                       });

    jsiRuntime.global().setProperty(jsiRuntime, "publicKeys", move(publicKeys));
}

extern "C" JNIEXPORT void JNICALL
Java_com_reactnativekeysjsi_KeysModule_nativeInstall(JNIEnv *env, jobject thiz, jlong jsi)
{

    auto runtime = reinterpret_cast<facebook::jsi::Runtime *>(jsi);

    if (runtime)
    {
        // example::install(*runtime);
        install(*runtime);
    }

    env->GetJavaVM(&java_vm);
    java_object = env->NewGlobalRef(thiz);
}
