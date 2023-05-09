project("react-native-keys")
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME "cpp")
set(BUILD_DIR ./build)
set(CMAKE_CXX_STANDARD 17)

# Consume shared libraries and headers from prefabs
find_package(fbjni REQUIRED CONFIG)
find_package(ReactAndroid REQUIRED CONFIG)

include_directories(
        ${PACKAGE_NAME}
        "${NODE_MODULES_DIR}/react-native/React"
        "${NODE_MODULES_DIR}/react-native/React/Base"
        "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
        "./cpp"
        ${FOLLY_INCLUDE_DIR}
        "."
        "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/react/turbomodule"
)

file(GLOB LIBRN_DIR "${BUILD_DIR}/react-native-0*/jni/${ANDROID_ABI}")
message(STATUS "LIBRN_DIR: ${LIBRN_DIR}")

add_library(
        ${PACKAGE_NAME}
        SHARED
        ./cpp/mediator.cpp
        ./cpp/crypto.cpp
        ./cpp-adapter.cpp
)

find_library(
        LOG_LIB
        log
)

find_library(
        REACT_NATIVE_JNI_LIB
        reactnativejni
        PATHS ${LIBRN_DIR}
        NO_CMAKE_FIND_ROOT_PATH
)

set_target_properties(
        ${PACKAGE_NAME} PROPERTIES
        CXX_STANDARD 17
        CXX_EXTENSIONS OFF
        POSITION_INDEPENDENT_CODE ON
)

target_link_libraries(
        ${PACKAGE_NAME}
        ReactAndroid::turbomodulejsijni
        fbjni::fbjni
        ${LOG_LIB}
        ReactAndroid::jsi
        ReactAndroid::reactnativejni
        ReactAndroid::react_nativemodule_core
        android
)