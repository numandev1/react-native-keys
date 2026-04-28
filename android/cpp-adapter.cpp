#include <jni.h>
#include <jsi/jsi.h>
#include "pthread.h"
#include <fbjni/fbjni.h>
#include <string>

#include "androidcpp/json.hpp"

using json = nlohmann::json;

using namespace facebook;
using namespace jsi;
using namespace std;

static JavaVM *java_vm;
static jobject java_object;

static string jstringToString(JNIEnv *env, jstring jstr) {
    const char *cstr = env->GetStringUTFChars(jstr, nullptr);
    string str(cstr);
    env->ReleaseStringUTFChars(jstr, cstr);
    return str;
}

static string jmapToJsonString(JNIEnv *env, jobject jmap) {
    jclass jmapClass = env->GetObjectClass(jmap);
    jmethodID jmapEntrySetMethod = env->GetMethodID(jmapClass, "entrySet", "()Ljava/util/Set;");

    jclass jsetClass = env->FindClass("java/util/Set");
    jmethodID jsetIteratorMethod = env->GetMethodID(jsetClass, "iterator", "()Ljava/util/Iterator;");

    jclass jiteratorClass = env->FindClass("java/util/Iterator");
    jmethodID jiteratorHasNextMethod = env->GetMethodID(jiteratorClass, "hasNext", "()Z");
    jmethodID jiteratorNextMethod = env->GetMethodID(jiteratorClass, "next", "()Ljava/lang/Object;");

    jclass jmapEntryClass = env->FindClass("java/util/Map$Entry");
    jmethodID jmapEntryGetMethod = env->GetMethodID(jmapEntryClass, "getValue", "()Ljava/lang/Object;");
    jmethodID jmapEntryGetKeyMethod = env->GetMethodID(jmapEntryClass, "getKey", "()Ljava/lang/Object;");

    jmethodID jtoStringMethod = env->GetMethodID(env->FindClass("java/lang/Object"), "toString", "()Ljava/lang/String;");

    json jsonObj = json::object();

    jobject jentrySet = env->CallObjectMethod(jmap, jmapEntrySetMethod);
    jobject jiterator = env->CallObjectMethod(jentrySet, jsetIteratorMethod);

    while (env->CallBooleanMethod(jiterator, jiteratorHasNextMethod)) {
        jobject jentry = env->CallObjectMethod(jiterator, jiteratorNextMethod);

        jobject jkey = env->CallObjectMethod(jentry, jmapEntryGetKeyMethod);
        jstring jstrKey = (jstring) env->CallObjectMethod(jkey, jtoStringMethod);
        string strKey = jstringToString(env, jstrKey);

        jobject jvalue = env->CallObjectMethod(jentry, jmapEntryGetMethod);
        jstring jstrValue = (jstring) env->CallObjectMethod(jvalue, jtoStringMethod);
        string strValue = jstringToString(env, jstrValue);

        jsonObj[strKey] = strValue;

        env->DeleteLocalRef(jentry);
        env->DeleteLocalRef(jkey);
        env->DeleteLocalRef(jvalue);
        env->DeleteLocalRef(jstrKey);
        env->DeleteLocalRef(jstrValue);
    }

    env->DeleteLocalRef(jentrySet);
    env->DeleteLocalRef(jiterator);

    return jsonObj.dump();
}

static pthread_key_t thread_key;

static void detachThread(void *ts_env) {
    if (ts_env) {
        java_vm->DetachCurrentThread();
    }
}

static pthread_once_t thread_key_once = PTHREAD_ONCE_INIT;

static JNIEnv *GetJniEnv() {
    pthread_once(&thread_key_once, [] {
        pthread_key_create(&thread_key, detachThread);
    });

    JNIEnv *env = nullptr;
    auto get_env_result = java_vm->GetEnv((void **) &env, JNI_VERSION_1_6);
    if (get_env_result == JNI_EDETACHED) {
        if (java_vm->AttachCurrentThread(&env, NULL) == JNI_OK) {
            if (!pthread_getspecific(thread_key)) {
                pthread_setspecific(thread_key, env);
            }
        }
    }
    return env;
}

static jstring string2jstring(JNIEnv *env, const string &str) {
    return env->NewStringUTF(str.c_str());
}

template<typename NativeFunc>
static void createFunc(Runtime &jsiRuntime, const char *prop, int paramCount, NativeFunc &&func) {
    auto f = Function::createFromHostFunction(jsiRuntime,
                                              PropNameID::forAscii(jsiRuntime, prop),
                                              paramCount,
                                              std::forward<NativeFunc>(func));
    jsiRuntime.global().setProperty(jsiRuntime, prop, std::move(f));
}

#define CREATE_FUNCTION(prop, paramCount, block) \
    createFunc(jsiRuntime, prop, paramCount, [](Runtime &runtime, const Value &thisValue, const Value *arguments, size_t count) -> Value { block })

void installBindings(Runtime &jsiRuntime) {
    CREATE_FUNCTION("publicKeys", 0, {
        JNIEnv *jniEnv = GetJniEnv();
        jclass clazz = jniEnv->GetObjectClass(java_object);
        jmethodID get = jniEnv->GetMethodID(clazz, "getPublicKeys", "()Ljava/util/Map;");
        jobject map_obj = jniEnv->CallObjectMethod(java_object, get);
        std::string jsonString = jmapToJsonString(jniEnv, map_obj);
        return Value(runtime,
                     String::createFromUtf8(
                             runtime, jsonString));
    });

    CREATE_FUNCTION("secureFor", 1, {
        string key = arguments[0].getString(runtime).utf8(runtime);
        JNIEnv *jniEnv = GetJniEnv();
        jclass clazz = jniEnv->GetObjectClass(java_object);
        jmethodID jniMethod = jniEnv->GetStaticMethodID(clazz, "getSecureFor", "(Ljava/lang/String;)Ljava/lang/String;");
        jstring jstr1 = string2jstring(jniEnv, key);
        jobject result = jniEnv->CallStaticObjectMethod(clazz, jniMethod, jstr1);
        const char *str = jniEnv->GetStringUTFChars((jstring) result, NULL);
        return Value(runtime,
                     String::createFromUtf8(
                             runtime, str));
    });
}

struct RNMMKVModule : jni::JavaClass<RNMMKVModule> {
    static constexpr auto kJavaDescriptor = "Lcom/reactnativekeysjsi/KeysModule;";

    static void registerNatives() {
        javaClassStatic()->registerNatives({
            makeNativeMethod("nativeInstall", RNMMKVModule::install)
        });
    }

private:
    static void install(jni::alias_ref<jni::JObject> thiz, jlong jsi) {
        auto runtime = reinterpret_cast<jsi::Runtime *>(jsi);
        jni::Environment::current()->GetJavaVM(&java_vm);
        java_object = jni::Environment::current()->NewGlobalRef(thiz.get());
        if (runtime) {
            installBindings(*runtime);
        }
    }
};

JNIEXPORT jint JNI_OnLoad(JavaVM *jvm, void *) {
    return jni::initialize(java_vm, [] { RNMMKVModule::registerNatives(); });
}
