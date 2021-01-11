
  package com.reactnativejnikeys;

  public class CLibController {

      private static final CLibController ourInstance = new CLibController();

      public static CLibController getInstance() {
          return ourInstance;
      }

      private CLibController() {
      }

      public native String getJniJsonStringyfyData(String key);

      static{
          System.loadLibrary("c-lib");
      }
  }