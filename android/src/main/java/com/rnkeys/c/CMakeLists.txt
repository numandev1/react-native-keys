
  cmake_minimum_required(VERSION 3.4.1)

  add_library(c-lib SHARED
        mediator.cpp
        crypto.cpp)
  