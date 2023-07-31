project(react-native-keys)
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME "react-native-keys")
set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)
set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)

if(${REACT_NATIVE_MINOR_VERSION} GREATER_EQUAL 71)
    # Consume shared libraries and headers from prefabs
    find_package(ReactAndroid REQUIRED CONFIG)

    include_directories(
        ${PACKAGE_NAME}
        "./androidcpp"
        "../cpp"
    )

    file(GLOB LIBRN_DIR "${BUILD_DIR}/react-native-0*/jni/${ANDROID_ABI}")
    message(STATUS "LIBRN_DIR: ${LIBRN_DIR}")

    add_library(
        ${PACKAGE_NAME}
        SHARED
        ./androidcpp/mediator.cpp
        ./cpp-adapter.cpp
        ../cpp/crypto.cpp
        ../cpp/decryptor.cpp
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

    find_package(openssl REQUIRED CONFIG)

    target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        ReactAndroid::jsi
        ReactAndroid::reactnativejni
        ReactAndroid::react_nativemodule_core
        android
        openssl::crypto
    )
else()
    add_library(
        ${PACKAGE_NAME}
        SHARED
        ../../react-native/ReactCommon/jsi/jsi/jsi.cpp
        ./androidcpp/mediator.cpp
        ./cpp-adapter.cpp
        ../cpp/crypto.cpp
        ../cpp/decryptor.cpp
    )

    include_directories(
        ../../react-native/React
        ../../react-native/React/Base
        ../../react-native/ReactCommon/jsi
        ./cpp
        ../cpp
    )

    set_target_properties(
        ${PACKAGE_NAME} PROPERTIES
        CXX_STANDARD 17
        CXX_EXTENSIONS OFF
        POSITION_INDEPENDENT_CODE ON
    )

    find_package(openssl REQUIRED CONFIG)

    target_link_libraries(
        ${PACKAGE_NAME}
        android
        openssl::crypto
    )
endif()
