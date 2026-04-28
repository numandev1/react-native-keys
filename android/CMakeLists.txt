project(react-native-keys)
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME "react-native-keys")
set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)
set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)

set(CPP_DIR ${CMAKE_SOURCE_DIR}/androidcpp)

if(${ANDROID_ABI} STREQUAL "arm64-v8a")
    set(LIB_ARCH "arm64-v8a")
elseif(${ANDROID_ABI} STREQUAL "armeabi-v7a")
    set(LIB_ARCH "armeabi-v7a")
elseif(${ANDROID_ABI} STREQUAL "x86")
    set(LIB_ARCH "x86")
elseif(${ANDROID_ABI} STREQUAL "x86_64")
    set(LIB_ARCH "x86_64")
else()
    set(LIB_ARCH "arm64-v8a")  # Default fallback
endif()

set(OPENSSL_LIB_DIR ${CPP_DIR}/libs/${LIB_ARCH})
set(OPENSSL_INCLUDE_DIR ${CPP_DIR}/include)


add_library(openssl_crypto STATIC IMPORTED)
set_target_properties(openssl_crypto PROPERTIES
    IMPORTED_LOCATION ${OPENSSL_LIB_DIR}/libcrypto.a
)

find_package(ReactAndroid REQUIRED CONFIG)

include_directories(
    ${PACKAGE_NAME}
    "./androidcpp"
    "../cpp"
    ${OPENSSL_INCLUDE_DIR}
)

add_library(
    ${PACKAGE_NAME}
    SHARED
    ./androidcpp/mediator.cpp
    ./cpp-adapter.cpp
    ../cpp/crypto.cpp
    ../cpp/decryptor.cpp
)

find_package(fbjni REQUIRED CONFIG)
find_library(
    reactnativejni
    PATHS ${LIBRN_DIR}
    NO_CMAKE_FIND_ROOT_PATH
)

# Include directories cho target
target_include_directories(${PACKAGE_NAME} PRIVATE
    ${OPENSSL_INCLUDE_DIR}
    ${OPENSSL_INCLUDE_DIR}/openssl
    ${CPP_DIR}
    ./androidcpp
    ../cpp
)

target_link_libraries(
    ${PACKAGE_NAME}
    ReactAndroid::jsi
    android
    openssl_crypto
    ReactAndroid::reactnative
    fbjni::fbjni
)
